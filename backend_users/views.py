from django.shortcuts import get_object_or_404
from .models import User

# REST framework
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

# Serializers
from .serializers import CustomUserSerializer


@api_view(["POST"])
def signup(request):
    """
    Signs up the user for authentication.

    Returns an authentication token and user's data.
    """

    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        # Save user to database
        serializer.save()
        user = User.objects.get(username=request.data["username"])
        # Hashes Password
        user.set_password(request.data["password"])
        user.save()
        token = Token.objects.create(user=user)

        return Response({"token": token.key, "user": serializer.data})

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def login(request):
    """
    Logins the user to the website.

    Returns an authentication token and user's data.
    """

    try:
        user = User.objects.get(username=request.data["username"])
    except (KeyError, User.DoesNotExist):
        return Response({"message": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(request.data["password"]):
        return Response({"message": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)

    token, created = Token.objects.get_or_create(user=user)
    serializer = CustomUserSerializer(user)

    return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_200_OK)

@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Deletes the user's authentication token.

    Returns a message if the user logged out successfully.
    """

    request.user.auth_token.delete()

    return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)

@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete(request):
    """
    Deletes the user's account
    """

    request.user.delete()

    return Response({"message": "Account has been deleted."}, status=status.HTTP_200_OK)

@api_view(["GET"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def validate(request):
    return Response({"message": "You have passed the authentication test!"}, status=status.HTTP_200_OK)
