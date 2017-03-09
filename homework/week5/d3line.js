// ╔═╗┌─┐┌┬┐┌─┐┬─┐  ┬  ┬┌─┐┌┐┌  ╔╦╗┬ ┬┬ ┬┬ ┬┬  ┬┌─┐┬─┐
// ╠═╝├┤  │ ├┤ ├┬┘  └┐┌┘├─┤│││   ║ ││││ │└┬┘└┐┌┘├┤ ├┬┘
// ╩  └─┘ ┴ └─┘┴└─   └┘ ┴ ┴┘└┘   ╩ └┴┘└─┘ ┴  └┘ └─┘┴└─  
// student number 10872809, feb 2017 
// WEEKOPDRACHT 5, Interactive multiserie line graph IN D3

window.onload = function() {
    // code based on http://blockbuilder.org/mbostock/3884955
    // initialy define svg 
    var svg = d3.select("svg"),
        margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
        },
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom;
    // correct date format
    var parseTime = d3.timeParse("%Y-%m-%d");

    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) {
            return x(d.date);
        })
        .y(function(d) {
            return y(d.temperature);
        });
    // on click, update datafile 		
    d3.selectAll(".m")
        .on("click", function() {
            var datafile;
            var city = this.getAttribute("value");
            if (city == "Leeuwarden") {
                datafile = "leeuwarden.json";
            } else if (city == "Maastricht") {
                datafile = "maastricht.json";
            }
            // update the data in graph
            updateGraph(datafile);
        });
    // set up svg and clean
    var setupGraph = function() {
        var svg = d3.select("svg");
        svg.selectAll("*").remove();
        return svg;
    }
    // update the graph
    var updateGraph = function(datafile) {
        var svg = setupGraph();
        var margin = {
                top: 20,
                right: 80,
                bottom: 30,
                left: 50
            },
            width = svg.attr("width") - margin.left - margin.right,
            height = svg.attr("height") - margin.top - margin.bottom;
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.json(datafile, function(error, data) {
            if (error) throw (error);
            data.forEach(function(d) {
                // change strings into real numbers
                d.minTemp = +d.minTemp / 10;
                d.maxTemp = +d.maxTemp / 10;
                d.midTemp = +d.midTemp / 10;
                // set date in D3 date-format
                d.date = parseTime(d.date);
            })
            // create colums with exact same names as in data[0]
            data.columns = ["date", "minTemp", "maxTemp", "midTemp"];
            console.log("data: ", data);
            // create dataset with 3 temps corresponding with date
            var temps = data.columns.slice(1).map(function(column) {
                return {
                    id: column,
                    values: data.map(function(d) {
                        return {
                            date: d.date,
                            temperature: d[column]
                        };
                    })
                };
            });
            x.domain(d3.extent(data, function(d) {
                return d.date;
            }));
            y.domain([
                d3.min(temps, function(c) {
                    return d3.min(c.values, function(d) {
                        return d.temperature;
                    });
                }),
                d3.max(temps, function(c) {
                    return d3.max(c.values, function(d) {
                        return d.temperature;
                    });
                })
            ]);
            z.domain(temps.map(function(c) {
                return c.id;
            }));
            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .style("text-anchor", "start");
            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Temperature, ºC");
            var temp = g.selectAll(".temp")
                .data(temps)
                .enter().append("g")
                .attr("class", "temp");
            temp.append("path")
                .attr("class", "line")
                .attr("d", function(d) {
                    return line(d.values);
                })
                .style("stroke", function(d) {
                    return z(d.id);
                })
                .style("fill", "none");
            temp.append("text")
                .datum(function(d) {
                    return {
                        id: d.id,
                        value: d.values[d.values.length - 1]
                    };
                })
                .attr("transform", function(d) {
                    return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
                })
                .attr("x", 3)
                .attr("dy", "0.35em")
                .style("font", "10px sans-serif")
                .text(function(d) {
                    return d.id;
                });
            // mouseover effect, based on code from https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
            var mouseG = svg.append("g")
                .attr("class", "mouse-over-effects")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            // black vertical line to follow mouse
            mouseG.append("path")
                .attr("class", "mouse-line")
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style("opatemp", "0");
            var lines = document.getElementsByClassName('line');
            var mousePerLine = mouseG.selectAll('.mouse-per-line')
                .data(temps)
                .enter()
                .append("g")
                .attr("class", "mouse-per-line");
            mousePerLine.append("circle")
                .attr("r", 3)
                .style("stroke", "black")
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("opatemp", "0");
            mousePerLine.append("text")
                .attr("transform", "translate(10,3)");
            // append a rect to catch mouse movements on canvas    
            mouseG.append('svg:rect')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                // on mouse-out hide line, circles and text
                .on('mouseout', function() {
                    d3.select(".mouse-line")
                        .style("opatemp", "0");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opatemp", "0");
                    d3.selectAll(".mouse-per-line text")
                        .style("opatemp", "0");
                })
                // on mouse-in show line, circles and text
                .on('mouseover', function() {
                    d3.select(".mouse-line")
                        .style("opatemp", "1");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opatemp", "1");
                    d3.selectAll(".mouse-per-line text")
                        .style("opatemp", "1");
                })
                // mouse moving over canvas
                .on('mousemove', function() {
                    var mouse = d3.mouse(this);
                    d3.select(".mouse-line")
                        .attr("d", function() {
                            var d = "M" + mouse[0] + "," + height;
                            d += " " + mouse[0] + "," + 0;
                            return d;
                        });
                    d3.selectAll(".mouse-per-line")
                        .attr("transform", function(d, i) {
                            var xDate = x.invert(mouse[0]),
                                bisect = d3.bisector(function(d) {
                                    return d.date;
                                }).right;
                            idx = bisect(d.values, xDate);
                            var beginning = 0,
                                end = lines[i].getTotalLength(),
                                target = null;
                            while (true) {
                                target = Math.floor((beginning + end) / 2);
                                pos = lines[i].getPointAtLength(target);
                                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                    break;
                                }
                                if (pos.x > mouse[0]) end = target;
                                else if (pos.x < mouse[0]) beginning = target;
                                else break;
                            }
                            d3.select(this).select('text')
                                .text(y.invert(pos.y).toFixed(2));
                            return "translate(" + mouse[0] + "," + pos.y + ")";
                        });
                });
        });
    };
};