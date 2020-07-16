from django.contrib import admin
from .models import ContactModel, Profile, FilePDF


# Register models.
admin.site.register(ContactModel)
admin.site.register(Profile)
admin.site.register(FilePDF)
