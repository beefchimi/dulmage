document.addEventListener('DOMContentLoaded', function() {


	// Global Variables
	// ----------------------------------------------------------------------------

	// --- Objects and Initial Setup --- \\

	// common objects
	var elBody         = document.body,
		elMain         = document.getElementsByTagName('main')[0],
		elSections     = document.getElementsByTagName('section'),
		elIntroSection = document.getElementById('intro_dulmage'),
		elIntroArticle = document.getElementsByClassName('intro')[0],
		elPreloader    = document.getElementById('preloader'),
		elNavList      = document.getElementsByTagName('li'),
		elNavLinks     = document.getElementsByClassName('link_anchor'),
		navListCount   = elNavList.length;

	// possible homepage options
	var homeOptions = [
		{ title:'beach',    r:134, g:160, b:197 },
		{ title:'bridge',   r:110, g:145, b:110 },
		{ title:'flowers',  r:140, g:84,  b:193 },
		{ title:'forest',   r:189, g:187, b:56  },
		{ title:'thegut',   r:106, g:96,  b:25  },
		{ title:'tropical', r:186, g:64,  b:79  },
		{ title:'worship',  r:203, g:78,  b:74  }
	];

	// iOS version number
	// var iOSv = iOSversion();

	// randomly select a home option
	var randomMin    = 0,
		randomMax    = homeOptions.length - 1,
		randomOption = Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin;

	// color data for each section (first object is added as a random selection from homeOptions)
	var sectionData = [
		homeOptions[randomOption],
		{ title:'preserve',  r:255, g:195, b:12  },
		{ title:'bmc',       r:255, g:65,  b:0   },
		{ title:'na2014',    r:226, g:172, b:58  },
		{ title:'fringe',    r:255, g:90,  b:82  },
		{ title:'cfc',       r:192, g:106, b:30  },
		{ title:'na2012',    r:235, g:71,  b:71  },
		{ title:'pukeko',    r:55,  g:58,  b:134 },
		{ title:'artscourt', r:248, g:109, b:41  },
		{ title:'efc',       r:255, g:186, b:0   },
		{ title:'bryston',   r:57,  g:148, b:219 }
	];

	// --- Section and Data Variables --- \\

	// section data
	var sectionCount = elSections.length,
		sectionPrev,
		sectionCurrent,
		sectionNext,
		sectionWhileScrolling;

	// scroll, touch, and height variables
	var scrollPos,
		currentPercent,
		windowHeight,
		touchS,
		touchM,
		touchE,
		touchAll,
		touchID,
		isTouching = false;

	// --- Colour Variables --- \\

	// all RGB variables
	var beginR, beginG, beginB,
		endR, endG, endB,
		diffR, diffG, diffB,
		intSignR, intSignG, intSignB,
		calcR, calcG, calcB,
		updateR, updateG, updateB;

	// --- Image Preloader --- \\

	var imgLoader = new PxLoader(),
		imgPath   = 'assets/img/',
		imgHome   = imgPath + 'home-' + homeOptions[randomOption].title + '.png';

	// load home image based on homeOptions random selection
	imgLoader.addImage(imgHome);

	// only first half of images are preloaded
	imgLoader.addImage(imgPath + 'preserve.png');
	imgLoader.addImage(imgPath + 'bmc.png');
	imgLoader.addImage(imgPath + 'na2014.png');
	imgLoader.addImage(imgPath + 'fringe.png');
	imgLoader.addImage(imgPath + 'cfc.png');
	imgLoader.addImage(imgPath + 'na2012.png');
	// imgLoader.addImage(imgPath + 'pukeko.png');
	// imgLoader.addImage(imgPath + 'artscourt.png');
	// imgLoader.addImage(imgPath + 'efc.png');
	// imgLoader.addImage(imgPath + 'bryston.png');

	// callback that will be run once images are ready
	imgLoader.addCompletionListener(function() {

		// replace <body> 'loading' class with 'ready' in order to trigger css transitions / animations
		elBody.className = 'ready';

		// remove div.loader-icon from DOM after 4 seconds
		setTimeout(function() {
			elIntroArticle.removeChild(elPreloader);
		}, 4000);

	});

	// initialize the preloader
	imgLoader.start();


	// onPageLoad: Main Function To Fire on Window Load
	// ----------------------------------------------------------------------------
	function onPageLoad() {

		// get scroll position on load in case of anchor or refresh (do not assume 0)
		// we will likely scroll to document top on page load for preloader styles... but that could still fail in some cases
		scrollPos = window.pageYOffset;

		// get height of browser window on page load and resize events
		windowHeight = window.innerHeight;

		// set randomly selected homeOption as <section> background-image
		elIntroSection.style.backgroundImage = 'url(' + imgHome + ')';

		// apply windowHeight to each <section>...
		// only required because iOS shits the bed with 100vh height elements and orientation change
		for (var i = 0; i < sectionCount; i++) {
			elSections[i].style.height = windowHeight + 'px';
		}

		// get sectionCurrent on page load
		sectionCurrent = Math.floor(scrollPos / windowHeight);

		// set prev and next sections to be equal to sectionCurrent...
		// trackSection will immediately update these incorrect values
		sectionPrev = sectionCurrent;
		sectionNext = sectionCurrent;

		// initialize trackSection for the first time
		trackSection();

		// perform color math on page load
		colorMath();

	}


	// trackSection: Track Progression of Sections
	// ----------------------------------------------------------------------------
	function trackSection() {

		// determine new prev / next sections
		if (sectionCurrent <= 0) {

			sectionPrev = 0;
			sectionNext = sectionCurrent + 1;

		} else if ( sectionCurrent >= (sectionCount - 1) ) {

			sectionPrev = sectionCurrent - 1;
			sectionNext = sectionCurrent;

		} else {

			sectionPrev = sectionCurrent - 1;
			sectionNext = sectionCurrent + 1;

		}

		// remove "current" class from ALL nav items...
		// sectionPrev & sectionNext is unreliable and sometimes does not get removed in time (not fast enough)
		for (var i = 0; i < navListCount; i++) {
			elNavList[i].className = '';
		}

		// apply "current" class to the current nav item
		elNavList[sectionCurrent].className = 'current';

		// redefine begin RGB values based on new sectionCurrent
		beginR = sectionData[sectionCurrent].r;
		beginG = sectionData[sectionCurrent].g;
		beginB = sectionData[sectionCurrent].b;

		// redefine end RGB values based on new sectionNext
		endR = sectionData[sectionNext].r;
		endG = sectionData[sectionNext].g;
		endB = sectionData[sectionNext].b;

		// define difference of begin / end RGB values
		diffR = beginR - endR;
		diffG = beginG - endG;
		diffB = beginB - endB;

	}


	// updateColor: Update Background Color During Scroll
	// ----------------------------------------------------------------------------
	function updateColor() {

		// update scroll position as we scroll the window
		scrollPos = window.pageYOffset;

		// apply new values only if scrollPos is greater than 0...
		// this will prevent iOS rubber band scrolling from producing incorrect values
		if (scrollPos >= 0) {

			// check what section we are in while scrolling
			sectionWhileScrolling = Math.floor(scrollPos / windowHeight);

			// once sectionWhileScrolling no longer equals sectionCurrent,
			// we know we have crossed into new territory
			if (sectionCurrent != sectionWhileScrolling) {

				// assign sectionWhileScrolling as the new sectionCurrent
				sectionCurrent = sectionWhileScrolling;

				// run trackSection again to update section progression and RGB values
				trackSection();

			}

			colorMath();

		}

	}


	// colorMath: Calculate Background Colour Values
	// ----------------------------------------------------------------------------
	function colorMath() {

		// get current scroll percentage within section
		currentPercent = ( scrollPos - (sectionCurrent * windowHeight) ) / windowHeight * 100;

		// reverse the sign of this integer (positive or negative), required to do the math properly...
		// you can add a negative to a positive as if subtracting (10 + -4 = 6)
		intSignR = diffR > 0 ? '-' : '';
		intSignG = diffG > 0 ? '-' : '';
		intSignB = diffB > 0 ? '-' : '';

		// calculate the threshold we will (in/de)crease our RGB values by
		calcR = Math.abs( (diffR * currentPercent) / 100 );
		calcG = Math.abs( (diffG * currentPercent) / 100 );
		calcB = Math.abs( (diffB * currentPercent) / 100 );

		// update our RGB values by adding our calculated (in/de)crease values to the current (begin) value
		updateR = beginR + parseInt(intSignR + calcR);
		updateG = beginG + parseInt(intSignG + calcG);
		updateB = beginB + parseInt(intSignB + calcB);

		// apply new RGB colors to <main> element
		elMain.style.backgroundColor = 'rgb('+updateR+','+updateG+','+updateB+')';

		// apply new RGB colors to <nav> links
		for (var i = 0; i < navListCount; i++) {
			elNavLinks[i].style.color           = 'rgb('+updateR+','+updateG+','+updateB+')';
			elNavLinks[i].style.backgroundColor = 'rgb('+updateR+','+updateG+','+updateB+')';
		}

	}


	// Navigation: Click to toggle navigation
	// ----------------------------------------------------------------------------
	function navToggle() {

		var elNav       = document.getElementsByTagName('nav')[0],
			elNavToggle = document.getElementById('nav_toggle');

		elNavToggle.addEventListener('click', function() {

			// is a <span> element, does not require e.preventDefault();

			if (elNav.className == 'toggled_nav') {
				elNav.className = '';
			} else {
				elNav.className = 'toggled_nav';
			}

		}, false);

	}


	// secretMail: Add mailto link to home section
	// ----------------------------------------------------------------------------
	function secretMail() {

		var mailLink = document.getElementById('contact'),
			prefix   = 'mailto',
			local    = 'curtis',
			domain   = 'dulmage',
			suffix   = 'me';

		mailLink.setAttribute('href', prefix + ':' + local + '@' + domain + '.' + suffix);

	}


	// Helper: Fire Window Resize Event Upon Finish
	// ----------------------------------------------------------------------------
	var waitForFinalEvent = (function() {

		var timers = {};

		return function(callback, ms, uniqueId) {

			if (!uniqueId) {
				uniqueId = 'beefchimi'; // Don't call this twice without a uniqueId
			}

			if (timers[uniqueId]) {
				clearTimeout(timers[uniqueId]);
			}

			timers[uniqueId] = setTimeout(callback, ms);

		};

	})();


	// Helper: Detect iOS Version
	// ----------------------------------------------------------------------------
/*
	function iOSversion() {

		if (/iP(hone|od|ad)/.test(navigator.platform)) {
			// supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
			var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
			return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
		}

	}
*/


	// Window Events: On Touch - Start, Move, and End
	// ----------------------------------------------------------------------------
	function touchScrolling() {

		document.body.addEventListener('touchstart', function(e) {

			// code adapted from:
			// http://dropshado.ws/post/45694832906/touch-identifier-0

			// dismiss after-touches
			if (isTouching) {
				return;
			}

			// only care about the first touch
			touchS  = e.changedTouches[0];
			touchID = touchS.identifier;

			window.addEventListener('touchmove', onTouchMove, false);
			window.addEventListener('touchend', onTouchEnd, false);

			isTouching = true;

		}, false);

		// iterate through touch points and stick with the initial touch contact
		function getTouch(e) {

			// cycle through every changed touch and get one that matches
			for (var i = 0, len = e.changedTouches.length; i < len; i++) {

				touchAll = e.changedTouches[i];

				if (touchAll.identifier === touchID) {
					return touchAll;
				}

			}

		}

		// assign touchstart to touchmove, updateColor as we move
		function onTouchMove(e) {

			touchM = getTouch(e);

			if (!touchM) {
				return;
			}

			updateColor();

		}

		// assign touchstart to touchend, remove touch listeners, set isTouching back to false
		function onTouchEnd(e) {

			touchE = getTouch(e);

			if (!touchE) {
				return;
			}

			window.removeEventListener('touchmove', onTouchMove, false);
			window.removeEventListener('touchend', onTouchEnd, false);

			isTouching = false;

		}

	}


	// Window Events: On - Scroll, Resize
	// ----------------------------------------------------------------------------
	window.addEventListener('scroll', function(e) {

		updateColor();

	}, false);

	window.addEventListener('resize', function(e) {

		// do not fire resize event for every pixel... wait until finished
		waitForFinalEvent(function() {

			onPageLoad();

		}, 500, 'unique string');

	}, false);


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	// load page at top of document...
	// chrome remembers your scroll position on reload, so this is the only reliable solution
	if (history.pushState) {
		history.pushState(null, null, '');
		window.scroll(0, 0);
	}

	onPageLoad();
	navToggle();
	secretMail();
	touchScrolling();

/*
	// only enable the touch events for iOS <= 7
	if (iOSv && iOSv[0] <= 7) {
		touchScrolling();
		alert(iOSv);
	} else {
		console.log('noooope');
		alert(iOSv);
	}
*/

	// smoothScroll();
	smoothScroll.init({
		speed: 400,
		easing: 'easeInOutQuint',
		updateURL: false
	});


}, false);