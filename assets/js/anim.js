'use strict';

function animateLetters(tag) {
    for ( var e, n = document.getElementById( tag ), i = n.innerHTML.replace( "&amp;", "&" ).split( "" ), a = "", o = 0, s = i.length; s > o; o++ ) {
        e = i[ o ].replace( "&", "&amp" );
        a += e.trim() ? '<span class="letter-' + o + '">' + e + "</span>" : "&nbsp;";
    }

    n.innerHTML = a;

    setTimeout( function () {
        n.className = "transition-in";
    }, 500 * Math.random() + 500 );
}

window.onload = function() {
    animateLetters("h1");
};
