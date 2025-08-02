from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from user_auth_app.models import UserProfile
from rest_framework.authtoken.models import Token


class UserAuthTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.token = Token.objects.create(user=self.user)

    def test_registration_success(self):
        url = reverse('registration')
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpass123",
            "repeated_password": "newpass123"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["username"], "newuser")

    def test_registration_password_mismatch(self):
        url = reverse('registration')
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpass123",
            "repeated_password": "wrongpass"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_existing_username(self):
        url = reverse('registration')
        data = {
            "username": "testuser",
            "email": "unique@example.com",
            "password": "pass12345",
            "repeated_password": "pass12345"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

    def test_registration_existing_email(self):
        url = reverse('registration')
        data = {
            "username": "uniqueuser",
            "email": "test@example.com", 
            "password": "pass12345",
            "repeated_password": "pass12345"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_login_success(self):
        url = reverse('login')
        data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

    def test_login_wrong_password(self):
        url = reverse('login')
        data = {
            "email": "test@example.com",
            "password": "wrongpass"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_non_existing_email(self):
        url = reverse('login')
        data = {
            "email": "nouser@example.com",
            "password": "testpass123"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_guest_login(self):
        url = reverse('guest-login')
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], "Guest")
        self.assertIn("access", response.data)
