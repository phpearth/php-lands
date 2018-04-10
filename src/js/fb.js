document.getElementById('fbShareBtn').onclick = function() {
    FB.ui({
        method: 'share',
        display: 'popup',
        href: 'https://lands.php.earth/',
    }, function(response){});
}
