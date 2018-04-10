'use strict';

(function () {
    var animateLetters = function (tag) {
        var element = document.getElementById(tag);

        for (var e, i = element.innerHTML.replace("&amp;", "&").split(""), a = "", o = 0, s = i.length; s > o; o++) {
            e = i[o].replace("&", "&amp");
            a += e.trim() ? '<span class="letter-' + o + '">' + e + "</span>" : "&nbsp;";
        }

        element.innerHTML = a;

        setTimeout( function () {
            element.className = 'transition-in';
        }, 500 * Math.random() + 500 );
    }

    window.onload = function() {
        animateLetters('h1');
    };
}());
