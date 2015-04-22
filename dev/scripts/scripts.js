document.addEventListener('DOMContentLoaded', function() {


	// Global Variables: Variables requiring a global scope
	// ----------------------------------------------------------------------------

	// --- Objects and Initial Setup --- \\

	// common objects
	var animationEvent  = whichAnimationEvent(),
		transitionEvent = whichTransitionEvent(),
		elHTML          = document.documentElement,
		elBody          = document.body,
		elMain          = document.getElementsByTagName('main')[0],
		elIntroSection  = document.getElementById('intro_dulmage'),
		elIntroArticle  = document.getElementsByClassName('intro')[0],
		elPreloader     = document.getElementById('preloader'),
		elPreloaderSVG  = document.getElementsByClassName('ui_loader')[0],
		arrSections     = document.getElementsByTagName('section'),
		arrNavList      = document.getElementsByTagName('li'),
		arrNavLinks     = document.getElementsByClassName('link_anchor'),
		numNavList      = arrNavList.length;

	// possible homepage options
	var arrHomeOptions = [
		{ title:'beach',    r:134, g:160, b:197 },
		{ title:'bridge',   r:110, g:145, b:110 },
		{ title:'flowers',   r:140, g:84,  b:193 },
		{ title:'forest',   r:189, g:187, b:56  },
		{ title:'thegut',   r:106, g:96,  b:25  },
		{ title:'tropical', r:186, g:64,  b:79  },
		{ title:'worship',  r:203, g:78,  b:74  }
	];

	// randomly select a home option
	var numRandomMin    = 0,
		numRandomMax    = arrHomeOptions.length - 1,
		numRandomOption = Math.floor(Math.random() * (numRandomMax - numRandomMin + 1)) + numRandomMin;

	// color data for each section (first object is added as a random selection from arrHomeOptions)
	var arrSectionData = [
		arrHomeOptions[numRandomOption],
		{ title:'preserve',  r:255, g:195, b:12  },
		{ title:'bmc',       r:255, g:65,  b:0   },
		{ title:'na2014',    r:226, g:172, b:58  },
		{ title:'fringe',    r:255, g:90,  b:82  },
		{ title:'northnavy', r:21,  g:53,  b:91  },
		{ title:'na2012',    r:235, g:71,  b:71  },
		{ title:'pukeko',    r:55,  g:58,  b:134 },
		{ title:'cfc',       r:192, g:106, b:30  },
		{ title:'northman',  r:66,  g:92,  b:105 }
	];

	// smoothScroll config
	var scrollOptions   = {
			speed: 400,
			easing: 'easeInOutQuint',
			updateURL: false
		};

	// --- Section and Data Variables --- \\

	// section data
	var numSectionCount = arrSections.length,
		numSectionPrev,
		numSectionNext,
		numSectionCurrent,
		numSectionWhileScrolling;

	// scroll and window variables
	var numWindowHeight = window.innerHeight,
		numScrollPos,
		numCurrentPercent;

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
		imgProj   = imgPath + 'proj_',
		imgHome   = imgPath + 'home_' + arrHomeOptions[numRandomOption].title + '.png';

	// load home image based on arrHomeOptions random selection
	imgLoader.addImage(imgHome);

	// only first half of images are preloaded
	imgLoader.addImage(imgProj + 'preserve.png');
	imgLoader.addImage(imgProj + 'bmc.png');
	imgLoader.addImage(imgProj + 'na2014.png');
	imgLoader.addImage(imgProj + 'fringe.png');
	imgLoader.addImage(imgProj + 'northnavy.png');
	imgLoader.addImage(imgProj + 'na2012.png');
	// imgLoader.addImage(imgProj + 'pukeko.png');
	// imgLoader.addImage(imgProj + 'cfc.png');
	// imgLoader.addImage(imgProj + 'northman.png');

	// callback that will be run once images are ready
	imgLoader.addCompletionListener(function() {

		// listen for CSS transitionEnd before removing the element
		elPreloaderSVG.addEventListener(transitionEvent, removePreloader);

		// declare page as 'loaded' in order to trigger css transitions / animations
		elHTML.setAttribute('data-ready', 'loaded');

		// restore scrolling to document by removing locked <body> height
		elBody.removeAttribute('style');

	});

	// initialize the preloader
	imgLoader.start();


	// Helper: Check when a CSS animation or transition has ended
	// ----------------------------------------------------------------------------
	function whichAnimationEvent() {

		var anim,
			element    = document.createElement('fakeelement'),
			animations = {
				'animation'       : 'animationend',
				'OAnimation'      : 'oAnimationEnd',
				'MozAnimation'    : 'animationend',
				'WebkitAnimation' : 'webkitAnimationEnd'
			}

		for (anim in animations) {
			if (element.style[anim] !== undefined) {
				return animations[anim];
			}
		}

	}

	function whichTransitionEvent() {

		var trans,
			element     = document.createElement('fakeelement'),
			transitions = {
				'transition'       : 'transitionend',
				'OTransition'      : 'oTransitionEnd',
				'MozTransition'    : 'transitionend',
				'WebkitTransition' : 'webkitTransitionEnd'
			}

		for (trans in transitions) {
			if (element.style[trans] !== undefined) {
				return transitions[trans];
			}
		}

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


	// removePreloader: Remove the preloader from DOM
	// ----------------------------------------------------------------------------
	function removePreloader() {

		// must remove event listener!
		elPreloaderSVG.removeEventListener(transitionEvent, removePreloader);

		// remove preloader <div> from document once the SVG listener has been removed
		elIntroArticle.removeChild(elPreloader);

	}


	// Navigation: Click to toggle navigation
	// ----------------------------------------------------------------------------
	function navToggle() {

		var elNav       = document.getElementsByTagName('nav')[0],
			elNavToggle = document.getElementById('nav_toggle');

		// is a <span> element, does not require e.preventDefault();
		elNavToggle.addEventListener('click', function() {

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
			prefix    = 'mailto',
			local    = 'curtis',
			domain   = 'dulmage',
			suffix    = 'me';

		mailLink.setAttribute('href', prefix + ':' + local + '@' + domain + '.' + suffix);

	}


	// onPageLoad: Main Function To Fire on Window Load
	// ----------------------------------------------------------------------------
	function onPageLoad() {

		// load page at top of document...
		// chrome remembers your scroll position on reload, so this is the only reliable solution
		if (history.pushState) {
			history.pushState(null, null, '');
			window.scroll(0, 0);
		}

		// assume still loading images - lock scrolling by setting explicit height on <body>
		elBody.style.height = numWindowHeight + 'px';

		// set randomly selected homeOption as <section> background-image
		elIntroSection.style.backgroundImage = 'url(' + imgHome + ')';

		// run initial functions
		setupSections();
		navToggle();
		secretMail();
		touchScrolling();

		// initialize smoothscroll for nav links
		smoothScroll.init(scrollOptions);

	}


	// setupSections: Apply and initialize section styles
	// ----------------------------------------------------------------------------
	function setupSections() {

		// apply numWindowHeight to each <section>...
		// only required because iOS shits the bed with 100vh height elements and orientation change
		for (var i = 0; i < numSectionCount; i++) {
			arrSections[i].style.height = numWindowHeight + 'px';
		}

		// update scroll position (section height adjustment happens at end of window resize - transitions)
		numScrollPos = window.pageYOffset;

		// get numSectionCurrent on page load (user may have landed here via anchor, sections may have shifted on resize, etc...)
		numSectionCurrent = Math.floor(numScrollPos / numWindowHeight);

		// set prev and next sections to be equal to numSectionCurrent...
		// trackSection will immediately update these incorrect values
		numSectionPrev = numSectionCurrent;
		numSectionNext = numSectionCurrent;

		// initialize trackSection for the first time
		trackSection();

		// perform color math on page load
		colorMath();

	}


	// trackSection: Track Progression of Sections
	// ----------------------------------------------------------------------------
	function trackSection() {

		// determine new prev / next sections
		if (numSectionCurrent <= 0) {

			numSectionPrev = 0;
			numSectionNext = numSectionCurrent + 1;

		} else if ( numSectionCurrent >= (numSectionCount - 1) ) {

			numSectionPrev = numSectionCurrent - 1;
			numSectionNext = numSectionCurrent;

		} else {

			numSectionPrev = numSectionCurrent - 1;
			numSectionNext = numSectionCurrent + 1;

		}

		// remove "current" class from ALL nav items...
		// numSectionPrev & numSectionNext is unreliable and sometimes does not get removed in time (not fast enough)
		for (var i = 0; i < numNavList; i++) {
			arrNavList[i].className = '';
		}

		// apply "current" class to the current nav item
		arrNavList[numSectionCurrent].className = 'current';

		// redefine begin RGB values based on new numSectionCurrent
		beginR = arrSectionData[numSectionCurrent].r;
		beginG = arrSectionData[numSectionCurrent].g;
		beginB = arrSectionData[numSectionCurrent].b;

		// redefine end RGB values based on new numSectionNext
		endR = arrSectionData[numSectionNext].r;
		endG = arrSectionData[numSectionNext].g;
		endB = arrSectionData[numSectionNext].b;

		// define difference of begin / end RGB values
		diffR = beginR - endR;
		diffG = beginG - endG;
		diffB = beginB - endB;

	}


	// updateColor: Update Background Color During Scroll
	// ----------------------------------------------------------------------------
	function updateColor() {

		// update scroll position as we scroll the window
		numScrollPos = window.pageYOffset;

		// apply new values only if numScrollPos is greater than 0...
		// this will prevent iOS rubber band scrolling from producing incorrect values
		if (numScrollPos >= 0) {

			// check what section we are in while scrolling
			numSectionWhileScrolling = Math.floor(numScrollPos / numWindowHeight);

			// once numSectionWhileScrolling no longer equals numSectionCurrent,
			// we know we have crossed into new territory
			if (numSectionCurrent != numSectionWhileScrolling) {

				// assign numSectionWhileScrolling as the new numSectionCurrent
				numSectionCurrent = numSectionWhileScrolling;

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
		numCurrentPercent = ( numScrollPos - (numSectionCurrent * numWindowHeight) ) / numWindowHeight * 100;

		// reverse the sign of this integer (positive or negative), required to do the math properly...
		// you can add a negative to a positive as if subtracting (10 + -4 = 6)
		intSignR = diffR > 0 ? '-' : '';
		intSignG = diffG > 0 ? '-' : '';
		intSignB = diffB > 0 ? '-' : '';

		// calculate the threshold we will (in/de)crease our RGB values by
		calcR = Math.abs( (diffR * numCurrentPercent) / 100 );
		calcG = Math.abs( (diffG * numCurrentPercent) / 100 );
		calcB = Math.abs( (diffB * numCurrentPercent) / 100 );

		// update our RGB values by adding our calculated (in/de)crease values to the current (begin) value
		updateR = beginR + parseInt(intSignR + calcR);
		updateG = beginG + parseInt(intSignG + calcG);
		updateB = beginB + parseInt(intSignB + calcB);

		// apply new RGB colors to <main> element
		elMain.style.backgroundColor = 'rgb('+updateR+','+updateG+','+updateB+')';

		// apply new RGB colors to <nav> links
		for (var i = 0; i < numNavList; i++) {
			arrNavLinks[i].style.color           = 'rgb('+updateR+','+updateG+','+updateB+')';
			arrNavLinks[i].style.backgroundColor = 'rgb('+updateR+','+updateG+','+updateB+')';
		}

	}


	// resizeScrollToSection: Scroll to top of section on window resize
	// ----------------------------------------------------------------------------
	function resizeScrollToSection() {

		if (numSectionCurrent === 0) {
			smoothScroll.animateScroll(null, '#intro_dulmage', scrollOptions);
		} else {
			smoothScroll.animateScroll(null, '#project_' + arrSectionData[numSectionCurrent].title, scrollOptions);
		}

	}


	// Window Events: On Touch - Start, Move, and End
	// ----------------------------------------------------------------------------
	function touchScrolling() {

		// exit function if this is not Chrome iOS
		if (!navigator.userAgent.match('CriOS')) {
			return;
		}

		// touch variables
		var boolTouching = false,
			dataTouchS,
			dataTouchM,
			dataTouchE,
			dataTouchAll,
			dataTouchID;

		document.body.addEventListener('touchstart', function(e) {

			// code adapted from:
			// http://dropshado.ws/post/45694832906/touch-identifier-0

			// dismiss after-touches
			if (boolTouching) {
				return;
			}

			// only care about the first touch
			dataTouchS  = e.changedTouches[0];
			dataTouchID = dataTouchS.identifier;

			window.addEventListener('touchmove', onTouchMove, false);
			window.addEventListener('touchend', onTouchEnd, false);

			boolTouching = true;

		}, false);

		// iterate through touch points and stick with the initial touch contact
		function getTouch(e) {

			// cycle through every changed touch and get one that matches
			for (var i = 0, len = e.changedTouches.length; i < len; i++) {

				dataTouchAll = e.changedTouches[i];

				if (dataTouchAll.identifier === dataTouchID) {
					return dataTouchAll;
				}

			}

		}

		// assign touchstart to touchmove, updateColor as we move
		function onTouchMove(e) {

			dataTouchM = getTouch(e);

			if (!dataTouchM) {
				return;
			}

			updateColor();

		}

		// assign touchstart to touchend, remove touch listeners, set boolTouching back to false
		function onTouchEnd(e) {

			dataTouchE = getTouch(e);

			if (!dataTouchE) {
				return;
			}

			window.removeEventListener('touchmove', onTouchMove, false);
			window.removeEventListener('touchend', onTouchEnd, false);

			boolTouching = false;

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

			numWindowHeight = window.innerHeight; // recalculate window height for sections
			setupSections();
			resizeScrollToSection();

		}, 500, 'unique string');

	}, false);


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	onPageLoad();


}, false);