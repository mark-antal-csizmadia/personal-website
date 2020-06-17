from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView
from blog.models import Post, Tag
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


def blog_home_view(request):
    page = request.GET.get('page', 1)

    posts = Post.objects.all().order_by('-date_posted')

    paginator = Paginator(posts, 4)

    featured_posts = Post.objects.filter(featured=True)
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(1)
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
    print("prev {0} next {1}".format(previous_page_number, next_page_number))
    context = {"posts": posts,
               "previous_page_number": previous_page_number,
               "next_page_number":next_page_number,
               "tags": Tag.objects.all(),
               "featured_posts": featured_posts}

    return render(request, 'blog/blog_home.html', context)


def blog_filter_view(request, tag_slug):
    page = request.GET.get('page', 1)
    #tag = request.GET.get('tag', 1)
    t = Tag.objects.get(slug=tag_slug)
    posts = Post.objects.filter(tags=t)
    paginator = Paginator(posts, 2)

    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(1)
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


def post_detail_view(request, slug):
    post = Post.objects.get(slug=slug)
    sections = {}
    for idx, section_text in enumerate(post.section_texts.split("#")):
        sections["section_"+str(idx+1)] = section_text
    context = {"object": post, "sections": sections}
    return render(request, 'blog/post_detail.html', context)

