from django.db import models
from django.contrib.auth.models import User
from blog.models import Tag
from django.utils import timezone


class Project(models.Model):
    """
    The Project class represents the Project data table that contains information about projects.
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=200)
    # The Tag class is defined in blog\models.py.
    # Every Project has many (Many-to-many) tags that can be the same or different across Projects.
    tags = models.ManyToManyField(Tag)
    # The set of Tag objects are converted into a Python str for easier representation on the top of Project cards.
    tags_as_str = models.CharField(max_length=500, default="default_tags_as_str")
    image = models.ImageField(default='default.jpg', upload_to='project_pics')
    project_url = models.CharField(max_length=600)
    # I am the only possible author in the database (mark).
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    # Date posted for ordering the Project objects in list views.
    date_posted = models.DateTimeField(default=timezone.now)

    def __str__(self):
        """
        Dunder method overwritten to print Project using its title.
        :return: The title of the Project object.
        """
        return f"{self.title}"

    def save(self, *args, **kwargs):
        """
        Overriding the save method of models.Model to concatenate Tags to Python str for easier representation.
        :param args: Not key-worded arguments used to save models.Model.
        :param kwargs: Key-worded arguments used to save models.Model.
        :return:
        """
        super().save(*args, **kwargs)
        self.tags_as_str = ', '.join([tag.name for tag in self.tags.all()])
