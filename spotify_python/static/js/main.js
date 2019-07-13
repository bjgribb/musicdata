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
      // let userImg = document.createElement('div')
      info.appendChild(userInfo)
      // info.appendChild(userImg)
      if (response.display_name === null) {
        userInfo.innerText = `Welcome ${response.id}`
      } else {
        userInfo.innerText = `Welcome ${response.display_name}`
      }
      // userImg.className = `userImg`
      // if (response.images.length > 0) {
      //   userImg.innerHTML = `<img src=${response.images[0].url}>`
      // }
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
        playlistData.className = `playlistData`
        mainContainer.appendChild(playlistData)
        let playlistDataFlipper = document.createElement('div')
        playlistDataFlipper.className = 'flipper'
        playlistData.appendChild(playlistDataFlipper)
        let playlistDataFront = document.createElement('div')
        playlistDataFront.className = 'front'
        playlistDataFlipper.appendChild(playlistDataFront)
        playlistDataFront.innerHTML = `<img src=${playlist.images[0].url}>`
        let playlistDataBack = document.createElement('div')
        playlistDataBack.className = 'back'
        playlistDataBack.innerHTML = `<p>${playlist.name}</p>`
        playlistDataFlipper.appendChild(playlistDataBack)
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
      backDiv.innerHTML = `<div class='back_button' onClick="document.location.reload(true)">Back</div>`
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto'
      })
      info.innerHTML = ''
      info.innerHTML = `<h1>${playlistName}</h1>`
      for (let track of response.items) {
        console.log(track)
        let playlistData = document.createElement('div')
        playlistData.className = `playlistData`
        mainContainer.appendChild(playlistData)
        let playlistDataFlipper = document.createElement('div')
        playlistDataFlipper.className = 'flipper'
        playlistData.appendChild(playlistDataFlipper)
        let playlistDataFront = document.createElement('div')
        playlistDataFront.className = 'front'
        playlistDataFlipper.appendChild(playlistDataFront)
        playlistDataFront.innerHTML = `<img src=${track.track.album.images[1].url}>`
        let playlistDataBack = document.createElement('div')
        playlistDataBack.className = 'back'
        playlistDataBack.innerHTML = `<p>${track.track.name}</p>
                                      <p>${track.track.artists[0].name}</p>`
        playlistDataFlipper.appendChild(playlistDataBack)
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
      playerInfo.innerHTML =
      `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
          Launch demo modal
        </button>
    
      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ...
            </div>
          </div>
        </div>
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
