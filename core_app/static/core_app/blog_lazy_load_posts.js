// This function is almost identical to those used for lazy loading in the core_app module
(function($) {
    $('#lazyLoadLink').on('click', function() {
        var link = $(this);
        var page = link.data('page');
        $.ajax({
            type: 'post',
            url: 'lazy_load_posts/',
            data: {
                'page': page,
                'csrfmiddlewaretoken': window.CSRF_TOKEN // from index.html
            },
            success: function(data) {
                // if there are still more pages to load,
                // add 1 to the "Load More Posts" link's page data attribute
                // else hide the link
                if (data.has_next) {
                    link.data('page', page+1);
                }
                else {
                    link.hide();
                }
                // append html to the post_list div
                $('#post_list').append(data.posts_html);
            },
            error: function(xhr, status, error) {
                // if anything goes wrong
            }
        });
    });
}(jQuery));