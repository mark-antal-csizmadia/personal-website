from django.contrib import admin
from django.urls import path
from core_app import views as core_app_views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include
from .views import post_detail_view, about_the_blog_view, blog_filter_view, blog_home_view


urlpatterns = [
    path('', blog_home_view, name='blog-home'),
    path('category/<slug:tag_slug>/', blog_filter_view, name='blog-filter'),
    path('<slug:slug>/', post_detail_view, name='post-detail'),
    path('about/', about_the_blog_view, name='about-the-blog'),
]
