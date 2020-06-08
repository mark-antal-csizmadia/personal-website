from django import forms
from .models import ContactModel


class ContactForm(forms.ModelForm):
    email = forms.EmailField(required=True)
    name = forms.CharField(max_length=500, required=True)
    subject = forms.CharField(max_length=500, required=True)
    message = forms.CharField(widget=forms.Textarea, required=True)

    class Meta:
        model = ContactModel
        fields = ['email', 'name', 'subject', 'message']


