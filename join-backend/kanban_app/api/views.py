from rest_framework import viewsets
from kanban_app.models import Task, Subtask, Contact
from .serializers import TaskSerializer, SubtaskSerializer, ContactSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet für Aufgaben. Authentifizierte Nutzer sehen nur ihre eigenen Tasks."""

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Setzt den User beim Erstellen automatisch."""
        serializer.save(user=self.request.user)

    def get_queryset(self):
        """Superuser sehen alle Tasks, normale Nutzer nur ihre eigenen."""
        if self.request.user.is_superuser:
            return Task.objects.all()
        return Task.objects.filter(user=self.request.user)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Custom Action zum Aktualisieren des Task-Status."""
        task = self.get_object()
        status = request.data.get('status', task.status)
        if status not in dict(Task.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=400)
        task.status = status
        task.save()
        return Response({'id': task.id, 'status': task.status}, status=200)


class SubtaskViewSet(viewsets.ModelViewSet):
    """ViewSet für Subtasks. Zugriff nur auf eigene Subtasks."""
    
    serializer_class = SubtaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Superuser sehen alle Subtasks, normale Nutzer nur ihre eigenen."""
        if self.request.user.is_superuser:
            return Subtask.objects.all()
        return Subtask.objects.filter(task__user=self.request.user)

    def perform_create(self, serializer):
        """Erstellt Subtask."""
        serializer.save()

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Custom Action zum Ändern des Subtask-Status."""
        subtask = self.get_object()
        new_status = request.data.get('status')
        if new_status not in ['inProgress', 'done']:
            return Response({'error': 'Invalid status'}, status=400)
        subtask.status = new_status
        subtask.save()
        return Response({'id': subtask.id, 'status': subtask.status}, status=200)


class ContactViewSet(viewsets.ModelViewSet):
    """ViewSet für Kontakte. Kontakte sind an den eingeloggten Nutzer gebunden."""

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Setzt den User beim Erstellen automatisch."""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Sichert, dass der User bei Updates gesetzt bleibt."""
        serializer.save(user=self.request.user)