from django.contrib import admin
from django.urls import path
from core_app import views as core_app_views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include
from .views import post_detail_view, blog_filter_view, blog_home_view, lazy_load_posts, blog_filter_view_lazy


urlpatterns = [
    path('', blog_home_view, name='blog-home'),
    path('lazy_load_posts/', lazy_load_posts, name='lazy_load_posts'),
    path('category/<slug:tag_slug>/', blog_filter_view, name='blog-filter'),
    path('category/<slug:tag_slug>/lazy_load_posts/', blog_filter_view_lazy, name='blog-filter-lazy'),
    path('<slug:slug>/', post_detail_view, name='post-detail'),
]
