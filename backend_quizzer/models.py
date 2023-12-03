from django.db import models


class QuizFile(models.Model):
    creator = models.ForeignKey("backend_users.User", on_delete=models.CASCADE, related_name="created_quizzes")
    users = models.ManyToManyField("backend_users.User", related_name="quizzes")
    dt = models.DateTimeField(auto_now_add=True, blank=True)
    file = models.FileField(upload_to="quiz_uploads/")

    def __str__(self):
        return f"Quiz {self.pk}; Created by: {self.creator.username} on {self.dt}"
