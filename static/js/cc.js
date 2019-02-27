

function login(){
    window.location = '/summary'
}



$(function(){

    $(".month-menu").on('click', 'a', function(){
      $("#dropdownMonthButton:first-child").text($(this).text());
      $("#dropdownMonthButton:first-child").val($(this).text());
   });
   $(".week-menu").on('click', 'a', function(){
    $("#dropdownWeekButton:first-child").text($(this).text());
    $("#dropdownWeekButton:first-child").val($(this).text());
 });

 $(".year-menu").on('click', 'a', function(){
    $("#dropdownYearButton:first-child").text($(this).text());
    $("#dropdownYearButton:first-child").val($(this).text());
 });

   $('.dropdown').on('show.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
  });
  $('.dropdown').on('hide.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
  });


    function week(date) {
        prefixes = ['Week1', 'Week2', 'Week3', 'Week4', 'Week5'];

        return prefixes[Math.floor(date.getDate() / 7)];

    }
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                    'August', 'September', 'October', 'November', 'December']

    $('#dropdownWeekButton').html(week(new Date()))
    $('#dropdownMonthButton').html(months[new Date().getMonth()])
    $('#dropdownYearButton').html(months[new Date().getFullYear()])
});

