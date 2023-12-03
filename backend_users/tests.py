from django.urls import reverse

# REST Framework
from rest_framework.test import  APITestCase
from rest_framework import status

from . import views
from .models import User


class AuthenticationTestCase(APITestCase):
    def test_signup(self):
        """
        Test cases for sign up
        """

        # Sign up authentication
        response = self.client.post(
            reverse(views.signup),
            {"username": "test_user", "password": "123"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.json()["token"]), 30)
        self.assertEqual(response.json()["user"]["username"], "test_user")
        self.assertEqual(response.json()["user"]["password"], "123")

        # Same username error
        response = self.client.post(
            reverse(views.signup),
            {"username": "test_user", "password": "123"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["username"][0], "A user with that username already exists.")

        # Blank information
        response = self.client.post(
            reverse(views.signup),
            {"username": "", "password": ""},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["username"][0], "This field may not be blank.")
        self.assertEqual(response.json()["password"][0], "This field may not be blank.")

    def test_login(self):
        """
        Test cases for login
        """
        
        # Create user
        User.objects.create_user(username="test_user", password="123")

        # Login authentication
        response = self.client.post(
            reverse(views.login),
            {"username": "test_user", "password": "123"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.json()["token"]), 30)
        self.assertEqual(response.json()["user"]["username"], "test_user")
        self.assertEqual(response.json()["user"]["password"][:21], "pbkdf2_sha256$600000$")
        self.assertGreater(len(response.json()["user"]["password"]), 25)

        # Blank username or password
        response = self.client.post(
            reverse(views.login),
            {"username": "", "password": ""},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["message"], "Invalid username or password.")

        # No username and password
        response = self.client.post(
            reverse(views.login),
            {},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["message"], "Invalid username or password.")

        # Incorrect password
        response = self.client.post(
            reverse(views.login),
            {"username": "test_user", "password": ""},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["message"], "Invalid username or password.")

    def test_logout(self):
        """
        Test cases for logout
        """

        # Create user
        User.objects.create_user(username="test_user", password="123")

        # Login user
        response = self.client.post(
            reverse(views.login),
            {"username": "test_user", "password": "123"},
            format="json"
        )

        # Token
        token = response.json()["token"]

        # Authorization credentials
        auth_headers = {
            "HTTP_AUTHORIZATION": "Token " + token
        }

        # Logout authentication
        response = self.client.post(
            reverse(views.logout),
            format="json",
            **auth_headers
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["message"], "Logged out successfully.")

        # Logout without token
        response = self.client.post(
            reverse(views.logout),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json()["detail"], "Authentication credentials were not provided.")

        # Logout with invalid token
        response = self.client.post(
            reverse(views.logout),
            format="json",
            **auth_headers
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json()["detail"], "Invalid token.")

    def test_validate(self):
        """
        Test cases for validation
        """
        
        # Create user
        User.objects.create_user(username="test_user", password="123")

        # Login
        response = self.client.post(
            reverse(views.login),
            {"username": "test_user", "password":"123"},
            format="json"
        )

        # Token
        token = response.json()["token"]

        # Authorization credentials
        auth_headers = {
            "HTTP_AUTHORIZATION": "Token " + token
        }

        # Validate authentication
        response = self.client.get(
            reverse(views.validate),
            format="json",
            **auth_headers
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["message"], "You have passed the authentication test!")

        # Logout
        response = self.client.post(
            reverse(views.logout),
            format="json",
            **auth_headers
        )

        # Validate with invalid token.
        response = self.client.get(
            reverse(views.validate),
            format="json",
            **auth_headers
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json()["detail"], "Invalid token.")

    def test_delete(self):
        """
        Test cases for account deletion
        """
        
        # Create user
        User.objects.create_user(username="test_user", password="123")

        # Login user
        response = self.client.post(
            reverse(views.login),
            {"username": "test_user", "password": "123"},
            format="json"
        )

        # Token
        token = response.json()["token"]

        # Authorization credentials
        auth_headers = {
            "HTTP_AUTHORIZATION": "Token " + token
        }

        # Delete authentication
        response = self.client.post(
            reverse(views.delete),
            format="json",
            **auth_headers
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["message"], "Account has been deleted.")

        # Delete with invalid token
        response = self.client.post(
            reverse(views.delete),
            format="json",
            **auth_headers
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json()["detail"], "Invalid token.")

        # Delete without token
        response = self.client.post(
            reverse(views.delete),
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json()["detail"], "Authentication credentials were not provided.")
