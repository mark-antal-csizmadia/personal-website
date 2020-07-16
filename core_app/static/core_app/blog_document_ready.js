$(document).ready(function(){
    // Add scrollspy to <body>
    $('body').scrollspy({target: "#sidebar_list", offset: 120});

    // Add smooth scrolling on all links inside the navbar
    $(".list-group-item-action").on('click', function(event) {
        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 80
            }, 800, function(){
                // Add hash (#) to URL when done scrolling (default click behavior)
                // window.location.hash = hash;
            });
        }  // End if
    });

    // If the nav button is interacted with
    $("#navibut").on('click', function(event) {
        // If the collapsed nav menu is shown, or scrolling has taken place already, add the shadow effect
        if ( !$('#navbarToggle').hasClass('show') || document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
            document.getElementById("navbar").style.boxShadow = "0 1px 3px rgba(0,0,0, 0.14), 0 2px 3px rgba(0,0,0,0.24)";
        }
        // If none of the above is true, take away the shadow effect
        else {
            document.getElementById("navbar").style.boxShadow = "0 0px 0px rgba(0,0,0, 0.14), 0 0px 0px rgba(0,0,0,0.24)";
        }
    });

    // Smooth scrolling to top is attached to the upwards, dynamic arrow in the footer
    $("#totop").on('click', function(event) {
        $("html, body").animate({
            scrollTop: 0
        }, 800);
    });
});