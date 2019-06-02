const info = document.querySelector('.info')
const player = document.querySelector('.player')
const playerInfo = document.querySelector('.player_info')
const backDiv = document.querySelector('.back_div')
const token = getToken()
const mainContainer = document.querySelector('.main_container')
const danceabilityModal = document.querySelector('.danceability_modal')
const energyModal = document.querySelector('.energy_modal')
const acousticnessModal = document.querySelector('.acousticness_modal')

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
      let userInfo = document.createElement('div')
      let userImg = document.createElement('div')
      info.appendChild(userInfo)
      info.appendChild(userImg)
      if (response.display_name === null) {
        userInfo.innerText = `Welcome ${response.id}`
      } else {
        userInfo.innerText = `Welcome ${response.display_name}`
      }
      userImg.className = `userImg`
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
      playerInfo.innerHTML = `<div class='danceability_info'>Danceability: ${response.danceability}
                              </div>
                              <div class='energy_info'>Energy: ${response.energy}
                              </div>
                              <div class='acousticness_info'>Acousticness: ${response.acousticness}
                              </div>`
      let danceabilityInfo = document.querySelector('.danceability_info')
      let energyInfo = document.querySelector('.energy_info')
      let acousticnessInfo = document.querySelector('.acousticness_info')
      let span = document.getElementsByClassName('close')[0]
      danceabilityInfo.addEventListener('click', function () {
        danceabilityModal.style.display = 'block'
      })
      energyInfo.addEventListener('click', function () {
        energyModal.style.display = 'block'
      })
      acousticnessInfo.addEventListener('click', function () {
        acousticnessModal.style.display = 'block'
      })
      span.onclick = function () {
        danceabilityModal.style.display = 'none'
        energyModal.style.display = 'none'
        acousticnessModal.style.display = 'none'
      }
      window.onclick = function (event) {
        if (event.target === energyModal) {
          energyModal.style.display = 'none'
        } else {
          if (event.target === danceabilityModal) {
            danceabilityModal.style.display = 'none'
          } else {
            if (event.target === acousticnessModal) {
              acousticnessModal.style.display = 'none'
            }
          }
        }
      }
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
