

function login(){
    window.location = '/summary'
}

$(function(){
    var client = mqtt.connect('ws://13.233.113.49', {
      'username':'deploy',
      'password': 'sih2019',
      'port': 1884
    })
    $(".month-menu").on('click', 'a', function(){
        $("#dropdownMonthButton:first-child").text($(this).text());
        $("#dropdownMonthButton:first-child").val($(this).text());
        get_scheduled_data();
        
    });
    $(".week-menu").on('click', 'a', function(){
      $("#dropdownWeekButton:first-child").text($(this).text());
      $("#dropdownWeekButton:first-child").val($(this).text());
      get_scheduled_data();
    });

    $(".year-menu").on('click', 'a', function(){
      $("#dropdownYearButton:first-child").text($(this).text());
      $("#dropdownYearButton:first-child").val($(this).text());
      get_scheduled_data()
    });

    $('.dropdown').on('show.bs.dropdown', function() {
      $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
    });
    $('.dropdown').on('hide.bs.dropdown', function() {
      $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
    });

    

    $('.max-hours-crop').val(9)
    function week(date) {
        prefixes = ['Week1', 'Week2', 'Week3', 'Week4', 'Week5'];
        return prefixes[Math.floor(date.getDate() / 7)];
    }
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                    'August', 'September', 'October', 'November', 'December']

    $('#dropdownWeekButton').html(week(new Date()))
    $('#dropdownMonthButton').html(months[new Date().getMonth()])
    $('#dropdownYearButton').html(months[new Date().getFullYear()])


    pattern = window.location.href.replace('/Jaipur', '').split('/')
    pattern = pattern[pattern.length - 1]
    pattern = pattern.replace('#', '')
    
    
  
    if(pattern == 'scheduler'){
        get_scheduled_data()
    }
    else if(pattern == 'configuration'){
        get_crop_hours()
        // get_crop_month_hours()
    }
    else if(pattern.includes('summary')){
      region = localStorage.getItem('region')
      $('.region').html(region.replace(' ', ''))
      $.ajax({
        'url': '/checkaudino',
      }).done(function(response){

       
        for(let findex = 0; findex<response.length; findex++){
          let messagejson;
          if('aurdinotopic' in response[findex]){
            aurdinotopic = response[findex].aurdinotopic
            client.removeAllListeners('message')

            client.on('message', function(messagetopic, incomingmessage){
              if(messagetopic === `${aurdinotopic}/response`){
                messagejson = JSON.parse(incomingmessage.toString())
                if(messagejson.status === 'active'){
                  
                  $('#' + response[findex].farmerid).html('<span class="change-pos"><i class="fa fa-arrow-up"></i></span>')
                  client.unsubscribe(`${aurdinotopic}/response`)
                  console.log('here')
                }
                  
              }
            })
           
            client.subscribe(`${aurdinotopic}/response`, function(err){
                if(!err){
                  
                  client.publish(aurdinotopic, JSON.stringify({
                    'action':'check'
                  }), function(err){
                    
                    if(!err){

                      setTimeout(function(){
                        console.log(messagejson)
                        if(!messagejson){
                          
                          client.unsubscribe(`${aurdinotopic}/response`)
                          $('#' + response[findex].farmerid).html('<span class="change-neg"><i class="fa fa-arrow-down"></i></span>')
                        }
                        
                      }, 2000)
                    }
                  })
                }
            })
            
            // console.log(Paho)
            // client = new Paho.Client('13.233.113.49', 1884, "clientId");
            // client.connect({onSuccess:function(){
            //   console.log('here')
            // }});


            
          }
          else{
            $('#' + response[findex].farmerid).html('<span class="change-neg"><i class="fa fa-arrow-down"></i></span>')
          }
            
          
            
        }
      })

    }

    else if(pattern == 'viewscheduler'){
      feederline = $('#dropdownFeederButton').html().replace(/ /g,'')

      
      $.ajax({
        'url':'/showfeederline',
        'data':{
          'feederline': feederline
        }
      }).done(function(response){
        console.log(response)
        for(let rindex=0; rindex<response.length; rindex++){
          let messagejson;
          if('aurdinotopic' in response[rindex]){
            let aurdinotopic = response[rindex].aurdinotopic
            client.publish(aurdinotopic, JSON.stringify({
              'action': 'on'
            }), function(err){
              if(!err){
                console.log('here')
              }
            })

          }
          
        }
        farmerssimulation(response)
        function addMinutes(date, minutes) {
          return new Date(date.getTime() + minutes*60000);
        }
        peaktimestart = new Date(addMinutes(new Date(), 1))
        var s = 30;
        function showpeaktime(){
          var date = -new Date().getDate() + peaktimestart.getDate()
          var h = -new Date().getHours() + peaktimestart.getHours();
          var m =  0;
          s -= 1
          
          $('.peak-timer').html(h + ' : ' + m + ' : ' + s)
          if(h == 0 && m==0 && s == 1){
            for(let rindex=0; rindex<response.length; rindex++){
              let messagejson;
              if('aurdinotopic' in response[rindex]){
                let aurdinotopic = response[rindex].aurdinotopic
                client.publish(aurdinotopic, JSON.stringify({
                  'action': 'off'
                }), function(err){
                  if(!err){
                    console.log('here')
                    $('.on').attr('fill', '#ba4e63')
                  }
                })
              } 
            }
            
            return
          }
          var t = setTimeout(showpeaktime, 1000);
        }
        showpeaktime()
      })
    }
    

    $('.login-button').on('click', function(){
      check_login()
    })

    $('#addfeeder').on('click', function(){
      feeder_line = $('.feeder_line').val()
      type = $('.feeder_type').val()
      $.ajax({
        'url': '/addfeeders',
        'data': {
          'feeder_line':feeder_line,
          'type':type,
          'region': $('.region').html().replace(' ', '')
        }
      }).done(function(response){
        region = JSON.parse(response)['region'].replace(' ', '')
        window.location.href = '/summary/' + region
      })
    })
    
    function get_selected_week(){
      return $("#dropdownWeekButton:first-child").html();
    }
    
    function get_selected_month(){
      return  $("#dropdownMonthButton:first-child").html();
    }
    
    function get_selected_year(){
      return  $("#dropdownYearButton:first-child").html();
    }

    function get_scheduled_data(){
        var week = parseInt(get_selected_week().replace('Week', ''))
        var month = get_selected_month()
        var year = parseInt(get_selected_year().replace(" ", ''))

        $.ajax({
          'url': '/scheduleforweek',
          'data': {
            'week': week,
            'month': month,
            'year': year
          }
        }).done(function(response){
          draw_circles(response)
        })
    }

    function check_login(){
      $.ajax({
        "url": "/login",
        'data':{
          'username':$('#userid').val(),
          'password':$('#password').val(), 
        }
      }).done(function(response){
          region = JSON.parse(response)['region']
          localStorage.setItem("region", region); 
          window.location.href = 'http://localhost:5000/summary/' + region
      })
    }

   
    //function for crop hours
    function get_crop_hours(){
      $.ajax({
        'url': '/crophours'
      }).done(function(response){
        crop_hours(response)

      })
    }
    
    //function for crop month hours
    function get_crop_month_hours(){
      $.ajax({
        'url': '/cropmonthhours'
      }).done(function(response){

      })
    }

    $('#notifyFarmers').on('click', function(){
      var week = parseInt(get_selected_week().replace('Week', ''))
      var month = get_selected_month()
      var year = parseInt(get_selected_year().replace(" ", ''))

      $.ajax({
        'url': '/notifyfarmers',
        'data': {
          'week': week,
          'month': month,
          'year': year
        }
      })
    })
});





