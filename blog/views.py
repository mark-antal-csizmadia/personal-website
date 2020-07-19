from django.shortcuts import render
from blog.models import Post, Tag
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.template import loader
from django.http import JsonResponse
from django.db.models import Q
import random
from django.contrib import messages


# Global variable for paginating posts
PAGINATION_OBJECTS_PER_PAGE = 2


def blog_home_view(request):
    """
    Renders the blog_home.html file using request and a context.
    :param request: the Http request containing metadata about the request
    :return: render the blog_home.html file using request and a context
    """
    # Get the page of the paginated (unfiltered) posts
    page = request.GET.get('page', 1)

    # Retrieve all of the posts in descending posted date order
    posts = Post.objects.all().order_by('-date_posted')

    # Paginate the posts
    paginator = Paginator(posts, PAGINATION_OBJECTS_PER_PAGE)

    # Featured posts (scalable option, but for now, show only 2)
    featured_posts = Post.objects.filter(featured=True)

    # Make sure that the paginated page is free from errors.
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(2)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)

    # Pagination logic. If previous_page_number and next_page_number are equal, there is only 1 single post.
    if posts.has_previous():
        previous_page_number = posts.previous_page_number()
    else:
        previous_page_number = posts.number
    if posts.has_next():
        next_page_number = posts.next_page_number()
    else:
        next_page_number = posts.number

    # Context used in HTML.
    context = {
        # The browser tab title
        "title": "Blog",
        # The paginated page of posts
        "posts": posts,
        # The number of the previous page
        "previous_page_number": previous_page_number,
        # The number of the next page
        "next_page_number":next_page_number,
        # All of the tags, not masked
        "tags": Tag.objects.all(),
        # The featured posts, for now 2
        "featured_posts": featured_posts,
        # The initial filter is Everything, for now
        "filtered_by": "Everything",
        # Do not show the Back to Blog Home button in the navbar (only shown when posts are
        # filtered or in detailed view)
        "show_blog_home_button": False
    }

    blog_use_filter_message = \
        f'Use the drop-down menu to filter blog posts by different topics. Use the button on the bottom' \
        f'of the currently filtered blog posts to load more of them. You can close this message.'
    messages.add_message(request, messages.INFO, blog_use_filter_message, extra_tags='blog_use_filter_message')

    return render(request, 'blog/blog_home.html', context)


def lazy_load_posts(request):
    """
    Lazy load every post (unfiltered) using AJAX
    :param request: the Http request containing metadata about the request
    :return: a JSON object used for the pagination and lazy loading of unfiltered posts
    """
    # Get the current page number
    page = request.POST.get('page')

    # Get all of the posts, and order them in descending date posted order
    posts = Post.objects.all().order_by('-date_posted')

    # Use Django's pagination to paginate the posts into pages
    # https://docs.djangoproject.com/en/dev/topics/pagination/
    paginator = Paginator(posts, PAGINATION_OBJECTS_PER_PAGE)

    # Make sure that the paginated page of posts is free from error
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(2)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)

    # Build a html posts_html with the paginated posts (uses posts.html)
    posts_html = loader.render_to_string(
        'blog/posts.html',
        {'posts': posts}
    )

    # Package output data and return it as a JSON object
    output_data = {
        'posts_html': posts_html,
        'has_next': posts.has_next()
    }
    return JsonResponse(output_data)


def blog_filter_view(request, tag_slug):
    """
    List view of filtered blog posts. Similar to blog_home.html, except the posts are filtered.
    :param request: the Http request containing metadata about the request
    :param tag_slug: the slug of the Tag object used in filtering blog posts
    :return: render the blog_filter.html, which is similar to blog_home.html
    """
    # The code is the same as in blog_home_view, except the posts are filtered using a Tag
    page = request.GET.get('page', 1)

    # Get the filtering tag with the slug of that Tag
    t = Tag.objects.get(slug=tag_slug)

    posts = Post.objects.filter(tags=t).order_by('-date_posted')

    paginator = Paginator(posts, PAGINATION_OBJECTS_PER_PAGE)

    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(2)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)

    if posts.has_previous():
        previous_page_number = posts.previous_page_number()
    else:
        previous_page_number = posts.number
    if posts.has_next():
        next_page_number = posts.next_page_number()
    else:
        next_page_number = posts.number

    context = {
        "title": "Blog",
        "posts": posts,
        "previous_page_number": previous_page_number,
        "next_page_number": next_page_number,
        "tags": Tag.objects.all(),
        "filtered_by": t,
        "show_blog_home_button": True
    }

    return render(request, 'blog/blog_filter.html', context)


def blog_filter_view_lazy(request, tag_slug):
    """
    Lazy load filtered posts. Similar to lazy_load_posts, but posts are filtered and the URL path reflects that
    :param request: the Http request containing metadata about the request
    :param tag_slug: the slug of the Tag object used in filtering blog posts
    :return: a JSON object with the data needed for lazily loading filtered posts
    """
    page = request.POST.get('page')

    t = Tag.objects.get(slug=tag_slug)

    posts = Post.objects.filter(tags=t).order_by('-date_posted')

    # Use Django's pagination
    # https://docs.djangoproject.com/en/dev/topics/pagination/

    paginator = Paginator(posts, PAGINATION_OBJECTS_PER_PAGE)

    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(2)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)

    # Build a posts_html  with the paginated posts
    posts_html = loader.render_to_string(
        'blog/posts.html',
        {'posts': posts}
    )

    # Package output data and return it as a JSON object
    output_data = {
        'posts_html': posts_html,
        'has_next': posts.has_next()
    }

    return JsonResponse(output_data)


def post_detail_view(request, slug):
    """
    Detailed view of Post.
    :param request: the Http request containing metadata about the request
    :param slug: the slug of the title of the Post, used to find the reverse URL path to the detail view of a Post
    :return: renders post_detail.html
    """
    # Get the Post with the slug
    post = Post.objects.get(slug=slug)

    # Select 2 random posts that can be any Post but the one in detailed view currently
    possible_random_posts = Post.objects.filter(~Q(slug=post.slug))
    random_posts = random.sample(list(possible_random_posts), 2)

    # Extract the sections of the Post content. Used to build a contents window for the text.
    # Note that in the admin page, the section names have to be separated by a hash tag (#)
    sections = {}
    for idx, section_text in enumerate(post.section_texts.split("#")):
        sections["section_"+str(idx+1)] = section_text

    context = {
        # The title of hte browser tab
        "title": post.title,
        # The post to be viewed in detail is called object in the detail view HTML file
        "object": post,
        # The sections used to build a contents navigation window
        "sections": sections,
        # Random posts shown at the end of the content of the Post to keep user busy in the reading cycle
        "random_posts": random_posts,
        # Show the Back to Blog Home button to help user easily get back to the home of the blog
        "show_blog_home_button": True
    }

    return render(request, 'blog/post_detail.html', context)
