from django.db import models
from django.contrib.auth.models import User
from django.utils import  timezone
from django.template.defaultfilters import slugify
from django.urls import reverse
from PIL import Image
import readtime


class TagNameField(models.CharField):
    def __init__(self, *args, **kwargs):
        super(TagNameField, self).__init__(*args, **kwargs)

    def get_prep_value(self, value):
        return str(value).title()


class Tag(models.Model):
    name = TagNameField(max_length=32)
    slug = models.SlugField(default="")

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Post(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(default='default.jpg', upload_to='post_pics')
    short_intro = models.TextField(default="default short intro")
    content = models.TextField(default="default content")
    post_readtime = models.CharField(max_length=100, default="no readtime estimate")
    section_texts = models.TextField(default="none")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag)
    technologies = models.CharField(max_length=300, default="default_technology")
    date_posted = models.DateTimeField(default=timezone.now)
    date_updated = models.DateTimeField(default=timezone.now)
    slug = models.SlugField(default="", unique=True, max_length=200)
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('post-detail', kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        self.post_readtime = readtime.of_html(self.content)
        super().save(*args, **kwargs)
        #size = (600, 600)
        #image = Image.open(self.image.path)
        #image.thumbnail(size, Image.ANTIALIAS)
        #background = Image.new('RGB', size, (255, 255, 255))
        #background.paste(
        #    image, (int((size[0] - image.size[0]) / 2), int((size[1] - image.size[1]) / 2))
        #)
        #background.save(self.image.path)
