# Generated by Django 3.0.6 on 2020-06-03 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0010_auto_20200603_2305'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='tags',
        ),
        migrations.AddField(
            model_name='project',
            name='tags',
            field=models.CharField(default='none', max_length=200),
        ),
        migrations.DeleteModel(
            name='Tag',
        ),
    ]
