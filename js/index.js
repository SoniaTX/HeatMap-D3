var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

 var titleName = d3.select("body").append("titleName");
     
  titleName.append("div")
    .attr("id", "title")
    .html("Monthly Global Land-Surface Temperature");

 var description = d3.select("body").append("description");

  description.append("h2")
    .attr("id", "description")
    .html("1753 - 2015: base temperature 8.66℃");

d3.json(url, function (data) {
  
 var baseTemp = data.baseTemperature;
 var monVar = data.monthlyVariance;
  
 var width = 900;
 var height = 450;

 var margin = { top: 40, right: 60, bottom: 90, left: 75 };  
  
   var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  var colors = ['#4d004b','#081d58', '#253494', '#225ea8', '#1d91c0', '#41b6c4', '#7fcdbb', '#c7e9b4', '#edf8b1', '#fcbba1','#fc9272', '#FF7F50', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', "#67000d"]

  
   var variance = [];
   
     data.monthlyVariance.forEach((d, i) => {
        variance.push(d.variance);
    })
   
  
  var colorScale = d3.scaleQuantile()
    .domain([d3.min(variance), d3.max(variance)])
    .range(colors); 
  
  var colorToValue = function(color) { return colorScale.invertExtent(color)[0] }; 

  var svg = d3.select("body").append("svg")
     .attr("height", height + margin.top  + margin.bottom)
     .attr("width", width + margin.left + margin.right);
   
  svg.append("rect")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .attr("x", 0)
     .attr("y", 0)
     

  svg = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // set up years for x-axis

  var year = [];
   
     data.monthlyVariance.forEach((d, i) => {
        year.push(d.year);
    })
  
  var xScale = d3.scaleTime()
                 .domain([d3.min(year), d3.max(year)])
                 .range([0, width]);
 
 // var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
      
  var xAxis = d3.axisBottom().scale(xScale).ticks(20).tickSize(10, 0).tickFormat(d3.format(""));
  

  svg.append('g')
    .attr('id', 'x-axis')
    .attr("class", "axis")
    .attr('transform', 'translate(0,' + (height + height / 12) + ')')
    .call(xAxis)
     .append("text")     
    .attr("class", "label")
    .attr("x", width + 35)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("YEARS");

 
 // set up months for y-axis
 var month = [];
 data.monthlyVariance.forEach((d, i) => { month.push(d.month);  })
  
 var formatTime = d3.timeFormat('%B');
 var formatMonth = function(month) {
          return formatTime(new Date(2016, month - 1))
        }
 
 var yScale =  d3.scaleLinear()  //d3.scaleTime()
                 .domain([ 1 , 12])
                 .range([ 0, height ])
       
  var yAxis = d3.axisLeft()       
                .scale(yScale)
                .tickFormat(formatMonth)
                .tickSize(10, 0);
           
   svg.append('g')
    .attr('id', 'y-axis')
    .attr("class", "axis")
    .attr('transform', 'translate(0,' + (height / 24) + ')')
    .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(360)")
      .attr("y", -30)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("MONTHS");

  
  var rectWidth = (width / (d3.max(year) - d3.min(year)));
  var rectHeight = (height/12 + 5);

  
  var cells = svg.selectAll("rect")
      .data(data.monthlyVariance)
      .enter()
      .append("g")
      .append("rect")
		  .attr("class","cell")    
      .attr("x", (d) => xScale (d.year))
      .attr("y", (d) => yScale(d.month) )
      .attr('data-month', (d) => [d.month - 1 ])
      .attr('data-year', (d) => d.year )
      .attr('data-temp', (d) => data.baseTemperature - d.variance)
      .attr("fill", (d) => colorScale(d.variance))
      .attr("width", rectWidth)   
      .attr("height", rectHeight);
  
 var tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);
  
  
     svg.selectAll("rect")
      .data(monVar)
      .on("mouseover", function(d) {
          tooltip.transition()
                 .style("opacity", 1)        
           tooltip.html( months[d.month - 1] + ' ' + d.year  + '<br>Temp: ' + (data.baseTemperature + d.variance).toFixed(3) +' °C'+   '<br>Variance: ' + d.variance +  '<br>')
                  .attr('data-year', d.year)
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px"); 
      })
      .on("mouseout", function(d) {
           tooltip.transition()
               .duration(500)
               .style("opacity", 0);  
      });
           
       
 var legendHeight = 20;
 var legendWidth = 35;
    
 var legend = svg.append("g")
                 .attr("id", "legend")    
                .attr("transform", "translate(" + (width - legendWidth * colors.length) + "," + (margin.bottom + -580)  + ")");
 
legend.selectAll('rect')
      .data(colors)
      .enter()
      .append("rect")
      .attr("y",  height + margin.bottom - 95)
      .attr("x", function(d, i){ return i *  legendWidth;})
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", function(d) {
         return d;
      });
  
   var formatNum = d3.format(".1f")
   var rounded = function(number) {
         return Math.round(( number * 10 ) / 10);
  }  
   
   legend.selectAll('text')
      .data(colors)
      .enter()
      .append("text")
      .text( function(d) { return formatNum(rounded(colorToValue(d) + baseTemp))})      
      .attr("text-anchor", "middle")
      .attr( "class", "legend")
      .attr("y", height + margin.bottom - 60)
      .attr("x", function(d, i){ return (i *  legendWidth + legendWidth / 2)})
   
 });