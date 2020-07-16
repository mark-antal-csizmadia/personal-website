from django import forms
from .models import ContactModel


class ContactForm(forms.ModelForm):
    """
    The ContactForm class represents contact forms that are dynamically generated when someone contacts me usign the
    contact form in the Contact section.
    """
    email = forms.EmailField(required=True)
    name = forms.CharField(max_length=500, required=True)
    subject = forms.CharField(max_length=500, required=True)
    message = forms.CharField(widget=forms.Textarea, required=True)

    class Meta:
        """
        The Meta class generates a ContactModel dynamically upon the instantiation of a ContactForm object.
        """
        model = ContactModel
        fields = ['email', 'name', 'subject', 'message']
