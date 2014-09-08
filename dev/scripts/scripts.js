jQuery(document).ready(function($) {




	/* --- Global Variables --- */

	// objects and height values
	var $window      = $(window),
		$mainElement = $('main'),
		windowHeight;

	// display stats !!! REMOVE FOR PRODUCTION !!!
	var $statsHeight             = $('h6.height span'),
			$statsPercent        = $('h6.percent span'),
			$statsScroll         = $('h6.scroll span'),
			$statsSectionPrev    = $('h6.section_prev span'),
			$statsSectionCurrent = $('h6.section_current span'),
			$statsSectionNext    = $('h6.section_next span'),
			$statsUpdateR        = $('h6.updateR span'),
			$statsUpdateG        = $('h6.updateG span'),
			$statsUpdateB        = $('h6.updateB span');

	// RGB color data for each section
	var sectionData = {
		section_0:{  title:'section_0',  r:235, g:71,  b:71  },
		section_1:{  title:'section_1',  r:255, g:195, b:12  },
		section_2:{  title:'section_2',  r:255, g:65,  b:0   },
		section_3:{  title:'section_3',  r:255, g:90,  b:82  },
		section_4:{  title:'section_4',  r:226, g:172, b:58  },
		section_5:{  title:'section_5',  r:248, g:109, b:41  },
		section_6:{  title:'section_6',  r:235, g:71,  b:71  },
		section_7:{  title:'section_7',  r:55,  g:58,  b:134 },
		section_8:{  title:'section_8',  r:73,  g:200, b:142 },
		section_9:{  title:'section_9',  r:192, g:106, b:30  },
		section_10:{ title:'section_10', r:57,  g:148, b:219 }
	};

	// assigned / updated on first load
	var scrollPos,
		currentPercent;

	// all RGB variables
	var beginR,
		beginG,
		beginB,
		endR,
		endG,
		endB,
		diffR,
		diffG,
		diffB,
		intSignR,
		intSignG,
		intSignB,
		calcR,
		calcG,
		calcB,
		updateR,
		updateG,
		updateB;

	// section data
	var sectionCount = $('section').length,
		sectionPrev,
		sectionCurrent,
		sectionNext,
		sectionWhileScrolling;


	/* onPageLoad: Main Function To Fire on Window Load
	---------------------------------------------------------------------------- */
	function onPageLoad() {

		// get scroll position on load in case of anchor or refresh (do not assume 0)
		scrollPos = $window.scrollTop();

		// get height of browser window on page load and resize events
		windowHeight = $window.height();

		// apply windowHeight to each <section>
		$('section').height(windowHeight);

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

		// redefine begin RGB values based on new sectionCurrent
		beginR = sectionData['section_'+sectionCurrent]['r'];
		beginG = sectionData['section_'+sectionCurrent]['g'];
		beginB = sectionData['section_'+sectionCurrent]['b'];

		// redefine end RGB values based on new sectionNext
		endR = sectionData['section_'+sectionNext]['r'];
		endG = sectionData['section_'+sectionNext]['g'];
		endB = sectionData['section_'+sectionNext]['b'];

		// define difference of begin / end RGB values
		diffR = beginR - endR;
		diffG = beginG - endG;
		diffB = beginB - endB;

	}


	/* updateColor: Update Background Color During Scroll
	---------------------------------------------------------------------------- */
	function updateColor() {

		// update scroll position as we scroll the window
		scrollPos = $(this).scrollTop();

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

		// calculate the threshold we will (in/de)crease our RGB values by
		calcR = Math.abs( (diffR * currentPercent) / 100 );
		calcG = Math.abs( (diffG * currentPercent) / 100 );
		calcB = Math.abs( (diffB * currentPercent) / 100 );

		// update our RGB values by adding our calculated (in/de)crease values to the current (begin) value
		updateR = beginR + parseInt(intSignR + calcR);
		updateG = beginG + parseInt(intSignG + calcG);
		updateB = beginB + parseInt(intSignB + calcB);

		// apply new values
		$mainElement.css('background-color', 'rgb('+updateR+','+updateG+','+updateB+')');

		// output HELPER info to screen
		helperOutput(updateR, updateG, updateB);

	}


	/* navToggle: Click to toggle navigation
	---------------------------------------------------------------------------- */
	function navToggle() {

		$('a.nav_toggle').on('click', function() {

			$(this).toggleClass('active');
			return false;

		});

	}


	/* Helper: Fire Window Resize Event Upon Finish
	---------------------------------------------------------------------------- */
	var waitForFinalEvent = (function () {

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


	/* Helper: Output To Screen or Console
	---------------------------------------------------------------------------- */
	function helperOutput(r, g, b) {

		// display single section height
		$statsHeight.html(windowHeight);

		// display current scroll percentage
		$statsPercent.html(currentPercent);

		// display current scroll position
		$statsScroll.html(scrollPos);

		// display previous section
		$statsSectionPrev.html(sectionPrev + ' - ' + sectionData['section_'+sectionPrev]['title']);

		// display current section
		$statsSectionCurrent.html(sectionCurrent + ' - ' + sectionData['section_'+sectionCurrent]['title']);

		// display next section
		$statsSectionNext.html(sectionNext + ' - ' + sectionData['section_'+sectionNext]['title']);

		// display current updateR
		$statsUpdateR.html(r);

		// display current updateG
		$statsUpdateG.html(g);

		// display current updateB
		$statsUpdateB.html(b);

	}


	/* Window Events: On Scroll, Resize, and Load
	---------------------------------------------------------------------------- */
	$window.scroll(function() {

		// $('section.section-0 h1').html('plurp');

		updateColor();

	});


/*
	$window.on('touchmove', function(e) {

		// e.preventDefault();
		var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

		//CODE GOES HERE
		// console.log(touch.pageY+' '+touch.pageX);

		var love = $(this).scrollTop();
		// $('.section-0 h1').html(love);
		$('.section-0 h1').html(touch.pageY + ' ' + touch.pageX);

	});
*/

	// does this account for orientation change?
	$window.resize(function() {

		// do not fire resize event for every pixel... wait until finished
		waitForFinalEvent(function() {

			onPageLoad();

		}, 500, 'unique string');

	});


	$window.load(function() {

		// http://codepen.io/MyXoToD/blog/look-ma-such-a-smooth-scroll

		// fires only once EVERYTHING is ready...
		// fire this after our preLoader, which should initialize immediately
		onPageLoad();

		navToggle();

	});






});