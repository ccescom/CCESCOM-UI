function draw_circles(data)
{
    var margin = {top: 30, right: 30, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        x_axis_width = width - 100;  

    var parseTime = d3.timeParse("%d-%b-%y");
    length = 5;
  
    var x = d3.scaleLinear().range([40, x_axis_width]);
    var y = d3.scaleLinear().range([height + 100, 0]);
    var color = d3.scaleLinear()
    .range([d3.rgb("#00bdf4"), d3.rgb('#003055')])
    .domain(d3.extent(data, function(d) { return d.feeder_counter; }))
    
    var svg = d3.select(".visual").append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
               .append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function(d) { return d.feeder_counter; }));
    y.domain([0, d3.max(data, function(d) { return d.level; })]);

   let max_level = d3.max(data.map(d => d.level), function(level){
         return level;
   })

   for(let i=0; i< max_level; i++){
      let level_max = d3.max(data.filter(d => d.level == i + 1), function(d){
            return d.feeder_counter
      })
      var line = svg.append('g')
      .attr('transform', 'translate(0' + ',' + y(i+1) + ')' )
      .append('line')
      .attr('class', 'tick' + i)
      .attr('x1', 0)
      .attr('x2',x(level_max))
      .attr('stroke', '#000')

      svg.append('g')
      .attr('transform', 'translate(0' + ',' + y(i+1) + ')' )
      .append('line')
      .attr('class', 'ticky' + i)
      .attr('y1', -80)
      .attr('y2',0)
      .attr('stroke', '#000')

      var totalLength = line.node().getTotalLength()
      svg.select('.tick' + i)
 	    .attr('stroke-dasharray', totalLength + " " + totalLength)
 	    .attr('stroke-dashoffset', totalLength)
 	    .transition()
 	    .duration(1200)
 	    .ease(d3.easeLinear)
 	    .attr('stroke-dashoffset', 0)
   }
   
     

    var bubbles = svg.selectAll(".bubble").data(data);
  
    var circles = bubbles.enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("cx", function(d){ return x(d.feeder_counter) })
    .attr("cy", function(d){ return y(d.level) })
    .attr("r", "25")
    .attr("fill", 'none')

    circles.transition()
    .duration(1200 * 3)
    .ease(d3.easePoly)
    .delay((d, i) => {
      return i * 60
    })
    .attr('stroke', function(d){ return color(d.feeder_counter) })
    .attr('stroke-width', '2px')
    .attr("fill", function(d){ return color(d.feeder_counter) })

    bubbles.enter()
    .append("text")
    .attr("x", function(d){ return x(d.feeder_counter)-3 })
    .attr("y", function(d){ return y(d.level)+3 })
    .style("text-anchor", "start")
    .style("fill", "#fff")
    .text(function(d) { return d.feeder_counter })

    svg.selectAll(".tick")
    .each(function (d) {
      if (d < 1 || Number.isInteger(d) === false) {
        this.remove()
      }
    })

    d3.select(".domain").remove()
        
}
var data = [
    {
        'feeder_counter': 1,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 3.1,
        'level':1 
     },
     {
      'feeder_counter': 6,
      'feeder_name': 'name',
      'shift': 'Shift A',
      'value': 6.1,
      'level':1 
     },
     {
      'feeder_counter': 7,
      'feeder_name': 'name',
      'shift': 'Shift A',
      'value': 6.1,
      'level':1 
     },
     {
        'feeder_counter': 2,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 3.3,
        'level':1 
     },
     {
        'feeder_counter': 3,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 2.5,
        'level':1 
     },
     {
        'feeder_counter': 4,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 5.5,
        'level':1   
     },
     {
        'feeder_counter': 5,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 4.5,
        'level':1 
     },
     {
        'feeder_counter': 1,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 3.1,
        'level':2 
     },
     {
        'feeder_counter': 2,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 3.3,
        'level':2 
     },
     {
        'feeder_counter': 3,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 2.5,
        'level':2
     },
     {
        'feeder_counter': 4,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 5.5,
        'level':2
     },
     {
        'feeder_counter': 5,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 4.5,
        'level':2 
     },
     {
        'feeder_counter': 1,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 3.1,
        'level':3 
     },
     {
        'feeder_counter': 2,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 3.3,
        'level':3 
     },
     {
        'feeder_counter': 3,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 2.5,
        'level':3
     },
     {
        'feeder_counter': 4,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 5.5,
        'level':3
     },
     {
        'feeder_counter': 5,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'value': 4.5,
        'level':3
     }
]
draw_circles(data)
