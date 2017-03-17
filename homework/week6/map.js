// ╔═╗┌─┐┌┬┐┌─┐┬─┐  ┬  ┬┌─┐┌┐┌  ╔╦╗┬ ┬┬ ┬┬ ┬┬  ┬┌─┐┬─┐
// ╠═╝├┤  │ ├┤ ├┬┘  └┐┌┘├─┤│││   ║ ││││ │└┬┘└┐┌┘├┤ ├┬┘
// ╩  └─┘ ┴ └─┘┴└─   └┘ ┴ ┴┘└┘   ╩ └┴┘└─┘ ┴  └┘ └─┘┴└─  
// student number 10872809, feb 2017 
// WEEKOPDRACHT 6-7


window.onload = function() {

d3.queue()
    .defer(d3.json, "worldpopulation.json",function(error, worldpopulation) {
            if (error) throw error;
            // draw map 
            drawMap(worldpopulation);
        })
    .defer(d3.json, "agegroups.json",function(error, agegroups) {
            if (error) throw error;
            // draw map 
            drawBars(agegroups);
        }) 
            // send to drawBars function
            // onClick = function(country, index) {
            //     drawBars(country, index);}
    .await(ready);
    
function ready(error, worldpopulation, agegroups) {
  if(error) throw error;
  console.log(worldpopulation[0]);
  console.log(agegroups);
};


function drawBars(){
var margin = {top: (parseInt(d3.select('body').style('width'), 10)/10), right: (parseInt(d3.select('body').style('width'), 10)/20), bottom: (parseInt(d3.select('body').style('width'), 10)/5), left: (parseInt(d3.select('body').style('width'), 10)/20)},
    width = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right,
    height = parseInt(d3.select('body').style('height'), 10) - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var colorRange = d3.scale.category20();
var color = d3.scale.ordinal()
    .range(colorRange.range());

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var divTooltip = d3.select("body").append("div").attr("class", "toolTip");


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// dataset = [
//     {CountryName:"Men", "Not Satisfied":20, "Not Much Satisfied":10, "Satisfied": 50, "Very Satisfied":20},
//     {CountryName:"Women", "Not Satisfied":15, "Not Much Satisfied":30, "Satisfied":40, "Very Satisfied":15}
// ];

d3.json("agegroups.json", function(dataset) {
  //   dataset.forEach(function(d) {
  //   d["0 to 14"] = +d["0 to 14"];
  //   d["15 to 64"] = +d["15 to 64"];
  //   d["65 and up"] = +d["65 and up"];
  // });
  // console.log(dataset.keys);

  Object.keys(dataset).forEach(function(key) {

    console.log("key :",key, "dataset[key] :",dataset[key]);

    });

  console.log("Object.keys(dataset[Aruba]) :", Object.keys(dataset["Aruba"]));

var ageRanges = d3.keys(dataset[1]).filter(function(key) { return key !== Object.keys(dataset["Aruba"]); });
console.log(ageRanges)

dataset.forEach(function(d) {
    d.valores = ageRanges.map(function(name) { return {name: name, value: +d[name]}; });
});

x0.domain(dataset.map(function(d) { return d.CountryName; }));
x1.domain(ageRanges).rangeRoundBands([0, x0.rangeBand()]);
y.domain([0, d3.max(dataset, function(d) { return d3.max(d.valores, function(d) { return d.value; }); })]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Satisfaction %");

var bar = svg.selectAll(".bar")
    .data(dataset)
    .enter().append("g")
    .attr("class", "rect")
    .attr("transform", function(d) { return "translate(" + x0(d.CountryName) + ",0)"; });

bar.selectAll("rect")
    .data(function(d) { return d.valores; })
    .enter().append("rect")
    .attr("width", x1.rangeBand())
    .attr("x", function(d) { return x1(d.name); })
    .attr("y", function(d) { return y(d.value); })
    .attr("value", function(d){return d.name;})
    .attr("height", function(d) { return height - y(d.value); })
    .style("fill", function(d) { return color(d.name); });

bar
    .on("mousemove", function(d){
        divTooltip.style("left", d3.event.pageX+10+"px");
        divTooltip.style("top", d3.event.pageY-25+"px");
        divTooltip.style("display", "inline-block");
        var x = d3.event.pageX, y = d3.event.pageY
        var elements = document.querySelectorAll(':hover');
        l = elements.length
        l = l-1
        elementData = elements[l].__data__
        divTooltip.html((d.CountryName)+"<br>"+elementData.name+"<br>"+elementData.value+"%");
    });
bar
    .on("mouseout", function(d){
        divTooltip.style("display", "none");
    });


var legend = svg.selectAll(".legend")
    .data(ageRanges.slice())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });
 });  
 }; 

    // based on code from https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
function drawMap(worldpopulation){

    var series = [];
    d3.json("worldpopulation.json", function(error, data) {
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
                        '<br>Population in 1960: <strong>', data.sixtyPopulation / 1000000, '</strong>', ' Milion',
                        '</div>'
                    ].join('');
                }
            },
                 done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(countrySelection) {
            alert(countrySelection.properties.name);

        });},
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