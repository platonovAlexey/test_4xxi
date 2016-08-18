'use strict';

var popupHeader = document.querySelector('.header__popup');
var close = document.querySelector('.close__popup');

close.addEventListener("click", function(event) {
	event.preventDefault();
    console.log('click');
	popupHeader.classList.add('popup__hide');
}, false);
