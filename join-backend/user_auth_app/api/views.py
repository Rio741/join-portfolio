from rest_framework import generics, status
from user_auth_app.models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import RegistrationSerializer, LoginSerializer
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User


class UserProfileList(generics.ListCreateAPIView):
    """Listet alle UserProfile oder erstellt ein neues."""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    """Zeigt, aktualisiert oder löscht ein bestimmtes UserProfile."""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class RegistrationView(APIView):
    """Registriert einen neuen Benutzer und gibt ein Token zurück."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            save_account = serializer.save()
            token, created = Token.objects.get_or_create(user=save_account)
            data = {
                'token': token.key,
                'username': save_account.username,
                'email': save_account.email
            }
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomLoginView(ObtainAuthToken):
    """Authentifiziert einen Benutzer und gibt ein Token zurück."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            data = {
                'token': token.key,
                'username': user.username,
                'email': user.email,
            }
        else:
            data = serializer.errors
            raise AuthenticationFailed('Invalid login credentials')
        return Response(data)


class GuestLoginView(APIView):
    """Loggt einen Gastnutzer ein (bzw. erstellt ihn) und gibt ein Token zurück."""
    permission_classes = [AllowAny]

    def post(self, request):
        guest_user, created = User.objects.get_or_create(
            username='Guest',
            defaults={'is_active': True, 'password': ''}
        )
        token, created = Token.objects.get_or_create(user=guest_user)
        return Response({'access': token.key, 'username': guest_user.username, 'email': guest_user.email})