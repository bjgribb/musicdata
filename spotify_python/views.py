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

    else:
        artists = ''
        # artist_data = artists['artists']
        # items = artist_data['items']

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

    albums = sp.artist_albums(artist_id=artist_id, album_type='album')['items']
    artist_top_tracks = sp.artist_top_tracks(artist_id=artist_id, country='US')['tracks']

    context = {
        'albums': albums,
        'artist_top_tracks': artist_top_tracks,
    }

    return render(request, 'albums.html', context=context)
