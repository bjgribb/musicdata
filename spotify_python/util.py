from __future__ import print_function
import os
from . import oauth2
from decouple import config
from django.shortcuts import redirect
import spotipy
import urllib.parse
import requests


def prompt_for_user_token(username, scope=None, client_id = None,
        client_secret = None, redirect_uri = None, cache_path = None):
    ''' prompts the user to login if necessary and returns
        the user token suitable for use with the spotipy.Spotify 
        constructor
        Parameters:
         - username - the Spotify username
         - scope - the desired scope of the request
         - client_id - the client id of your app
         - client_secret - the client secret of your app
         - redirect_uri - the redirect URI of your app
         - cache_path - path to location to save tokens
    '''

    if not client_id:
        client_id = os.getenv('SPOTIPY_CLIENT_ID')

    if not client_secret:
        client_secret = os.getenv('SPOTIPY_CLIENT_SECRET')

    if not redirect_uri:
        redirect_uri = os.getenv('SPOTIPY_REDIRECT_URI')

    if not client_id:
        print('''
            You need to set your Spotify API credentials. You can do this by
            setting environment variables like so:
            export SPOTIPY_CLIENT_ID='your-spotify-client-id'
            export SPOTIPY_CLIENT_SECRET='your-spotify-client-secret'
            export SPOTIPY_REDIRECT_URI='your-app-redirect-url'
            Get your credentials at     
                https://developer.spotify.com/my-applications
        ''')
        raise spotipy.SpotifyException(550, -1, 'no credentials set')

    cache_path = cache_path or ".cache-" + username
    sp_oauth = oauth2.SpotifyOAuth(client_id, client_secret, redirect_uri, 
        scope=scope, cache_path=cache_path)

    # try to get a valid token for this user, from the cache,
    # if not in the cache, the create a new (this will send
    # the user to a web page where they can authorize this app)

    token_info = sp_oauth.get_cached_token()

    if not token_info:
        print('''
            USER authentication requires interaction with your
            web browser. Once you enter your credentials and
            give authorization, you will be redirected to
            a url.  Paste that url you were directed to to
            complete the authorization.
        ''')
        auth_url = sp_oauth.get_authorize_url()
        redirect_uri = urllib.parse.quote(config('redirect_url'))

        implicit_url = f'''https://accounts.spotify.com/authorize?client_id={config('client_id')}&redirect_uri={redirect_uri}&scope=user-read-private&response_type=token'''
        print(implicit_url)

        try:
            import webbrowser
            webbrowser.open(implicit_url)
            print("Opened %s in your browser" % auth_url)
        except NameError:
            print("Please navigate here: %s" % auth_url)

        print()
        print()
        try:
            response = raw_input("Brian enter the URL you were redirected to: ")
        except NameError:
            response = input("Brian enter the URL you were redirected to: ")

        print()
        print() 

        token_info = sp_oauth.parse_response_code(response)

    # Auth'ed API request
    if token_info:
        return token_info
