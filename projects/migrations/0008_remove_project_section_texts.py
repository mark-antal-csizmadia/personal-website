# Generated by Django 3.0.6 on 2020-06-02 16:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0007_project_section_texts'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='section_texts',
        ),
    ]
