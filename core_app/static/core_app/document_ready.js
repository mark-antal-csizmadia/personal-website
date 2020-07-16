$(document).ready(function(){
    // Add scrollspy to <body>
    $('body').scrollspy({target: "#navbar", offset: 50});

    // Add smooth scrolling on all links inside the navbar
    $("#navbarToggle a").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {

            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });

        }  // End if

        // Collapse the pill navigation menu if the main navigation menu is interacted with
        $('#bs-example-navbar-collapse-1').collapse("hide");

        // If the navigation bar was collapsed and shown when interacted with, hide the menu upon interaction
        if ( $('#navbarToggle').hasClass('show')) {
            $('.collapse').collapse("hide");
        }
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

    // Smooth scrolling to Contact section is attached to the "message" anchor in the footer
    $("#contactfooter").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {

            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });

        }  // End if
    });

    // Smooth scrolling to top is attached to the upwards, dynamic arrow in the footer
    $("#totop").on('click', function(event) {
        $("html, body").animate({
            scrollTop: 0
        }, 800);
    });

    // If the project pill nav is interacted with, update the filter feedback and hide the collapsed pill nav menu
    $('a[href*="pills"]').on('click', function(event) {
        $('#project_selector').text($(this).text());
        $('#tag_n').text($(this).data('n'));
        $('#bs-example-navbar-collapse-1').collapse("hide")
    });

});
