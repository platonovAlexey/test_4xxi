'use strict';

var buttonShare = document.querySelector(".button__share");
var popupShare = document.querySelector(".share__popup");
var closeShare = document.querySelector(".close__share__popup");
var body = document.querySelector("body");
var bodyOpen = document.getElementById("body__open__popup");

    buttonShare.addEventListener("click", function(event) {
    	event.preventDefault();

    	console.log("клик по ссылке");
    	popupShare.classList.add("share__popup__show");
        bodyOpen.style.display = "block";
    }, false);

    closeShare.addEventListener("click", function(event) {
    	event.preventDefault();
    	popupShare.classList.remove("share__popup__show");
        bodyOpen.style.display = "none";
    }, false);
