from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from .models import Project
from .serializers import ProjectSerializer

class ProjectListView(ListCreateAPIView):
    serializer_class = ProjectSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # return Project.objects.filter(user=self.request.user)
        return Project.objects.all()
    
    def perform_create(self, serializer):
        serializer.save()
