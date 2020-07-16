from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.template.defaultfilters import slugify
from django.urls import reverse
import readtime


class TagNameField(models.CharField):
    """
    Just a fancy class for converting a string to a title of Tag objects.
    """
    def __init__(self, *args, **kwargs):
        super(TagNameField, self).__init__(*args, **kwargs)

    def get_prep_value(self, value):
        """

        :param value: automatically get the string to be converted to a title
        :return: the title converted into from a string
        """
        return str(value).title()


class Tag(models.Model):
    """
    The Tag class represents the Tag table, the rows of which are tags that are used to organize projects
    and blog posts. The Tag class is used both in the core_app module and the blog module.
    """
    name = TagNameField(max_length=32)
    slug = models.SlugField(default="")

    def __str__(self):
        """
        To represent the Tag with a string in the admin page.
        :return: the name of the Tag
        """
        return self.name

    def save(self, *args, **kwargs):
        """
        Overriding the default save method.
        :param args: Not key-worded arguments of default save method.
        :param kwargs: Key-worded arguments of default save method.
        :return: none, but updates the Tag object with the slugified name as a slug
        """
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Post(models.Model):
    """
    The Post class represents a Post table, the rows of which are blog posts in the blog application.
    """
    title = models.CharField(max_length=200)
    image = models.ImageField(default='default.jpg', upload_to='post_pics')
    image_source = models.CharField(default="default_image_source", max_length=300)
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
        """
        To represent Post by its title
        :return: the title of the Post
        """
        return self.title

    def get_absolute_url(self):
        """
        Returns the reverse URL path of the Post using its slug
        :return: the reverse URL path to the Post
        """
        return reverse('post-detail', kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        """
        Overriding the default save method.
        :param args: Not key-worded arguments of default save method.
        :param kwargs: Key-worded arguments of default save method.
        :return: none, but updates the Post with the slugified title for the reverse URL path, and the readtime of
        post content (the field that is editable with summernote)
        """
        self.slug = slugify(self.title)
        self.post_readtime = readtime.of_html(self.content)
        super().save(*args, **kwargs)
        # size = (600, 600)
        # image = Image.open(self.image.path)
        # image.thumbnail(size, Image.ANTIALIAS)
        # background = Image.new('RGB', size, (255, 255, 255))
        # background.paste(
        #     image, (int((size[0] - image.size[0]) / 2), int((size[1] - image.size[1]) / 2))
        # )
        # background.save(self.image.path)
