from rest_framework import serializers
from .models import User

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User 
        fields = ["id", "username", "password"]
