// When the user scrolls down 1px from the top of the document, resize the navbar's padding and the logo's font size,
// and play with a shadow effect
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
        document.getElementById("navbar").style.padding = "1rem 1rem";
        document.getElementById("navbarbrand").style.font = "25px Arial, sans-serif !important";
        document.getElementById("navbar").style.boxShadow = "0 1px 3px rgba(0,0,0, 0.14), 0 2px 3px rgba(0,0,0,0.24)";
    }
    else {
        document.getElementById("navbar").style.padding = "2.5rem 1.5rem";
        document.getElementById("navbarbrand").style.fontSize = "18px Arial, sans-serif !important";
        // If no scrolling has taken place yet but the collapsed nav menu is shown, still add the shadow effect
        if ( !$('#navbarToggle').hasClass('show')) {
            document.getElementById("navbar").style.boxShadow = "0 0px 0px rgba(0,0,0, 0.14), 0 0px 0px rgba(0,0,0,0.24)";
        }
        // If no scrolling has taken place yet and the collapsed nav menu is NOT shown, take away the shadow effect
        else {
            document.getElementById("navbar").style.boxShadow = "0 1px 3px rgba(0,0,0, 0.14), 0 2px 3px rgba(0,0,0,0.24)";
        }
    }
    // Show the percentage of a post detail view that the user read in the form of a vertical loading bar just
    // under the navbar.
    if (document.getElementById('myBar') !== null) {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = (winScroll / height) * 100;
        document.getElementById("myBar").style.width = scrolled + "%";
    }
}