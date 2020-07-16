from django.urls import path
from .views import post_detail_view, blog_filter_view, blog_home_view, lazy_load_posts, blog_filter_view_lazy

# The URL patterns used in the blog application
urlpatterns = [
    # The blog landing page, listing all of the blog posts in descending post date order
    path('', blog_home_view, name='blog-home'),
    # Lazy loading unfiltered posts (Everything filter)
    path('lazy_load_posts/', lazy_load_posts, name='lazy_load_posts'),
    # Filtering posts with tags (filter in categories)
    path('category/<slug:tag_slug>/', blog_filter_view, name='blog-filter'),
    # Lazy loading filtered posts (some tag as filter)-
    path('category/<slug:tag_slug>/lazy_load_posts/', blog_filter_view_lazy, name='blog-filter-lazy'),
    # Detailed view of a post
    path('<slug:slug>/', post_detail_view, name='post-detail'),
]
