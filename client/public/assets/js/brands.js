$( document ).ready(function() {
	$(".card").mouseenter(function() {
        $(this).find(".hidden-box").fadeIn(250);
    }).mouseleave(function() {
        $(this).find(".hidden-box").fadeOut(100);
    });
});