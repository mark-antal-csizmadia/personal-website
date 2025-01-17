# Generated by Django 3.0.6 on 2020-05-26 23:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_app', '0003_contactmodel_date_sent'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contactmodel',
            name='from_email',
        ),
        migrations.AddField(
            model_name='contactmodel',
            name='email',
            field=models.CharField(default='default_email', max_length=500),
        ),
        migrations.AlterField(
            model_name='contactmodel',
            name='name',
            field=models.CharField(default='default_name', max_length=500),
        ),
        migrations.AlterField(
            model_name='contactmodel',
            name='subject',
            field=models.CharField(default='default_subject', max_length=3000),
        ),
    ]
