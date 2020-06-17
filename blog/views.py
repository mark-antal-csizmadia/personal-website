from django.shortcuts import render
from blog.models import Post, Tag
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.template import loader
from django.http import JsonResponse

PAGINATION_OBJECTS_PER_PAGE = 2


def blog_home_view(request):
    page = request.GET.get('page', 1)

    posts = Post.objects.all().order_by('-date_posted')

    paginator = Paginator(posts, PAGINATION_OBJECTS_PER_PAGE)

    featured_posts = Post.objects.filter(featured=True)
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

    context = {"posts": posts,
               "previous_page_number": previous_page_number,
               "next_page_number":next_page_number,
               "tags": Tag.objects.all(),
               "featured_posts": featured_posts,
               "filtered_by": "Everything"}

    return render(request, 'blog/blog_home.html', context)


def lazy_load_posts(request):
    page = request.POST.get('page')
    posts = Post.objects.all().order_by('-date_posted')
    # use Django's pagination
    # https://docs.djangoproject.com/en/dev/topics/pagination/
    paginator = Paginator(posts, PAGINATION_OBJECTS_PER_PAGE)
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(2)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)
    # build a html posts list with the paginated posts
    posts_html = loader.render_to_string(
        'blog/posts.html',
        {'posts': posts}
    )
    # package output data and return it as a JSON object
    output_data = {
        'posts_html': posts_html,
        'has_next': posts.has_next()
    }
    return JsonResponse(output_data)


def blog_filter_view(request, tag_slug):
    page = request.GET.get('page', 1)
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

    context = {"posts": posts,
               "previous_page_number": previous_page_number,
               "next_page_number": next_page_number,
               "tags": Tag.objects.all(),
               "filtered_by": t}

    return render(request, 'blog/blog_filter.html', context)


def blog_filter_view_lazy(request, tag_slug):
    page = request.POST.get('page')
    print(page)
    t = Tag.objects.get(slug=tag_slug)
    posts = Post.objects.filter(tags=t).order_by('-date_posted')
    # use Django's pagination
    # https://docs.djangoproject.com/en/dev/topics/pagination/
    paginator = Paginator(posts, PAGINATION_OBJECTS_PER_PAGE)
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(2)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)
    # build a html posts list with the paginated posts
    posts_html = loader.render_to_string(
        'blog/posts.html',
        {'posts': posts}
    )
    # package output data and return it as a JSON object
    output_data = {
        'posts_html': posts_html,
        'has_next': posts.has_next()
    }
    return JsonResponse(output_data)


def post_detail_view(request, slug):
    post = Post.objects.get(slug=slug)
    sections = {}
    for idx, section_text in enumerate(post.section_texts.split("#")):
        sections["section_"+str(idx+1)] = section_text
    context = {"object": post, "sections": sections}
    return render(request, 'blog/post_detail.html', context)

