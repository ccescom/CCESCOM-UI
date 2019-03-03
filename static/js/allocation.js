function draw_circles(data)
{
    console.log(data)
    var margin = {top: 60, right: 30, bottom: 30, left: 10},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        x_axis_width = width - 200;  

    var parseTime = d3.timeParse("%d-%b-%y");
    length = 5;

    var radius = d3.scaleLinear().range([10, 30])
                   .domain(d3.extent(data, function(d) { return d.peek_hours; }))
  
    var x = d3.scaleLinear().range([40, x_axis_width]);
    var y = d3.scaleLinear().range([height + 100, 0]);
    var color = d3.scaleLinear()
    .range([d3.rgb("#00bdf4"), d3.rgb('#003055')])
    .domain(d3.extent(data, function(d) { return d.shift_counter; }))
    
    d3.select(".visual").selectAll('*').remove()
    var svg = d3.select('.visual')
               .append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
               .append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function(d) { return d.shift_counter; }));
    y.domain([0, d3.max(data, function(d) { return d.shift; })]);

   let max_shift = d3.max(data.map(d => d.shift), function(shift){
         return shift;
   })

   var tip = d3.tip()
          .attr('class', 'd3-tip')
          .html(function(d) { 
            text = '<span class="tip-heading">Feeder Name:</span>     ' + d.feeder_line + '<br/>'
            text += '<span class="tip-heading">Hours Requested:</span>    ' + d.peek_hours + '(Hrs)<br/>'
            text += '<span class="tip-heading">Number Of Farmers:</span>  ' + d.no_of_farmers 
            return text; 
          })
          .offset([-10, -10])

   
   svg.call(tip)


   for(let i=0; i< max_shift; i++){
      let shift_max = d3.max(data.filter(d => d.shift == i + 1), function(d){
            return d.shift_counter
      })
      var line = svg.append('g')
      .attr('transform', 'translate(0' + ',' + y(i+1) + ')' )
      .append('line')
      .attr('class', 'tick' + i)
      .attr('x1', 0)
      .attr('x2',x(shift_max))
      .attr('stroke', '#000')

      line_y1 = i == 0 ? -108 : i == 1 ? -90 : -107

      svg.append('g')
      .attr('transform', 'translate(0' + ',' + y(i+1) + ')' )
      .append('line')
      .attr('class', 'ticky' + i)
      .attr('y1', line_y1)
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
        
      shift_timings = i == 0 ? '9PM - 6AM' : i == 1 ? '11AM - 4PM' : '6AM - 11AM' 
      svg.append('g')
      .attr('class', 'time' + i)
      .append('text')
      .attr('x', x(shift_max) - 100)
      .attr('y', y(i + 1) - 50)
      .text(shift_timings)
   }
   
    data = data.sort(function(x, y){
         return d3.ascending(x.peek_hours, y.peek_hours);
    })
    var bubbles = svg.selectAll(".bubble").data(data);
  
    var circles = bubbles.enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("cx", function(d){ return x(d.shift_counter) })
    .attr("cy", function(d){ return y(d.shift) })
    .attr("r", function(d){
       return radius(d.peek_hours)
    })
    .attr("fill", 'none')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

    circles.transition()
    .duration(1200 * 3)
    .ease(d3.easePoly)
    .delay((d, i) => {
      return i * 60
    })
    .attr('stroke', function(d){ return color(d.shift_counter) })
    .attr('stroke-width', '2px')
    .attr("fill", function(d){ return color(d.shift_counter) })

    bubbles.enter()
    .append("text")
    .attr("x", function(d){ return x(d.shift_counter) -3 })
    .attr("y", function(d){ return y(d.shift) +3 })
    .style("text-anchor", "start")
    .style("fill", "#fff")
    .text(function(d) { return d.shift_counter })

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
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 3.1,
        'shift':1 
     },
     {
      'feeder_name': 'name',
      'shift': 'Shift A',
      'peek_hours': 6.1,
      'shift':1 
     },
     {
      'feeder_name': 'name',
      'shift': 'Shift A',
      'peek_hours': 6.1,
      'shift':1 
     },
     {
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 3.3,
        'shift':1 
     },
     {
        'shift_counter': 3,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 2.5,
        'shift':1 
     },
     {
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 5.5,
        'shift':1   
     },
     {
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 4.5,
        'shift':1 
     },
     {
        'shift_counter': 1,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 3.1,
        'shift':2 
     },
     {
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 3.3,
        'shift':2 
     },
     {
        'shift_counter': 3,
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 2.5,
        'shift':2
     },
     {
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 5.5,
        'shift':2
     },
     {
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 4.5,
        'shift':2 
     },
     {
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 3.1,
        'shift':3 
     },
     {
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 3.3,
        'shift':3 
     },
     {
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 2.5,
        'shift':3
     },
     {
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 5.5,
        'shift':3
     },
     {
        'feeder_name': 'name',
        'shift': 'Shift A',
        'peek_hours': 4.5,
        'shift':3
     }
]

counter_data = []
for(let i=0; i <3; i++){
   shift_data = data.filter(d=> d.shift == i + 1)
   shift_data = shift_data.sort(function(x, y){
      return d3.ascending(x.peek_hours, y.peek_hours);
   })
   

   for(let j=0; j<shift_data.length; j++){
      shift_data[j].shift_counter  = j + 1
      counter_data.push(shift_data[j])
   }
}

// draw_circles(counter_data)
