from django.db import models
from django.contrib.auth.models import User
from blog.models import Tag
from django.utils import timezone

# Create your models here.


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=200)
    tags = models.ManyToManyField(Tag)
    tags_as_str = models.CharField(max_length=500, default="default_tags_as_str")
    image = models.ImageField(default='default.jpg', upload_to='project_pics')
    project_url = models.CharField(max_length=600)
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    date_posted = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title}"

    def save(self, *args, **kwargs):
        self.tags_as_str = ', '.join([tag.name for tag in self.tags.all()])
        super().save(*args, **kwargs)
