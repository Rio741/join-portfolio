from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from kanban_app.models import Task, Subtask, Contact
from django.urls import reverse

User = get_user_model()


class KanbanAPITestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username="user1", password="pass123")
        self.user2 = User.objects.create_user(
            username="user2", password="pass123")
        self.superuser = User.objects.create_superuser(
            username="admin", password="adminpass")

        self.client.login(username="user1", password="pass123")

        self.task1 = Task.objects.create(
            title="Test Task",
            description="Test Description",
            assignedContacts=[],
            priority="urgent",
            category="Technical",
            user=self.user1
        )

        self.subtask1 = Subtask.objects.create(
            task=self.task1,
            title="Subtask 1",
            status="in-progress"
        )

        self.contact1 = Contact.objects.create(
            user=self.user1,
            name="Contact 1",
            email="contact1@example.com"
        )

    # -------- TASK TESTS --------
    def test_create_task_with_subtasks(self):
        url = reverse('task-list')
        payload = {
            "title": "New Task",
            "description": "Some description",
            "assignedContacts": [],
            "priority": "medium",
            "category": "User_Story",
            "subtasks": [
                {"title": "Subtask A", "status": "in-progress"},
                {"title": "Subtask B", "status": "in-progress"}
            ]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)
        self.assertEqual(Subtask.objects.count(), 3)

    def test_get_tasks_only_user_owned(self):
        Task.objects.create(
            title="Other User Task",
            description="...",
            assignedContacts=[],
            priority="low",
            category="Technical",
            user=self.user2
        )
        url = reverse('task-list')
        response = self.client.get(url)
        self.assertEqual(len(response.data), 1)

    def test_update_task_and_subtasks(self):
        url = reverse('task-detail', args=[self.task1.id])
        payload = {
            "title": "Updated Task",
            "description": "Updated Desc",
            "assignedContacts": [],
            "priority": "low",
            "category": "Technical",
            "subtasks": [
                {"id": self.subtask1.id, "title": "Updated Subtask", "status": "done"},
                {"title": "New Subtask", "status": "in-progress"}
            ]
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.task1.subtasks.count(), 2)

    def test_update_task_status_action(self):
        url = reverse('task-update-status', args=[self.task1.id])
        response = self.client.patch(url, {"status": "done"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task1.refresh_from_db()
        self.assertEqual(self.task1.status, "done")

    def test_subtask_update_status_action(self):
        url = reverse('subtask-update-status', args=[self.subtask1.id])
        response = self.client.patch(url, {"status": "done"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.subtask1.refresh_from_db()
        self.assertEqual(self.subtask1.status, "done")

    def test_user_cannot_access_others_subtasks(self):
        other_task = Task.objects.create(
            title="Other Task",
            description="...",
            assignedContacts=[],
            priority="low",
            category="Technical",
            user=self.user2
        )
        other_subtask = Subtask.objects.create(
            task=other_task, title="Other Subtask")
        url = reverse('subtask-detail', args=[other_subtask.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # -------- CONTACT TESTS --------
    def test_create_contact(self):
        url = reverse('contact-list')
        payload = {"name": "New Contact",
                   "email": "new@example.com", "phone_number": "123"}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contact.objects.filter(user=self.user1).count(), 2)

    def test_update_contact(self):
        url = reverse('contact-detail', args=[self.contact1.id])
        response = self.client.patch(
            url, {"name": "Updated Contact"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.contact1.refresh_from_db()
        self.assertEqual(self.contact1.name, "Updated Contact")

    def test_user_cannot_see_others_contacts(self):
        Contact.objects.create(
            user=self.user2, name="Other Contact", email="other@example.com")
        url = reverse('contact-list')
        response = self.client.get(url)
        self.assertEqual(len(response.data), 2)
