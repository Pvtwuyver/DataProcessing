// code based on https://bost.ocks.org/mike/bar/3/
// determine margins and size
var margin = {
        top: 20,
        right: 20,
        bottom: 200,
        left: 100
    },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// set the ranges, small gap between the bars (0.05)
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);

// create the tooltip for hover effect (W3schools.com)
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
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// load the data
d3.json("reactietijden.json", function(error, data) {
    data.forEach(function(d) {
        d.Regio = d.Regio;
        // change strings into real numbers
        d.starttijd = +d.starttijd;
        d.alarmeringstijd = +d.alarmeringstijd;
        d.uitruktijd = +d.uitruktijd;
        d.rijtijd = +d.rijtijd;
        d.responsetijd = +d.responsetijd;
    });

    // scale the range of the data
    x.domain(data.map(function(d) {
        return d.Regio;
    }));
    // scale y axis .5 extra for lay-out purpose
    y.domain([0, 0.5 + d3.max(data, function(d) {
        return d.responsetijd;
    })]);

    // chart title
    svg.append('text')
        .attr("class", "title")
        .text('Gemiddelde Reactietijden Brandweer in Nederlandse Regios in 2015')
        .attr('x', 200)
        .attr('y', 0)
        .attr('fill', 'black')
    // chart title
    svg.append('text')
        .attr("class", "axis")
        .text('(Regio)')
        .attr('x', 850)
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
        .attr("transform", "rotate(-45)");
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-0)")
        .attr("y", -10)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Responsetijd (Min)");

    // create barchart based on total responsetime
    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.Regio)
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.responsetijd)
        })
        .attr("height", function(d) {
            return height - y(d.responsetijd)
        })
        // hover function with additiona information window
        // based on code from W3schools.com
        .on("mouseover", function(d) {
            hover.transition()
                .duration(200)
                .style("opacity", .9);
            hover.html("<b>" + d.Regio + "</b>" + "<br/>" + "starttijd: " + d.starttijd + " min" + "<br/>" + "alarmeringstijd: " + d.alarmeringstijd + " min" + "<br/>" +
                    "uitruktijd: " + d.uitruktijd + " min" + "<br/>" + "rijtijd: " + d.rijtijd + " min" + "<br/>" + "Totale responsetijd: " + d.responsetijd + " min")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 128) + "px");
        })
        .on("mouseout", function(d) {
            hover.transition()
                .duration(500)
                .style("opacity", 0);
        });

});