document.addEventListener('DOMContentLoaded', function() {


	/* Global Variables
	---------------------------------------------------------------------------- */

	/* --- Objects and Initial Setup --- */

	// common objects
	var elHTML         = document.documentElement,
		elBody         = document.body,
		elMain         = document.getElementsByTagName('main')[0],
		elSections     = document.getElementsByTagName('section'),
		elIntroSection = document.getElementById('intro_dulmage'),
		elNavList      = document.getElementsByTagName('li'),
		elNavLinks     = document.getElementsByClassName('link_anchor'),
		elNavToggle    = document.getElementsByClassName('nav_toggle')[0],
		navListCount   = elNavList.length;

	// possible homepage options
	var homeOptions = [
		{ title:'beach',    r:134, g:160, b:197, h:215, s:35 },
		{ title:'bridge',   r:110, g:145, b:110, h:120, s:14 },
		{ title:'flowers',  r:140, g:84,  b:193, h:271, s:47 },
		{ title:'forest',   r:189, g:187, b:56,  h:59,  s:54 },
		{ title:'thegut',   r:106, g:96,  b:25,  h:53,  s:62 },
		{ title:'tropical', r:186, g:64,  b:79,  h:353, s:49 },
		{ title:'worship',  r:203, g:78,  b:74,  h:2,   s:55 }
	];

	// randomly select a home option
	var randomMin    = 0,
		randomMax    = homeOptions.length - 1,
		randomOption = Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin;

	// color data for each section (first object is added as a random selection from homeOptions)
	var sectionData = [
		homeOptions[randomOption],
		{ title:'preserve',  r:255, g:195, b:12,  h:45,  s:100 },
		{ title:'bmc',       r:255, g:65,  b:0,   h:15,  s:100 },
		{ title:'fringe',    r:255, g:90,  b:82,  h:3,   s:100 },
		{ title:'na2014',    r:226, g:172, b:58,  h:41,  s:74  },
		{ title:'artscourt', r:248, g:109, b:41,  h:20,  s:94  },
		{ title:'na2012',    r:235, g:71,  b:71,  h:0,   s:80  },
		{ title:'pukeko',    r:55,  g:58,  b:134, h:238, s:42  },
		{ title:'chicken',   r:73,  g:200, b:142, h:153, s:54  },
		{ title:'cfc',       r:192, g:106, b:30,  h:28,  s:73  },
		{ title:'bryston',   r:57,  g:148, b:219, h:206, s:69  }
	];

	/* --- Section and Data Variables --- */

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

	/* --- Colour Variables --- */

	// all RGB variables
	var beginR, beginG, beginB,
		endR, endG, endB,
		diffR, diffG, diffB,
		intSignR, intSignG, intSignB,
		calcR, calcG, calcB,
		updateR, updateG, updateB;

	// all HSL variables
	var beginH, beginS,
		endH, endS,
		diffH, diffS,
		intSignH, intSignS,
		calcH, calcS,
		updateH, updateS;

	/* --- Image Preloader --- */

	var imgLoader   = new PxLoader(),
		imgPath     = 'assets/img/',
		imgHome     = imgPath + 'home-' + homeOptions[randomOption].title + '.png',
		elAside     = document.getElementsByTagName('aside')[0],
		elAsideSpan = elAside.getElementsByTagName('span')[0];

	// load home image based on homeOptions random selection
	imgLoader.addImage(imgHome),

	// only first half of images are preloaded
	imgLoader.addImage(imgPath + 'artscourt.png'),
	imgLoader.addImage(imgPath + 'bmc.png'),
	imgLoader.addImage(imgPath + 'bryston.png'),
	imgLoader.addImage(imgPath + 'cfc.png'),
	imgLoader.addImage(imgPath + 'chicken.png'),
	imgLoader.addImage(imgPath + 'fringe.png'),
	imgLoader.addImage(imgPath + 'na2012.png'),
	imgLoader.addImage(imgPath + 'na2014.png'),
	imgLoader.addImage(imgPath + 'preserve.png'),
	imgLoader.addImage(imgPath + 'pukeko.png');

	// callback for displaying load progress
	imgLoader.addProgressListener(function(e) {

		var loadPercent = Math.round(e.completedCount / e.totalCount * 100);

		elAsideSpan.innerHTML = loadPercent;

	});

	// callback that will be run once images are ready
	imgLoader.addCompletionListener(function() {

		// remove 'loading' class from <html> in order to trigger css transition for fade out and restore scrolling
		elHTML.classList.remove('loading');

		// fade out should take 800ms, but give it a little bit more time just to be safe
		setTimeout(function() {
			// elAside.remove(); unsure about support for this
			elAside.parentNode.removeChild(elAside);
		}, 1000);

	});

	// initialize the preloader
	imgLoader.start();


	/* onPageLoad: Main Function To Fire on Window Load
	---------------------------------------------------------------------------- */
	function onPageLoad() {

		// get scroll position on load in case of anchor or refresh (do not assume 0)
		scrollPos = window.scrollY;

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


	/* trackSection: Track Progression of Sections
	---------------------------------------------------------------------------- */
	function trackSection() {

		// determine new prev / next sections
		if (sectionCurrent <= 0) {

			sectionPrev = 0; // false ???
			sectionNext = sectionCurrent + 1;

		} else if ( sectionCurrent >= (sectionCount - 1) ) {

			sectionPrev = sectionCurrent - 1;
			sectionNext = sectionCurrent; // false ???

		} else {

			sectionPrev = sectionCurrent - 1;
			sectionNext = sectionCurrent + 1;

		}

		// remove "current" class from ALL nav items...
		// sectionPrev & sectionNext is unreliable and sometimes does not get removed in time
		for (var i = 0; i < navListCount; i++) {
			elNavList[i].classList.remove('current');
			elNavList[i].classList.remove('current');
		}

		// apply "current" class to the current nav item
		elNavList[sectionCurrent].classList.add('current');

		// redefine begin RGB values based on new sectionCurrent
		beginR = sectionData[sectionCurrent].r;
		beginG = sectionData[sectionCurrent].g;
		beginB = sectionData[sectionCurrent].b;

		// redefine begin HSL values based on new sectionCurrent
		beginH = sectionData[sectionCurrent].h;
		beginS = sectionData[sectionCurrent].s;

		// redefine end RGB values based on new sectionNext
		endR = sectionData[sectionNext].r;
		endG = sectionData[sectionNext].g;
		endB = sectionData[sectionNext].b;

		// redefine end HSL values based on new sectionNext
		endH = sectionData[sectionNext].h;
		endS = sectionData[sectionNext].s;

		// define difference of begin / end RGB values
		diffR = beginR - endR;
		diffG = beginG - endG;
		diffB = beginB - endB;

		// define difference of begin / end HSL values
		diffH = beginH - endH;
		diffS = beginS - endS;

	}


	/* updateColor: Update Background Color During Scroll
	---------------------------------------------------------------------------- */
	function updateColor() {

		// update scroll position as we scroll the window
		scrollPos = window.scrollY;

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


	/* colorMath: Calculate Background Colour Values
	---------------------------------------------------------------------------- */
	function colorMath() {

		// get current scroll percentage within section
		currentPercent = ( scrollPos - (sectionCurrent * windowHeight) ) / windowHeight * 100;

		// reverse the sign of this integer (positive or negative), required to do the math properly...
		// you can add a negative to a positive as if subtracting (10 + -4 = 6)
		intSignR = diffR > 0 ? '-' : '';
		intSignG = diffG > 0 ? '-' : '';
		intSignB = diffB > 0 ? '-' : '';
		intSignH = diffH > 0 ? '-' : '';
		intSignS = diffS > 0 ? '-' : '';

		// calculate the threshold we will (in/de)crease our RGB / HSL values by
		calcR = Math.abs( (diffR * currentPercent) / 100 );
		calcG = Math.abs( (diffG * currentPercent) / 100 );
		calcB = Math.abs( (diffB * currentPercent) / 100 );
		calcH = Math.abs( (diffH * currentPercent) / 100 );
		calcS = Math.abs( (diffS * currentPercent) / 100 );

		// update our RGB / HSL values by adding our calculated (in/de)crease values to the current (begin) value
		updateR = beginR + parseInt(intSignR + calcR);
		updateG = beginG + parseInt(intSignG + calcG);
		updateB = beginB + parseInt(intSignB + calcB);
		updateH = beginH + parseInt(intSignH + calcH);
		updateS = beginS + parseInt(intSignS + calcS);

		// apply new RGB colors to <main> element
		elMain.style.backgroundColor = 'rgb('+updateR+','+updateG+','+updateB+')';

		// apply new RGB & HSL colors to <nav> links... using HSL to control lightness, gets converted to RGB in browser :(
		for (var i = 0; i < navListCount; i++) {
			elNavLinks[i].style.color = 'rgb('+updateR+','+updateG+','+updateB+')';
			elNavLinks[i].style.backgroundColor = 'hsl('+updateH+','+updateS+'%,90%)';
		}

	}


	/* Navigation: Click to toggle navigation
	---------------------------------------------------------------------------- */
	function navToggle() {

		elNavToggle.addEventListener('click', function(e) {

			this.classList.toggle('active');
			e.preventDefault();

		}, false);

	}


	/* secretMail: Add mailto link to home section
	---------------------------------------------------------------------------- */
	function secretMail() {

		var mailLink    = document.getElementById('contact'),
			prefix      = 'mailto',
			local       = 'curtis',
			klammeraffe = '@',
			domain      = 'dulmage',
			suffix      = 'me';

		mailLink.setAttribute('href', prefix + ':' + local + klammeraffe + domain + '.' + suffix)

	}


	/* Helper: Fire Window Resize Event Upon Finish
	---------------------------------------------------------------------------- */
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


	/* Window Events: On Touch - Start, Move, and End
	---------------------------------------------------------------------------- */
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

	// assign touchstart to touchmove, updateColor as we move / scroll
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


	/* Window Events: On - Scroll, Resize
	---------------------------------------------------------------------------- */
	window.addEventListener('scroll', function(e) {

		updateColor();

	}, false);

	window.addEventListener('resize', function(e) {

		// do not fire resize event for every pixel... wait until finished
		waitForFinalEvent(function() {

			onPageLoad();

		}, 500, 'unique string');

	}, false);


	/* Initialize Primary Functions
	---------------------------------------------------------------------------- */

	onPageLoad();
	navToggle();
	secretMail();

	// smoothScroll();
	smoothScroll.init({
		speed: 400,
		easing: 'easeInOutQuint',
		updateURL: false
	});


}, false);