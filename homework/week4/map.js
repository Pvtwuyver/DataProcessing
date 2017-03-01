
// ╔═╗┌─┐┌┬┐┌─┐┬─┐  ┬  ┬┌─┐┌┐┌  ╔╦╗┬ ┬┬ ┬┬ ┬┬  ┬┌─┐┬─┐
// ╠═╝├┤  │ ├┤ ├┬┘  └┐┌┘├─┤│││   ║ ││││ │└┬┘└┐┌┘├┤ ├┬┘
// ╩  └─┘ ┴ └─┘┴└─   └┘ ┴ ┴┘└┘   ╩ └┴┘└─┘ ┴  └┘ └─┘┴└─  
// student number 10872809, feb 2017 
// WEEKOPDRACHT 4, Worldmap with Countrypopulation IN D3

window.onload = function() {
// based on code from https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
var series =[];
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
    var onlyValues = series.map(function(obj){ return obj[1]/25; });
    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    // create min-max color palette based on two colors 
    var paletteScale = d3.scale.linear()
            .domain([minValue,maxValue])
            .range(["#fee0d2","#de2d26"]);

    // create new dataset with fillcolors included
    series.forEach(function(item){ 
        var iso = item[0],
            currentPop = item[1];
            sixtyPop = item[2];
        dataset[iso] = { Population: currentPop, fillColor: paletteScale(currentPop), sixtyPopulation: sixtyPop };
    });

// draw map
new Datamap({
        element: document.getElementById('container'),
        projection: 'mercator', 
        fills: { defaultFill: '#F5F5F5' },
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
                if (!data) { return ['<div class="hoverinfo">',
                    'No data available for this region',
                    '</div>'].join('');}
                // tooltip info 1960 and 2015
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
     				'<br>Population in 2015: <strong>', data.Population/1000000,'</strong>', ' Milion',
                    '<br>Population in 1960: <strong>', data.sixtyPopulation/1000000,'</strong>', ' Milion',
                    '</div>'].join('');
            }
        }
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
    .range(["#fee0d2", "#de2d26","(#de2d26*25)"]);
//Append  color gradient
linearGradient.selectAll("stop") 
    .data( colorScale.range() )                  
    .enter().append("stop")
    .attr("offset", function(d,i) { return i/(colorScale.range().length-1); })
    .attr("stop-color", function(d) { return d; });
//Draw the rectangle and fill with gradient
svg.append("rect")
	.attr("width", 800)
	.attr("height", 20)
	.style("fill", "url(#linear-gradient)");
svg.append('text')
        .attr("class", "legend")
        .text('< 1 milion')
        .style("text-anchor", "start")
        .attr('x', 10)
        .attr('y', 15)
        .attr('fill', 'black')
svg.append('text')
        .attr("class", "legend")
        .text('1,3 Bilion')
        .style("text-anchor", "end")
        .attr('x', 790)
        .attr('y', 15)
        .attr('fill', 'white')

});
};