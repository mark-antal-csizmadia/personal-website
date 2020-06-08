from django.contrib import admin
from .models import ContactModel, Profile, FilePDF

# Register your models here.


admin.site.register(ContactModel)
admin.site.register(Profile)
admin.site.register(FilePDF)
