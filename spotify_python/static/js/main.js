button = document.querySelector('.js_check')
loginButton = document.querySelector('.login')
user = document.querySelector('.user')

function check() {
    button.addEventListener('click', function() {
        console.log(window.location.hash)
    })
}

function getToken () {
    var str = window.location.hash
    var vars = str.split('&');
    var key = {};
    for (i=0; i<vars.length; i++) {
        var tmp = vars[i].split('=');
        key[tmp[0]] = tmp[1];
    } 
    token = key['#access_token']
    return token
}

// $.ajax({
//     url: 'https://api.spotify.com/v1/me',
//     headers: {
//         'Authorization': 'Bearer ' + token
//     },
//     success: function(response) {
//         console.log(response)
//         user.innerText = response
//     }
// })

document.addEventListener('DOMContentLoaded', function() {
    getToken()
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(response) {
            console.log(response)
            let user_info = document.createElement('div')
            let user_img = document.createElement('div')
            user.appendChild(user_info)
            user.appendChild(user_img)
            user_info.innerText = `Welcome ${response.display_name}`
            user_img.className = `user_img`
            user_img.innerHTML = `<img src=${response.images[0].url}>`
        }
    })
})

