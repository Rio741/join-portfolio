from rest_framework import serializers
from user_auth_app.models import UserProfile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'location']


class RegistrationSerializer(serializers.ModelSerializer):

    repeated_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'repeated_password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise ValidationError('A user with that username already exists.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError('A user with this email already exists.')
        return value

    def save(self):
        pw = self.validated_data['password']
        repeated_pw = self.validated_data['repeated_password']
        if pw != repeated_pw:
            raise ValidationError({'error': 'Passwords don\'t match'})
        account = User(email=self.validated_data['email'], username=self.validated_data['username'])
        account.set_password(pw)
        account.save()
        return account

    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'email': 'Benutzer mit dieser E-Mail existiert nicht.'})
        user = authenticate(username=user.username, password=password)
        if not user:
            raise serializers.ValidationError({'password': 'Ungültige Login-Daten.'})
        data['user'] = user
        return data