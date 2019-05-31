const user = document.querySelector('.user')
const player = document.querySelector('.player')
const playerInfo = document.querySelector('.player_info')
let mainContainer = document.querySelector('.main_container')
var token = getToken()

function getToken () {
  var str = window.location.hash
  var vars = str.split('&')
  var key = {}
  for (let i = 0; i < vars.length; i++) {
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
        playlistData.addEventListener('click', function () {
          getPlaylistTracks(token, playlistId)
        })
      }
    }
  })
}

function getPlaylistTracks (token, playlistId) {
  $.ajax({
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      mainContainer.innerHTML = ''
      for (let track of response.items) {
        console.log(track)
        let playlistTrack = document.createElement('div')
        let trackId = track.track.id
        playlistTrack.innerHTML = `<img src=${track.track.album.images[1].url}>`
        mainContainer.appendChild(playlistTrack)
        playlistTrack.addEventListener('click', function () {
          getTrackInfo(token, trackId)
          player.innerHTML = `<iframe src="https://open.spotify.com/embed/track/${trackId}" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
          window.scroll({
            top: 0,
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
  getUser(token)
})
