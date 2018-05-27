(function ($) { // encapsulate jQuery
    $("document").ready(function ($) {
        console.log("READY")
        $('#personalised').height($(window).height() - $('#header').height());
        $('#marriage').height($(window).height() - $('#header').height());
    });

    $('a[href^="#"]').on('click', function (event) {
        console.log("Triggered")
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - $('#header').height()
            }, 1000);
        }
    });

    var start = null
    var prevProgress = 0.0
    var duration = 2000
    var verticalDist = $('#personalised').height() / 2
    var butterfly = $('#butterfly')
    var xTarget = $('#angle-down').position().left - $('#angle-down').width() - butterfly.width() + 10
    var yTarget = $('#angle-down').position().top + $('#angle-down').height() / 2 - 10
    var xStart = butterfly.position().left
    var yStart = yTarget - Math.cos(Math.PI) * verticalDist
    var completed = false
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
    function step(timestamp) {
        if (completed) return
        if (start === null) start = timestamp
        var progress = Math.min((timestamp - start) / duration, 1.0)
        if (progress >= prevProgress + 0.05 || progress === 1.0) {
            prevProgress = progress
            butterfly.css({
                left: xStart + progress * (xTarget - xStart),
                top: yStart + Math.cos(progress * Math.PI) * verticalDist,
                transform: 'rotate(' + (Math.random() * 40 - 10) + 'deg)',
                position: "absolute"
            })
        }
        if (progress === 1.0) completed = true
        requestAnimationFrame(step)
    }
    requestAnimationFrame(step)

})(jQuery)