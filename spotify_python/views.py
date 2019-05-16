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
    results = sp.search(q='artist: black sabbath', type='artist')
    data = results['artists']
    items = data['items']

    context = {
        'results': results,
        'data': data,
        'items': items,
    }

    return render(request, 'index.html', context=context)
