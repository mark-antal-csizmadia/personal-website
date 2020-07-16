from django.contrib import admin
from .models import Post, Tag
from django_summernote.admin import SummernoteModelAdmin


# Make the content attribute of the Post model editable with summernote in the admin page.
class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)


# Register models
admin.site.register(Post, PostAdmin)
admin.site.register(Tag)
