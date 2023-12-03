from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('backend_users.urls')),
    path('quizzer/', include('backend_quizzer.urls'))
]
