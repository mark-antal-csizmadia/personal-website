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


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', core_app_views.core_app_view, name="core_app_view"),
    path('summernote/', include('django_summernote.urls')),
    path('blog/', include('blog.urls')),
    path('cv/', core_app_views.download_cv_as_pdf, name='cv-download'),
    path('project_report/', core_app_views.download_project_report_as_pdf, name='project-report-download'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
