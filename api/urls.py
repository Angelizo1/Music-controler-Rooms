from django.urls import path
from .views import CreateRoomView, JoinRoom, LeaveRoom, UpdateRoom, get_data, RoomView, GetRoom, UserInRoom

urlpatterns = [
    path('data/', get_data),
    path('room', RoomView.as_view()),
    path('create-room/', CreateRoomView.as_view(), name="create-room"),
    path('get-room', GetRoom.as_view()),
    path('join-room/', JoinRoom.as_view()),
    path('user-in-room/', UserInRoom.as_view()),
    path('leave-room/', LeaveRoom.as_view()),
    path('update-room/', UpdateRoom.as_view())
]
