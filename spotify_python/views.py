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
        username = request.POST.get('login', None)
        redirect_uri = urllib.parse.quote(config('redirect_url'))
        implicit_url = f'''https://accounts.spotify.com/authorize?client_id={config('client_id')}&redirect_uri={redirect_uri}&scope=user-read-private&response_type=token'''
        return redirect(implicit_url)

    else:
        username = ''

    # token = util.prompt_for_user_token(username, scope, client_id=config('client_id'), client_secret=config('client_secret'), redirect_uri=config('redirect_url'))
    return render(request, 'login.html')

{
    'Server': 'nginx', 
    'Date': 'Tue, 21 May 2019 19:37:40 GMT', 
    'Content-Type': 'text/html;charset=utf-8', 
    'Transfer-Encoding': 'chunked', 
    'Connection': 'keep-alive', 
    'Keep-Alive': 'timeout=600', 
    'Vary': 'Accept-Encoding', 
    'X-UA-Compatible': 'IE=edge', 
    'Cache-Control': 'no-cache, no-store, must-revalidate', 
    'Pragma': 'no-cache', 
    'X-Frame-Options': 'deny', 
    'Content-Security-Policy': "default-src 'self'; script-src 'self' https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://accounts.scdn.co; img-src 'self' https://i.imgur.com https://d2mv8tnci56s9d.cloudfront.net https://profile-images.scdn.co https://aci.scdn.co https://graph.facebook.com https://fbcdn-profile-a.akamaihd.net https://scontent.xx.fbcdn.net https://platform-lookaside.fbsbx.com https://www.google-analytics.com https://stats.g.doubleclick.net data: https://accounts.scdn.co; font-src 'self' https://sp-bootstrap.global.ssl.fastly.net https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://accounts.scdn.co; frame-src 'self' https://www.spotify.com https://www.google.com https://app.adjust.com https://itunes.apple.com itms-apps:;", 
    'X-Content-Security-Policy': "default-src 'self'; script-src 'self' https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://accounts.scdn.co; img-src 'self' https://i.imgur.com https://d2mv8tnci56s9d.cloudfront.net https://profile-images.scdn.co https://aci.scdn.co https://graph.facebook.com https://fbcdn-profile-a.akamaihd.net https://scontent.xx.fbcdn.net https://platform-lookaside.fbsbx.com https://www.google-analytics.com https://stats.g.doubleclick.net data: https://accounts.scdn.co; font-src 'self' https://sp-bootstrap.global.ssl.fastly.net https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://accounts.scdn.co; frame-src 'self' https://www.spotify.com https://www.google.com https://app.adjust.com https://itunes.apple.com itms-apps:;", 
    'Set-Cookie': 'csrf_token=AQCFeVoJlR2eZ7-FSVmXyZiud9eFi7h8jr38spHirh-f1_3-o9fB3CPhsOkD3fq4U_uu7DwvFgMp1Np6;Version=1;Domain=accounts.spotify.com;Path=/;Secure', 'X-Content-Type-Options': 'nosniff', 'Strict-Transport-Security': 'max-age=31536000', 'Content-Encoding': 'gzip'}