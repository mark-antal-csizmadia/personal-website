from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=200)
    tags = models.CharField(max_length=200, default="none")
    image = models.ImageField(default='default.jpg', upload_to='project_pics')
    project_url = models.CharField(max_length=600)
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return f"{self.title}"

