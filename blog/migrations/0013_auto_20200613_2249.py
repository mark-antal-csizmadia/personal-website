# Generated by Django 3.0.6 on 2020-06-13 21:49

import blog.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0012_tag_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=blog.models.TagNameField(max_length=32),
        ),
    ]
