from django.db import models


class Project(models.Model):
    title = models.CharField(max_length=255)
    name = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.name
    

class List(models.Model):
    title = models.CharField(max_length=255)
    project = models.ForeignKey(Project, related_name='lists', on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    
class Task(models.Model):
    title = models.CharField(max_length=255)
    list = models.ForeignKey(List, related_name='tasks', on_delete=models.CASCADE)

    def __str__(self):
        return self.title