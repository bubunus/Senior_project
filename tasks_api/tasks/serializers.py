from rest_framework import serializers
from .models import Project, List, Task

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ['id', 'title']
        read_only_fields = ['id']


class ListSerializer(serializers.ModelSerializer):
    # tasks = serializers.SerializerMethodField()
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = List
        fields = ['id', 'title', 'tasks']
        read_only_fields = ['id', 'tasks']

    def get_tasks(self, obj):
        return obj.task_set.all()
    
class ProjectSerializer(serializers.ModelSerializer):
    # username = serializers.SerializerMethodField()
    # lists = serializers.SerializerMethodField()
    lists = ListSerializer(many=True, read_only=True)


    class Meta:
        model = Project
        fields = ['id', 'name', 'lists']
        read_only_fields = ['id', 'lists']

    # def get_username(self, obj):
    #     return obj.user.username

    def get_lists(self, obj):
        return obj.list_set.all()
    
