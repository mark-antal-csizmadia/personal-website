// Adds the fadeIn class to images that are almost in sight. The fadeIn animation makes the images appear smoothly.
$(window).scroll(function() {
    $('.fadedfx').each(function(){
        var imagePos = $(this).offset().top;

        var topOfWindow = $(window).scrollTop();
        if (imagePos < topOfWindow+500) {
            $(this).addClass("fadeIn");
        }
    });
});