from django.shortcuts import render
from spotipy.oauth2 import SpotifyClientCredentials
from decouple import config
import spotipy
import spotipy.util as util


def index(request):

    if request.method == 'POST':
        scope = 'user-library-read'
        token = util.prompt_for_user_token('bjgribb', scope, client_id=config('client_id'), client_secret=config('client_secret'), redirect_uri=config('redirect_url'))

        if token:
            sp = spotipy.Spotify(auth=token)
            sp.trace = False    
            name = request.POST.get('artist_search', None)
            artists = sp.search(q='artist:' + name, type='artist')['artists']['items']
        
        else:
            print("Can't get token")

    # if request.method == 'POST':
    #     client_credentials_manager = SpotifyClientCredentials(client_id=config('client_id'), client_secret=config('client_secret'))
    #     sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    #     name = request.POST.get('artist_search', None)
    #     artists = sp.search(q='artist:' + name, type='artist')['artists']['items']

    else:
        artists = ''

    context = {
        'artists': artists,
    }

    return render(request, 'index.html', context=context)

def artist_albums(request, artist_id):
    scope = 'user-library-read'
    token = util.prompt_for_user_token('bjgribb', scope, client_id=config('client_id'), client_secret=config('client_secret'), redirect_uri=config('redirect_url'))

    if token:
        sp = spotipy.Spotify(auth=token)
        sp.trace = False    
    
    else:
        print("Can't get token")

    # client_credentials_manager = SpotifyClientCredentials(client_id=config('client_id'), client_secret=config('client_secret'))
    # sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    albums = sp.artist_albums(artist_id=artist_id, album_type='album')['items']
    artist_top_tracks = sp.artist_top_tracks(artist_id=artist_id, country='US')['tracks']

    context = {
        'albums': albums,
        'artist_top_tracks': artist_top_tracks,
    }

    return render(request, 'albums.html', context=context)

def album_tracks(request, album_id):

    client_credentials_manager = SpotifyClientCredentials(client_id=config('client_id'), client_secret=config('client_secret'))
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    tracks = sp.album_tracks(album_id=album_id)['items']

    for track in tracks:
        track_features_dict = sp.audio_features(tracks=track['id'])
        track.update(track_features_dict[0])

    context = {
        'tracks': tracks,
    }

    return render(request, 'tracks.html', context=context)
