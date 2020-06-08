from django.contrib import admin
from .models import Post, Tag
from django_summernote.admin import SummernoteModelAdmin


class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)


# Register your models here.
admin.site.register(Post, PostAdmin)
admin.site.register(Tag)
