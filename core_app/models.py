from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class ContactModel(models.Model):
    """
    The ContactModel class represents contacts. Contacts are generated when someone contacts me using the contact form.
    """
    email = models.CharField(max_length=500, default="default_email")
    name = models.CharField(max_length=500, default="default_name")
    subject = models.CharField(max_length=3000, default="default_subject")
    message = models.TextField()
    date_sent = models.DateTimeField(default=timezone.now)

    def __str__(self):
        """
        Represents an instance of the ContactModel class in the admin page.
        :return: ID of contact comprising the subject and the email of the person who contacted me.
        """
        return f"{self.subject} by {self.email}"


class Profile(models.Model):
    """
    The Profile class represents profiles - a User Django model accompanied by an image. I am the only intended profile,
    but there could be more. The Profile class is only used when displaying my profile picture in the About section.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg', upload_to='profile_pics')

    def __str__(self):
        """
        Represents the Profile object.
        :return: The ID of the Profile object comprising the username of the User Django class and "Profile" as string.
        """
        return f"{self.user.username} Profile"


class FilePDF(models.Model):
    """
    The FilePDF class represents PDF files that I uploaded to the website such as CV, BEng thesis etc.
    """
    title = models.CharField(max_length=200, default="default_file_name")
    identifier = models.CharField(max_length=200, default="default_file_identifier")
    pdf = models.FileField(upload_to='pdf')

    def __str__(self):
        """
        Represents the FilePDF model comprising the title of the PDFFile and "PDF file" as string.
        :return:
        """
        return f"{self.title} PDF file"
