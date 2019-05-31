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

    return render(request, 'index.html')

def login(request):

    if request.method == 'POST':
        redirect_uri = urllib.parse.quote(config('redirect_url'))
        implicit_url = f'''https://accounts.spotify.com/authorize?client_id={config('client_id')}&redirect_uri={redirect_uri}&scope=playlist-read-private%20playlist-read-collaborative&response_type=token'''
        return redirect(implicit_url)

    return render(request, 'login.html')
