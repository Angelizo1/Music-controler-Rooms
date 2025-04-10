from django.urls import path
from .views import CreateRoomView, get_data, RoomView

urlpatterns = [
    path('data/', get_data),
    path('room', RoomView.as_view()),
    path('create-room/',CreateRoomView.as_view(), name="create-room")
]