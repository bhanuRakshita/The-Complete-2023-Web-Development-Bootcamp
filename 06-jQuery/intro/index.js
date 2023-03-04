$("h1").css("color","red");

$(document).keydown(function(event) {
    $("h1").text(event.key);
});

$(".animate").on("click",function() {
    $("h2").slideUp().slideDown().animate({
        opacity:0.5
    });
});