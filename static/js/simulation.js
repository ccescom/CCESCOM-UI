function farmerssimulation(data){
    console.log(data)
    var margin = {top: 60, right: 30, bottom: 30, left: 60},
        width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;


    d3.select(".simulation").selectAll('*').remove()
    var svg = d3.select('.simulation')
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', height / 2.5)
        .attr('y2', height / 2.5)
        .attr('stroke', '#000')

    var locations = [50, width - 50]
    space = 200
    if(data.length > 1){
        for(var index=2; index<data.length; index++){
            if(index % 2 == 0){
                pos = parseInt(locations.length / 2)
                locations.push(locations[index % 2] + (pos * space))
            }
            else{
                locations.push(locations[index % 2] - (pos * space))
            }
            
        }
    }
    
    svg.selectAll('.verticalline')
       .data(data)
       .enter()
       .append('line')
       .attr('y1', height / 2.5)
       .attr('y2', function(d, idx){
           if(idx % 2 == 0)
                return height / 1.8
           else{
               return 125
           }
       })
       .attr('x1', (d, idx)=>locations[idx])
       .attr('x2', (d, idx)=>locations[idx])
       .attr('stroke', '#000')

    svg.selectAll('.farmerbox')
       .data(data)
       .enter()
       .append('rect')
       .attr('y', function(d, idx){
           if(idx % 2 == 0)
                return (height / 1.8)
           else{
               return 100
           }
       })
       .attr('x', (d, idx)=>locations[idx] - 30)
       .attr('width', 60)
       .attr('height', 50)
       .attr('fill', function(d){
           if(!d.aurdinotopic)
            return '#ba4e63'
           else
            return '#228B22'
       })
       .attr('class', function(d){
            if(!d.aurdinotopic)
            return 'off'
            else
            return 'on'
         })

    svg.selectAll('.farmername')
       .data(data)
       .enter()
       .append('text')
       .attr('y', function(d, idx){
            if(idx % 2 == 0)
                return (height / 1.4) 
            else{
                return 80
            }
        })
        .attr('x', (d, idx)=>locations[idx] - 30)
        .attr('font-family', 'lato')
        .text(d=> d.farmername.toUpperCase().split(' ')[0])

       
}