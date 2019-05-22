button = document.querySelector('.js_check')
loginButton = document.querySelector('.login')

function check() {
    button.addEventListener('click', function() {
        console.log(window.location.hash)
    })
}

function login () {
    
}

var str = window.location.hash
var vars = str.split('&');
var key = {};
for (i=0; i<vars.length; i++) {
  var tmp = vars[i].split('=');
  key[tmp[0]] = tmp[1];
} 
token = key['#access_token']

$.ajax({
    url: 'https://api.spotify.com/v1/me',
    headers: {
        'Authorization': 'Bearer ' + token
    },
    success: function(response) {
        console.log(response)
    }
})

// document.addEventListener('DOMContentLoaded', function() {
//     check()
// })

