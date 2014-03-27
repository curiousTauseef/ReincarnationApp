var margin = {top: 20, right: 20, bottom: 70, left: 40},
	width = 600 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;


var x3 = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y3 = d3.scale.linear().range([height, 0]);

var xAxis3 = d3.svg.axis()
	.scale(x3)
	.orient("bottom")

// Add titles and axis labels

var yAxis3 = d3.svg.axis()
	.scale(y3)
	.orient("left")
	.ticks(10);

var svg3 = d3.select("#agecentdiv").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", 
		  "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../csvs/agepercentury.csv", function(error, data) {

	data.forEach(function(d) {
		d.value = +d.value;
	});
 
  x3.domain(data.map(function(d) { return d.agepercentury; }));
  y3.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg3.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis3)
	.selectAll("text")
	  .style("text-anchor", "end")
	  .attr("dx", "1.4em")

  svg3.append("g")
	  .attr("class", "y axis")
	  .call(yAxis3)
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")

  svg3.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .text("Age per Centuries distribution Graph");

  svg3.selectAll("bar")
	  .data(data)
	.enter().append("rect")
	  .style("fill", "blue")
	  .attr("x", function(d) { return x3(d.agepercentury); })
	  .attr("width", x3.rangeBand())
	  .attr("y", function(d) { return y3(d.value); })
	  .attr("height", function(d) { return height - y3(d.value); })  

});
