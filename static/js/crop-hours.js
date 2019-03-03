function crop_hours(data){
    var width = 500,
        height = 30;
    var x = d3.scaleLinear()
            .domain([0, 9])
            .range([1, width - 50])
            .clamp(true);  

    var table = d3.select('.crop-hours-row')

    var tr = table.selectAll('.data-tr')
               .data(data)
               .enter()
               .append('tr')

    crop_td = tr.append('td')
                .html(d => d.crop_name)

    var td2 = tr.append('td')
         
    var d2 = td2.append('div')
                .attr('class', 'col-sm')
                .append('div')
                .attr('id', 'slider-fill')


    hours_required = data.map(d => d.hours_required)
    // Fill
    var sliderFill = d3
    .sliderBottom()
    .min(1)
    .max(9)
    .width(300)
    .ticks(5)
    .default(0.15)
    .fill('#2196f3')
    

    var gFill = d3
    .select('div#slider-fill')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

    gFill.call(sliderFill);

    
  
     


}


  