import urllib.parse
from django.shortcuts import render
from decouple import config
from django.shortcuts import redirect

def index(request):

    return render(request, 'index.html')

def login(request):

    if request.method == 'POST':
        redirect_uri = urllib.parse.quote(config('redirect_url'))
        implicit_url = f'''https://accounts.spotify.com/authorize?client_id={config('client_id')}&redirect_uri={redirect_uri}&scope=playlist-read-private%20playlist-read-collaborative%20user-top-read&response_type=token'''
        return redirect(implicit_url)

    return render(request, 'login.html')
