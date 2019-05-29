button = document.querySelector('.js_check')
loginButton = document.querySelector('.login')
user = document.querySelector('.user')
mainContainer = document.querySelector('.main_container')

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
        let playlistData = document.createElement('div')
        playlistData.className = 'playlistData'
        mainContainer.appendChild(playlistData)
        let playlistArt = document.createElement('div')
        playlistArt.className = 'playlistImg'
        playlistData.appendChild(playlistArt)
        playlistArt.innerHTML = `<img src=${playlist.images[0].url}>`
        playlistId = playlist.id
        $.ajax({
          url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          success: function (response) {
            let playlistTracks = document.createElement('div')
            playlistData.appendChild(playlistTracks)
            playlistTracks.className = 'playlistTracks'
            for (let tracks of response.items) {
              console.log(tracks)
            }
          }
        })
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', function () {
  getToken()
  getUser(token)
})
