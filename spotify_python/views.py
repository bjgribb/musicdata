from django.shortcuts import render

# Create your views here.
import spotipy


def index(request):

    spotify = spotipy.Spotify()
    results = spotify.search(q='artist: gideon', type='artist')

    context = {
        'results': results,
    }

    return render(request, 'index.html', context=context)
