"""django_personal_website URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core_app import views as core_app_views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include

# Global URL patterns.
urlpatterns = [
    # The admin page.
    path('admin/', admin.site.urls),
    # The landing page and main portfolio page.
    path('', core_app_views.core_app_view, name="core_app_view"),
    # URL for loading projects lazily.
    path('lazy_load_posts/', core_app_views.projects_filter_view_lazy, name='lazy_load_posts'),
    # URL for the use of the summernote module in the admin page.
    path('summernote/', include('django_summernote.urls')),
    # The blog application attached to the landing page.
    path('blog/', include('blog.urls')),
    # For downloading PDFs documnets such as my CV or BEng thesis.
    path('pdf/<str:pdf_file_identifier>', core_app_views.download_pdf, name='download-pdf'),
]

# If in debug mode, use the local media root. Later, media files will be stored in an AWS S3 bucket.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
