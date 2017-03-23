// ╔═╗┌─┐┌┬┐┌─┐┬─┐  ┬  ┬┌─┐┌┐┌  ╔╦╗┬ ┬┬ ┬┬ ┬┬  ┬┌─┐┬─┐
// ╠═╝├┤  │ ├┤ ├┬┘  └┐┌┘├─┤│││   ║ ││││ │└┬┘└┐┌┘├┤ ├┬┘
// ╩  └─┘ ┴ └─┘┴└─   └┘ ┴ ┴┘└┘   ╩ └┴┘└─┘ ┴  └┘ └─┘┴└─  
// student number 10872809, mar 2017 
// WEEKOPDRACHT 6-7
window.onload = function() {

    var globalAgegroups = {};
    d3.queue()
        .defer(d3.json, "worldpopulation.json", function(error, worldpopulation) {
            if (error) throw error;
            // draw map 
            drawMap(worldpopulation);
        })
        .defer(d3.json, "landcodes.json", function(error, agegroups) {
            if (error) throw error;

            globalAgegroups = agegroups;

        })
        .await(ready);

    function ready(error, worldpopulation, agegroups) {
        if (error) throw error;
    };
    // provide country specific age-data to the drawBars function
    function clickCountry(code) {
        drawBars(globalAgegroups[code], code)
    }

    function drawBars(agegroups, country) {
        //remove previous svg when present
        var svg = d3.select("#barchart_svg");
        if (svg !== undefined)
            svg.remove();

        var margin = {
                top: 20,
                right: 20,
                bottom: 200,
                left: 100
            },
            width = 3000 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // set the ranges, small gap between the bars (0.5)
        var x = d3.scale.ordinal().rangeRoundBands([0, width], .5);
        var y = d3.scale.linear().range([height, 0]);

        // create the tooltip for hover effect (based on W3schools.com)
        var hover = d3.select("body").append("hover")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // create x axis at bottom
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")

        // create y axis on left side
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(20);

        // svg element in body
        var svg = d3.select("#barchart").append("svg")
            .attr("id", "barchart_svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // create new dataset for one selected country
        var dataset = {
            country: globalAgegroups[country]
        };
        var CountryName;
        var ages;
        var percentages;
        var singleCountry = [];

        Object.keys(dataset).forEach(function(key) {
            CountryName = key;
            ages = Object.keys(dataset[key]);
            percentages = Object.values(dataset[key]);
            singleCountry.push([CountryName, ages, percentages]);
        });

        // scale the range of the data
        x.domain(singleCountry[0][2]).rangeRoundBands([0, x.rangeBand()]);
        y.domain([0, 100])

        // barchart title
        svg.append('text')
            .attr("class", "title")
            .text('Distribution agegroups 0-14 years/ 15-66 years/ 65+ in 1960 and 2015 ')
            .attr('x', 100)
            .attr('y', 0)
            .attr('fill', 'black')
        // x axis title
        svg.append('text')
            .attr("class", "axis")
            .text('(Agegroups)')
            .attr('x', 550)
            .attr('y', 400)
            .attr('fill', 'black')
        // append the two axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            // rotate text for readability
            .attr("transform", "rotate(-45)");
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-0)")
            .attr("y", -20)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Percentage");

        // create barchart 
        svg.selectAll("bar")
            .data(singleCountry[0][2])
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) {
                return x(d)
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d, i) {
                return y(d)
            })
            .attr("height", function(d, i) {
                return height - y(d)
            })
            // hover function with additiona information window
            .on("mouseover", function(d) {
                hover.transition()
                    .duration(200)
                    .style("opacity", .9);
                hover.html("<b>" + Number(d).toFixed(2) + "% of total population" + "</b>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 128) + "px");
            })
            .on("mouseout", function(d) {
                hover.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }

    // based on code from https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
    function drawMap(worldpopulation) {

        var series = [];
        d3.json("worldpopulation.json", function(error, data) {
            if (error) throw (error);
            data.forEach(function(d) {
                // change strings into real numbers
                d.year2015 = +d.year2015;
                d.sixty = +d.sixty;
                // create new array with prefered format
                series.push([d.CountryCode, d.year2015, d.sixty]);
            });

            var datasetMap = {};
            // determine min and max value in dataset based on obj[1] (2015)
            // devide values by 25 to create less space in color-range
            var onlyValues = series.map(function(obj) {
                return obj[1] / 25;
            });
            var minValue = Math.min.apply(null, onlyValues),
                maxValue = Math.max.apply(null, onlyValues);

            // create min-max color palette based on two colors 
            var paletteScale = d3.scale.linear()
                .domain([minValue, maxValue])
                .range(["#fee0d2", "#de2d26"]);

            // create new dataset with fillcolors included
            series.forEach(function(item) {
                var iso = item[0],
                    currentPop = item[1];
                sixtyPop = item[2];
                datasetMap[iso] = {
                    Population: currentPop,
                    fillColor: paletteScale(currentPop),
                    sixtyPopulation: sixtyPop
                };
            });

            // draw map
            new Datamap({
                element: document.getElementById('container'),
                projection: 'mercator',
                fills: {
                    defaultFill: '#F5F5F5'
                },
                data: datasetMap,
                history: series,
                geographyConfig: {
                    borderColor: '#DEDEDE',
                    highlightBorderWidth: 2,
                    // don't change color on mouse hover
                    highlightFillColor: function(geo) {
                        return geo['fillColor'] || '#F5F5F5';
                    },
                    // change border color on mouseover
                    highlightBorderColor: '#B7B7B7',
                    // show info tooltip
                    popupTemplate: function(geo, data) {
                        // if country not present in dataset
                        if (!data) {
                            return ['<div class="hoverinfo">',
                                'No data available for this region',
                                '</div>'
                            ].join('');
                        }
                        // tooltip info 1960 and 2015
                        return ['<div class="hoverinfo">',
                            '<strong>', geo.properties.name, '</strong>',
                            '<br>Population in 2015: <strong>', data.Population / 1000000, '</strong>', ' Milion',
                            '<br>Population in 1960: <strong>', data.sixtyPopulation / 1000000, '</strong>', ' Milion',
                            '</div>'
                        ].join('');
                    }
                },
                done: function(datamap) {
                    datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
                        // send countrycode to clickCountry function
                        var code = geo.id
                        clickCountry(code);
                    });
                },
            });
            // create legendbar:
            // based on code from https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
            // create new svg element in body
            var svg = d3.select("#legend").append("svg")
                .attr("width", 1000)
                .attr("height", 30)
            //Append a defs (for definition) element to SVG
            var defs = svg.append("defs");
            //Append a linearGradient element to the defs and give it a unique id
            var linearGradient = defs.append("linearGradient")
                .attr("id", "linear-gradient");
            //Horizontal gradient
            linearGradient
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%");
            //A color scale for 3 colors
            var colorScale = d3.scale.linear()
                .range(["#fee0d2", "#de2d26", "(#de2d26*25)"]);
            //Append  color gradient
            linearGradient.selectAll("stop")
                .data(colorScale.range())
                .enter().append("stop")
                .attr("offset", function(d, i) {
                    return i / (colorScale.range().length - 1);
                })
                .attr("stop-color", function(d) {
                    return d;
                });
            //Draw the rectangle and fill with gradient
            svg.append("rect")
                .attr("width", 800)
                .attr("height", 20)
                .style("fill", "url(#linear-gradient)");
            svg.append('text')
                .attr("class", "legend")
                .text('< 1 milion')
                .style("text-anchor", "start")
                .attr('x', 2)
                .attr('y', 15)
                .attr('fill', 'black')
            svg.append('text')
                .attr("class", "legend")
                .text('1,3 Bilion')
                .style("text-anchor", "end")
                .attr('x', 798)
                .attr('y', 15)
                .attr('fill', 'white')

        });
    };
}; // window onload