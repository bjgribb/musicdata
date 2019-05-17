from django.shortcuts import render
from spotipy.oauth2 import SpotifyClientCredentials
from decouple import config
import spotipy
import spotipy.util as util


def index(request):

    # token = util.prompt_for_user_token(
    #     username='bjgribb',
    #     scope='user-library-read',
    #     client_id='5c5b7d2ab31f46098b0cc77951806d44',
    #     client_secret='664eeae377614f208cebf8d8203c3eca',
    #     redirect_uri='http://127.0.0.1:8000/home/')

    # spotify = spotipy.Spotify(auth=token)

    client_credentials_manager = SpotifyClientCredentials(client_id=config('client_id'), client_secret=config('client_secret'))
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    if request.method == 'POST':
        name = request.POST.get('artist_search', None)
        artists = sp.search(q='artist:' + name, type='artist')['artists']['items']
        # artist_data = artists['artists']['items']
        # items = artist_data['items']

    else:
        artists = sp.search(q='artist:', type='artist')['artists']['items']
        # artist_data = artists['artists']
        # items = artist_data['items']

    context = {
        'artists': artists,
    }

    return render(request, 'index.html', context=context)

def artist_albums(request, artist_id):
    client_credentials_manager = SpotifyClientCredentials(client_id=config('client_id'), client_secret=config('client_secret'))
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    albums = sp.artist_albums(artist_id=artist_id, album_type='album')['items']
    artist_top_tracks = sp.artist_top_tracks(artist_id=artist_id, country='US')['tracks']

    context = {
        'albums': albums,
        'artist_top_tracks': artist_top_tracks,
    }

    return render(request, 'albums.html', context=context)
