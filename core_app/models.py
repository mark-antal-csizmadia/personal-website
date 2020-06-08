from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from PIL import Image
# Create your models here.


class ContactModel(models.Model):
    email = models.CharField(max_length=500, default="default_email")
    name = models.CharField(max_length=500, default="default_name")
    subject = models.CharField(max_length=3000, default="default_subject")
    message = models.TextField()
    date_sent = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.subject} by {self.email}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg', upload_to='profile_pics')

    def __str__(self):
        return f"{self.user.username} Profile"


class FilePDF(models.Model):
    title = models.CharField(max_length=200, default="default_file_name")
    identifier = models.CharField(max_length=200, default="default_file_identifier")
    pdf = models.FileField(upload_to='pdf')

    def __str__(self):
        return f"{self.title} PDF file"
