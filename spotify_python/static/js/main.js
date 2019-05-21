button = document.querySelector('.js_check')

function check() {
    button.addEventListener('click', function() {
        console.log(window.location.hash)
    })
}

document.addEventListener('DOMContentLoaded', function() {
    check()
})