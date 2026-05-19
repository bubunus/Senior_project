from django.contrib import admin

from .models import Project, List, Task

admin.site.register(Project)
admin.site.register(List)
admin.site.register(Task)
