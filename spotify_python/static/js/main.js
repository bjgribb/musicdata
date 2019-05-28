button = document.querySelector('.js_check')
loginButton = document.querySelector('.login')
user = document.querySelector('.user')
mainContainer = document.querySelector('.main_container')
searchValue = document.querySelector('.search_value')
searchInput = searchValue.value

function getToken () {
  var str = window.location.hash
  var vars = str.split('&')
  var key = {}
  for (i = 0; i < vars.length; i++) {
    var tmp = vars[i].split('=')
    key[tmp[0]] = tmp[1]
  }
  token = key['#access_token']
  return token
}

function getUser (token) {
  $.ajax({
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      let userInfo = document.createElement('div')
      let userImg = document.createElement('div')
      user.appendChild(userInfo)
      user.appendChild(userImg)
      userInfo.innerText = `Welcome ${response.display_name}`
      userImg.className = `userImg`
      userImg.innerHTML = `<img src=${response.images[0].url}>`
      userId = response.id
      getUserPlaylists(token, userId)
    }
  })
}

function getUserPlaylists (token, userId) {
  $.ajax({
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      for (let playlist of response.items) {
        console.log(playlist)
        let playlistName = document.createElement('div')
        mainContainer.appendChild(playlistName)
        playlistName.innerText = playlist.name
        let playlistArt = document.createElement('div')
        playlistArt.className = 'playlistImg'
        playlistName.appendChild(playlistArt)
        playlistArt.innerHTML = `<img src=${playlist.images[0].url}>`
      }
    }
  })
}

// function getPlaylistTracks (token)
//     https://api.spotify.com/v1/playlists/{playlist_id}/tracks

document.addEventListener('DOMContentLoaded', function () {
  getToken()
  getUser(token)
  // getUserPlaylists(token, userId)
})
