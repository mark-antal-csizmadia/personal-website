# Generated by Django 3.0.6 on 2020-07-10 13:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0015_post_post_readtime'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='image_source',
            field=models.TextField(default='default_image_source', max_length=300),
        ),
    ]
