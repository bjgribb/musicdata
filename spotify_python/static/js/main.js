const userImg = document.querySelector('.user-img')
const userInfo = document.querySelector('.user-info')
const player = document.querySelector('.player')
const playerInfo = document.querySelector('.player_info')
const token = getToken()
const mainContainer = document.querySelector('.main_container')
const dropdownMenu = document.querySelector('.dropdown-menu')
const info = document.querySelector('.info')

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

function getUser (token) {
  $.ajax({
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      console.log(response)
      if (response.display_name === null) {
        userInfo.innerHTML = `<h4>Welcome ${response.id}</h4>
                              <h6>Email: ${response.email}</h6>
                              <h6>Country: ${response.country}</h6>
                              <h6>Followers: ${response.followers.total}</h6>`
      } else {
        userInfo.innerHTML = `<h4>Welcome ${response.display_name}</h4>
                              <h6>Email: ${response.email}</h6>
                              <h6>Country: ${response.country}</h6>
                              <h6>Followers: ${response.followers.total}</h6>`
      }
      if (response.images.length > 0) {
        userImg.innerHTML = `<img src=${response.images[0].url}>`
      }
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
        let dropdownItem = document.createElement('p')
        dropdownItem.innerHTML = `<a class="dropdown-item" href="#">${playlist.name}</a>`
        dropdownMenu.appendChild(dropdownItem)
        let playlistId = playlist.id
        let playlistName = playlist.name
        dropdownItem.addEventListener('click', function () {
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
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto'
      })
      info.innerHTML = ''
      info.innerHTML = `<h1>${playlistName}</h1>`
      for (let track of response.items) {
        let playlistData = document.createElement('div')
        playlistData.className = `playlistData`
        mainContainer.appendChild(playlistData)
        playlistData.innerHTML = `<img src=${track.track.album.images[1].url}>`
        let trackId = track.track.id
        playlistData.addEventListener('click', function () {
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
      playerInfo.innerHTML =
      `<div class="btn-group row" role="group" aria-label="track info button groups">
        <button type="button" class="btn" data-toggle="modal" data-target="#danceabilityModal">
            Dance: ${response.danceability}
          </button>
          <button type="button" class="btn" data-toggle="modal" data-target="#energyModal">
            Energy: ${response.energy}
          </button>
          <button type="button" class="btn" data-toggle="modal" data-target="#acousticModal">
            Acoustic: ${response.acousticness}
          </button>
          <button type="button" class="btn" data-toggle="modal" data-target="#instrumentModal">
            Instrumental: ${response.instrumentalness}
          </button>
          <button type="button" class="btn" data-toggle="modal" data-target="#livenessModal">
            Live: ${response.liveness}
          </button>
          <button type="button" class="btn" data-toggle="modal" data-target="#loudnessModal">
            Loud: ${response.loudness}
          </button>
          <button type="button" class="btn" data-toggle="modal" data-target="#acousticModal">
            Speech: ${response.speechiness}
          </button>
          <button type="button" class="btn" data-toggle="modal" data-target="#acousticModal">
            Tempo: ${response.tempo}
          </button>
          <button type="button" class="btn" data-toggle="modal" data-target="#acousticModal">
            Valence: ${response.valence}
          </button>
      </div>`
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
