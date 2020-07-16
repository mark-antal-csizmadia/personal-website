(function($) {
    // If clicked on the Load Glyph More Projects button at the bottom of the active project pill tab
    $('#lazyLoadLinkProjectsActive').on('click', function() {
        // Retrieve the DOM button object as the pagination page and the tag is stored in it
        var link = $(this);
        var page = link.data('page');
        var tag_slug = link.data('tag');

        // Using AJAX to not re-render the page for loading more paginated projects
        $.ajax({
            type: 'post',
            url: 'lazy_load_posts/',
            data: {
                'page': page,
                'tag_slug': tag_slug,
                'csrfmiddlewaretoken': window.CSRF_TOKEN // from the header of base.html
            },
            success: function(data) {
                // if there are still more pages to load,
                // add 1 to the "Load Glyph More Projects" link's page data attribute
                // else hide the link
                if (data.has_next) {
                    link.data('page', page+1);
                }
                else {
                    link.hide();
                }
                // append html to the project_list_active div
                $('#project_list_active').append(data.project_html);
            },
            error: function(xhr, status, error) {
                // if anything goes wrong
            }
        });
    });
}(jQuery));