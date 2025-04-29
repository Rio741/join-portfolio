from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tasks', views.TaskViewSet, basename='task')
router.register(r'subtasks', views.SubtaskViewSet, basename='subtask')
router.register(r'contacts', views.ContactViewSet, basename='contact')


urlpatterns = [
    path('', include(router.urls)),
]
