# Generated by Django 5.1.4 on 2024-12-31 01:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kanban_app', '0009_alter_task_subtasks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='category',
            field=models.CharField(blank=True, choices=[('technical', 'Technical'), ('userStory', 'User Story')], default='', max_length=10),
        ),
    ]
