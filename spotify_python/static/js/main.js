const info = document.querySelector('.info')
const player = document.querySelector('.player')
const playerInfo = document.querySelector('.player_info')
const backDiv = document.querySelector('.back_div')
const topArtists = document.querySelector('.top_artists')
const token = getToken()
const mainContainer = document.querySelector('.main_container')
const danceabilityModal = document.querySelector('.danceability_modal')
const energyModal = document.querySelector('.energy_modal')
const acousticnessModal = document.querySelector('.acousticness_modal')
let trackInfoList = []
let trackInfoListDance = trackInfoList.sort((a, b) => (a.danceability > b.danceability) ? -1 : 1)

// Functions to create divs for data
function createPlaylistData () {
  let playlistData = document.createElement('div')
  playlistData.className = 'playlistData'
  mainContainer.appendChild(playlistData)
  return playlistData
}

function createDataFlipper (playlistData) {
  let playlistDataFlipper = document.createElement('div')
  playlistDataFlipper.className = 'flipper'
  playlistData.appendChild(playlistDataFlipper)
  return playlistDataFlipper
}

function createFlipperFront (playlistDataFlipper) {
  let playlistDataFront = document.createElement('div')
  playlistDataFront.className = 'front'
  playlistDataFlipper.appendChild(playlistDataFront)
  return playlistDataFront
}

function createFlipperBack (playlistDataFlipper) {
  let playlistDataBack = document.createElement('div')
  playlistDataBack.className = 'back'
  playlistDataFlipper.appendChild(playlistDataBack)
  return playlistDataBack
}

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

// Spotify AJAX request functions
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
      getUserTopArtists(token)
    }
  })
}

function getUserTopArtists (token) {
  $.ajax({
    url: 'https://api.spotify.com/v1/me/top/artists',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      console.log(response.items)
      for (let artist of response.items) {
        let topArtistDiv = document.createElement('div')
        topArtistDiv.className = 'top_artist_divs'
        topArtists.appendChild(topArtistDiv)
        topArtistDiv.innerHTML = `<a href=${artist.href}>
                                  <img src=${artist.images[1].url}></a>`
      }
    }
  })
}

function getUserPlaylists (token, userId, playlistDataBack, playlistDataFront, playlistData) {
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
        let playlistData = createPlaylistData()
        let playlistDataFlipper = createDataFlipper(playlistData)
        let playlistDataFront = createFlipperFront(playlistDataFlipper)
        let playlistDataBack = createFlipperBack(playlistDataFlipper)
        let playlistId = playlist.id
        let playlistName = playlist.name
        playlistDataFront.innerHTML = `<img src=${playlist.images[0].url}>`
        playlistDataBack.innerHTML = `<p>${playlist.name}</p>`
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
      backDiv.innerHTML = `<div class='back_button' onClick="document.location.reload(true)">Back</div>`
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto'
      })
      info.innerHTML = ''
      info.innerHTML = `<h1>${playlistName}</h1>`
      for (let track of response.items) {
        let playlistData = createPlaylistData()
        let playlistDataFlipper = createDataFlipper(playlistData)
        let playlistDataFront = createFlipperFront(playlistDataFlipper)
        let playlistDataBack = createFlipperBack(playlistDataFlipper)
        let trackId = track.track.id
        getInfo(token, trackId)
        playlistDataFront.innerHTML = `<img src=${track.track.album.images[1].url}>`
        playlistDataBack.innerHTML = `<p>${track.track.name}</p>
                                      <p>${track.track.artists[0].name}</p>`
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

function getInfo (token, trackId) {
  $.ajax({
    url: `https://api.spotify.com/v1/audio-features/${trackId}`,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      trackInfoList.push(response)
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
      const danceabilityClose = document.querySelector('.danceability_close')
      const energyClose = document.querySelector('.energy_close')
      const acousticnessClose = document.querySelector('.acousticness_close')
      danceabilityInfo.addEventListener('click', function () {
        danceabilityModal.style.display = 'block'
      })
      energyInfo.addEventListener('click', function () {
        energyModal.style.display = 'block'
      })
      acousticnessInfo.addEventListener('click', function () {
        acousticnessModal.style.display = 'block'
      })
      danceabilityClose.onclick = function () {
        danceabilityModal.style.display = 'none'
      }
      energyClose.onclick = function () {
        energyModal.style.display = 'none'
      }
      acousticnessClose.onclick = function () {
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
