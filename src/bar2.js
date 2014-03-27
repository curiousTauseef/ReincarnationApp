var margin = {top: 20, right: 20, bottom: 70, left: 40},
	width = 600 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;


var x2 = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y2 = d3.scale.linear().range([height, 0]);

var xAxis2 = d3.svg.axis()
	.scale(x2)
	.orient("bottom")

// Add titles and axis labels

var yAxis2 = d3.svg.axis()
	.scale(y2)
	.orient("left")
	.ticks(10);

var svg2 = d3.select("#centdiv").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", 
		  "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../csvs/centuries.csv", function(error, data) {

	data.forEach(function(d) {
		d.value = +d.value;
	});
 
  x2.domain(data.map(function(d) { return d.century; }));
  y2.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg2.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis2)
	.selectAll("text")
	  .style("text-anchor", "end")
	  .attr("dx", "1.4em")

  svg2.append("g")
	  .attr("class", "y axis")
	  .call(yAxis2)
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")

  svg2.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .text("Centuries distribution Graph");

  svg2.selectAll("bar")
	  .data(data)
	.enter().append("rect")
	  .style("fill", "green")
	  .attr("x", function(d) { return x2(d.century); })
	  .attr("width", x2.rangeBand())
	  .attr("y", function(d) { return y2(d.value); })
	  .attr("height", function(d) { return height - y2(d.value); })  

});
