from django.shortcuts import render
from spotipy.oauth2 import SpotifyClientCredentials
from decouple import config
import spotipy
# from spotipy import Spotify
import urllib.parse
from django.shortcuts import redirect
# import spotipy.util as util
from . import util
import requests

sp = spotipy.Spotify()

def index(request):

    redirect_uri = urllib.parse.quote(config('redirect_url'))
    implicit_url = f'''https://accounts.spotify.com/authorize?client_id={config('client_id')}&redirect_uri={redirect_uri}&scope=user-read-private&response_type=token'''

    # token = requests.get(implicit_url)
    token = request.POST.get('url')

    if request.method == 'POST':
        artists = ''
        # name = request.POST.get('artist_search', None)
        # artists = sp.search(q='artist:' + name, type='artist')['artists']['items']
    
    else:
        artists = ''
        
    context = {
        'artists': artists,
        'token': token,
    }

    return render(request, 'index.html', context=context)

def artist_albums(request, artist_id):

    albums = sp.artist_albums(artist_id=artist_id, album_type='album')['items']
    artist_top_tracks = sp.artist_top_tracks(artist_id=artist_id, country='US')['tracks']

    context = {
        'albums': albums,
        'artist_top_tracks': artist_top_tracks,
    }

    return render(request, 'albums.html', context=context)

def album_tracks(request, album_id):

    tracks = sp.album_tracks(album_id=album_id)['items']

    for track in tracks:
        track_features_dict = sp.audio_features(tracks=track['id'])
        track.update(track_features_dict[0])

    context = {
        'tracks': tracks,
    }

    return render(request, 'tracks.html', context=context)

def login(request):

    if request.method == 'POST':
        redirect_uri = urllib.parse.quote(config('redirect_url'))
        implicit_url = f'''https://accounts.spotify.com/authorize?client_id={config('client_id')}&redirect_uri={redirect_uri}&scope=user-read-private&response_type=token'''
        return redirect(implicit_url)

    return render(request, 'login.html')
