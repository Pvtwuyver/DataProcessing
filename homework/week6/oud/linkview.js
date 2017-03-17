// ╔═╗┌─┐┌┬┐┌─┐┬─┐  ┬  ┬┌─┐┌┐┌  ╔╦╗┬ ┬┬ ┬┬ ┬┬  ┬┌─┐┬─┐
// ╠═╝├┤  │ ├┤ ├┬┘  └┐┌┘├─┤│││   ║ ││││ │└┬┘└┐┌┘├┤ ├┬┘
// ╩  └─┘ ┴ └─┘┴└─   └┘ ┴ ┴┘└┘   ╩ └┴┘└─┘ ┴  └┘ └─┘┴└─  
// student number 10872809, maart 2017 
// WEEKOPDRACHT 6, Linked Views IN D3


//ZIE CODE OP: http://bl.ocks.org/NPashaP/96447623ef4d342ee09b

window.onload = function() {

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scale.ordinal(["#98abc5", "#ff8c00"]);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 35)
    .innerRadius(radius - 35);
var series = [];


queue()
    .defer(d3.json, "worldpopulation.json", function(error, data) {
        if (error) throw (error);
        data.forEach(function(d) {
            // change strings into real numbers
            d.tweeduizendvijftien = +d.tweeduizendvijftien;
            d.sixty = +d.sixty;
            // create new array with prefered format
            series.push([d.CountryCode, d.tweeduizendvijftien, d.sixty]);
        });

        var dataset = {};
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
            dataset[iso] = {
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
            data: dataset,
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
            }
        });
})




    .defer(d3.csv, "test.csv", function(d) {
  return {
    population : +d.population,
    Series : d.Series,
    country : d.Country,
  }
  })
    .await(ready);
    

function ready(error, populationdata, urbandata) {
console.log(urbandata)
            // pie chart
            var arc = g.selectAll(".arc")
              .data(pie(urbandata))
              .enter().append("g")
                .attr("class", "arc");
            arc.append("path")
                .attr("d", path)
                .attr("fill", function(d) { return color(d.data.population); });
            arc.append("text")
                .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
                .attr("dy", "0.35em")
                .text(function(d) { return d.data.Series + " :" + d.data.population/1000000 + " milion"; });
            svg.append("svg:text")
                 .attr("class", "title")
                 .attr("x", 20)
                 .attr("y", 10)
                 .text("Landtitel");

             // add legend piechart 
            var legend = svg.append("g")
              .attr("class", "legend")
              .attr("height", 100)
              .attr("width", 100)
              .attr('transform', 'translate(-20,50)')    
                
              legend.selectAll('rect')
                .data(pie(urbandata))
                .enter()
                .append("rect")
                .attr("x", width - 65)
                .attr("y", function(d, i){ return i *  20;})
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", function(d) { 
                  return color(d.data.population);
                })




                }// function ready
}// on windowload
