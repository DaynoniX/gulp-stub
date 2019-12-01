//= ../../../bower_components/jquery/dist/jquery.js

//= ../../../bower_components/slick-carousel/slick/slick.js


$(document).ready(function(){
    $('#mainSlider').slick();


    function toggle_menu(trigger, block) {
        $(trigger).click(function () {
            $(block).toggleClass('active')
        });
    }

    $('.sidebar-block_heading').click(function(){
        $(this).closest('.sidebar-block').toggleClass('active')
    });



    toggle_menu('#filter_trigger', '.sidebar');
    toggle_menu('.toggle', '.header')
});
