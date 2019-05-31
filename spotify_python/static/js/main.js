const info = document.querySelector('.info')
const player = document.querySelector('.player')
const playerInfo = document.querySelector('.player_info')
const backDiv = document.querySelector('.back_div')
const token = getToken()
const mainContainer = document.querySelector('.main_container')

function getToken () {
  var str = window.location.hash
  var vars = str.split('&')
  var key = {}
  for (let i = 0; i < vars.length; i++) {
    var tmp = vars[i].split('=')
    key[tmp[0]] = tmp[1]
    return key['#access_token']
  }
}

function badToken () {
  window.location.replace('http://127.0.0.1:8000/login/')
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
      info.appendChild(userInfo)
      info.appendChild(userImg)
      userInfo.innerText = `Welcome ${response.display_name}`
      userImg.className = `userImg`
      userImg.innerHTML = `<img src=${response.images[0].url}>`
      let userId = response.id
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
    data: {
      'limit': '50'
    },
    success: function (response) {
      for (let playlist of response.items) {
        let playlistData = document.createElement('div')
        playlistData.className = `playlistData ${playlist.id}`
        mainContainer.appendChild(playlistData)
        let playlistArt = document.createElement('div')
        playlistArt.className = 'playlistImg'
        playlistData.appendChild(playlistArt)
        playlistArt.innerHTML = `<img src=${playlist.images[0].url}>`
        let playlistId = playlist.id
        let playlistName = playlist.name
        playlistData.addEventListener('click', function () {
          getPlaylistTracks(token, playlistId, playlistName)
        })
      }
    }
  })
}

function getPlaylistTracks (token, playlistId, playlistName) {
  $.ajax({
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    data: {
      'limit': '100'
    },
    success: function (response) {
      mainContainer.innerHTML = ''
      backDiv.innerHTML = `<input type="button" class='back_button' value="Back" onClick="document.location.reload(true)">`
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto'
      })
      info.innerHTML = ''
      info.innerHTML = `<h1>${playlistName}</h1>`
      for (let track of response.items) {
        let playlistTrack = document.createElement('div')
        let trackId = track.track.id
        playlistTrack.innerHTML = `<img src=${track.track.album.images[1].url}>`
        mainContainer.appendChild(playlistTrack)
        playlistTrack.addEventListener('click', function () {
          getTrackInfo(token, trackId)
          player.innerHTML = `<iframe src="https://open.spotify.com/embed/track/${trackId}" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
          window.scroll({
            top: 150,
            left: 0,
            behavior: 'smooth'
          })
        })
      }
    }
  })
}

function getTrackInfo (token, trackId) {
  $.ajax({
    url: `https://api.spotify.com/v1/audio-features/${trackId}`,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      console.log(response)
      playerInfo.innerHTML = `<p>Danceability: ${response.danceability}</p>
                              <p>Energy: ${response.energy}</p>`
    }
  })
}

document.addEventListener('DOMContentLoaded', function () {
  if (window.location.pathname === '/home/') {
    if (token) {
      getUser(token)
    } else {
      window.location.pathname = '/login/'
    }
  }
})
