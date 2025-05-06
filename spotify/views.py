from lib2to3.pgen2 import token
from os import access
from telnetlib import STATUS
from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from urllib.parse import urlencode
from django.http import JsonResponse
from .util import update_or_create_user_tokens, is_spotify_authenticated, execute_spotify_api_request, play_song, pause_song
import requests
from rest_framework.response import Response
from api.models import Room


class AuthURL(APIView):
    def get(self, request):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        room_code = request.GET.get('roomCode')
        url = 'https://accounts.spotify.com/authorize?' + urlencode({
            'response_type': 'code',
            'client_id': CLIENT_ID,
            'scope': scopes,
            'redirect_uri': REDIRECT_URI,
            'state': room_code
        })
        return JsonResponse({'url': url}, status=status.HTTP_200_OK)


class SpotifyCallback(APIView):
    def get(self, request):
        code = request.GET.get('code')
        room_code = request.GET.get('state')
        response = requests.post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
        })

        response_data = response.json()
        # Store access_token and refresh_token securely (session/db)
        access_token = response_data.get('access_token')
        refresh_token = response_data.get('refresh_token')
        token_type = response_data.get('token_type')
        expires_in = response_data.get('expires_in')
        error = response_data.get('error')

        if not request.session.exists(request.session.session_key):
            request.session.create()

        update_or_create_user_tokens(
            request.session.session_key, access_token, token_type, expires_in, refresh_token)

        return redirect(f"http://localhost:5173/room/{room_code}")  # review


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)
        if 'error' is response or 'item'not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')
        song_name = item.get('name')

        artists_string = ""

        # this is just to get the name of the singer
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artists_string += ", "
            name = artist.get("name")
            artists_string += name

        song = {
            "title": song_name,
            "artist": artists_string,
            "duration": duration,
            "time": progress,
            "image_url": album_cover,
            "is_playing": is_playing,
            "votes": 0,
            "id": song_id
        }

        return Response(song, status=status.HTTP_200_OK)


class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.get(code=room_code)
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.get(code=room_code)                #get returns just one, filter returns many
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)

class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.get(code=room_code)

        if self.request.session.session_key == room.host:
            skip_song(room.host)
        else:
            pass
        return Response({}, status.HTTP_204_NO_CONTENT)