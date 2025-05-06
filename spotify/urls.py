from django.urls import path
from .views import AuthURL, CurrentSong, PauseSong, PlaySong, SpotifyCallback, IsAuthenticated, SkipSong

urlpatterns = [
  path('get-auth-url', AuthURL.as_view()),
  path('redirect', SpotifyCallback.as_view()),
  path('is_authenticated', IsAuthenticated.as_view()),
  path('current-song', CurrentSong.as_view()),
  path('pause-song', PauseSong.as_view()),
  path('play-song', PlaySong.as_view()),
  path('skip-song', SkipSong.as_view())
]