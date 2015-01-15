/*
// Avoid 'console' errors in browsers that lack a console.
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());
*/


// PxLoader v1.0 | Copyright (c) 2012 Pixel Lab | https://github.com/thinkpixellab/PxLoader | MIT License
(function(global) {

	/*
	 * PixelLab Resource Loader
	 * Loads resources while providing progress updates.
	*/
	function PxLoader(settings) {

		// merge settings with defaults
		settings = settings || {};
		this.settings = settings;

		// how frequently we poll resources for progress
		if (settings.statusInterval == null) {
			settings.statusInterval = 5000; // every 5 seconds by default
		}

		// delay before logging since last progress change
		if (settings.loggingDelay == null) {
			settings.loggingDelay = 20 * 1000; // log stragglers after 20 secs
		}

		// stop waiting if no progress has been made in the moving time window
		if (settings.noProgressTimeout == null) {
			settings.noProgressTimeout = Infinity; // do not stop waiting by default
		}

		var entries = [],
			// holds resources to be loaded with their status
			progressListeners = [],
			timeStarted, progressChanged = Date.now();

		/**
		 * The status of a resource
		 * @enum {number}
		 */
		var ResourceState = {
			QUEUED: 0,
			WAITING: 1,
			LOADED: 2,
			ERROR: 3,
			TIMEOUT: 4
		};

		// places non-array values into an array.
		var ensureArray = function(val) {
			if (val == null) {
				return [];
			}

			if (Array.isArray(val)) {
				return val;
			}

			return [val];
		};

		// add an entry to the list of resources to be loaded
		this.add = function(resource) {

			// TODO: would be better to create a base class for all resources and
			// initialize the PxLoaderTags there rather than overwritting tags here
			resource.tags = new PxLoaderTags(resource.tags);

			// ensure priority is set
			if (resource.priority == null) {
				resource.priority = Infinity;
			}

			entries.push({
				resource: resource,
				status: ResourceState.QUEUED
			});
		};

		this.addProgressListener = function(callback, tags) {
			progressListeners.push({
				callback: callback,
				tags: new PxLoaderTags(tags)
			});
		};

		this.addCompletionListener = function(callback, tags) {
			progressListeners.push({
				tags: new PxLoaderTags(tags),
				callback: function(e) {
					if (e.completedCount === e.totalCount) {
						callback(e);
					}
				}
			});
		};

		// creates a comparison function for resources
		var getResourceSort = function(orderedTags) {

			// helper to get the top tag's order for a resource
			orderedTags = ensureArray(orderedTags);
			var getTagOrder = function(entry) {
				var resource = entry.resource,
					bestIndex = Infinity;
				for (var i = 0; i < resource.tags.length; i++) {
					for (var j = 0; j < Math.min(orderedTags.length, bestIndex); j++) {
						if (resource.tags.all[i] === orderedTags[j] && j < bestIndex) {
							bestIndex = j;
							if (bestIndex === 0) {
								break;
							}
						}
						if (bestIndex === 0) {
							break;
						}
					}
				}
				return bestIndex;
			};
			return function(a, b) {
				// check tag order first
				var aOrder = getTagOrder(a),
					bOrder = getTagOrder(b);
				if (aOrder < bOrder) { return -1; }
				if (aOrder > bOrder) { return 1; }

				// now check priority
				if (a.priority < b.priority) { return -1; }
				if (a.priority > b.priority) { return 1; }
				return 0;
			};
		};

		this.start = function(orderedTags) {
			timeStarted = Date.now();

			// first order the resources
			var compareResources = getResourceSort(orderedTags);
			entries.sort(compareResources);

			// trigger requests for each resource
			for (var i = 0, len = entries.length; i < len; i++) {
				var entry = entries[i];
				entry.status = ResourceState.WAITING;
				entry.resource.start(this);
			}

			// do an initial status check soon since items may be loaded from the cache
			setTimeout(statusCheck, 100);
		};

		var statusCheck = function() {
			var checkAgain = false,
				noProgressTime = Date.now() - progressChanged,
				timedOut = (noProgressTime >= settings.noProgressTimeout),
				shouldLog = (noProgressTime >= settings.loggingDelay);

			for (var i = 0, len = entries.length; i < len; i++) {
				var entry = entries[i];
				if (entry.status !== ResourceState.WAITING) {
					continue;
				}

				// see if the resource has loaded
				if (entry.resource.checkStatus) {
					entry.resource.checkStatus();
				}

				// if still waiting, mark as timed out or make sure we check again
				if (entry.status === ResourceState.WAITING) {
					if (timedOut) {
						entry.resource.onTimeout();
					} else {
						checkAgain = true;
					}
				}
			}

			// log any resources that are still pending
			if (shouldLog && checkAgain) {
				log();
			}

			if (checkAgain) {
				setTimeout(statusCheck, settings.statusInterval);
			}
		};

		this.isBusy = function() {
			for (var i = 0, len = entries.length; i < len; i++) {
				if (entries[i].status === ResourceState.QUEUED || entries[i].status === ResourceState.WAITING) {
					return true;
				}
			}
			return false;
		};

		var onProgress = function(resource, statusType) {

			var entry = null,
				i, len, numResourceTags, listener, shouldCall;

			// find the entry for the resource
			for (i = 0, len = entries.length; i < len; i++) {
				if (entries[i].resource === resource) {
					entry = entries[i];
					break;
				}
			}

			// we have already updated the status of the resource
			if (entry == null || entry.status !== ResourceState.WAITING) {
				return;
			}
			entry.status = statusType;
			progressChanged = Date.now();

			numResourceTags = resource.tags.length;

			// fire callbacks for interested listeners
			for (i = 0, len = progressListeners.length; i < len; i++) {

				listener = progressListeners[i];
				if (listener.tags.length === 0) {
					// no tags specified so always tell the listener
					shouldCall = true;
				} else {
					// listener only wants to hear about certain tags
					shouldCall = resource.tags.intersects(listener.tags);
				}

				if (shouldCall) {
					sendProgress(entry, listener);
				}
			}
		};

		this.onLoad = function(resource) {
			onProgress(resource, ResourceState.LOADED);
		};
		this.onError = function(resource) {
			onProgress(resource, ResourceState.ERROR);
		};
		this.onTimeout = function(resource) {
			onProgress(resource, ResourceState.TIMEOUT);
		};

		// sends a progress report to a listener
		var sendProgress = function(updatedEntry, listener) {
			// find stats for all the resources the caller is interested in
			var completed = 0,
				total = 0,
				i, len, entry, includeResource;
			for (i = 0, len = entries.length; i < len; i++) {

				entry = entries[i];
				includeResource = false;

				if (listener.tags.length === 0) {
					// no tags specified so always tell the listener
					includeResource = true;
				} else {
					includeResource = entry.resource.tags.intersects(listener.tags);
				}

				if (includeResource) {
					total++;
					if (entry.status === ResourceState.LOADED ||
						entry.status === ResourceState.ERROR ||
						entry.status === ResourceState.TIMEOUT) {

						completed++;
					}
				}
			}

			listener.callback({
				// info about the resource that changed
				resource: updatedEntry.resource,

				// should we expose StatusType instead?
				loaded: (updatedEntry.status === ResourceState.LOADED),
				error: (updatedEntry.status === ResourceState.ERROR),
				timeout: (updatedEntry.status === ResourceState.TIMEOUT),

				// updated stats for all resources
				completedCount: completed,
				totalCount: total
			});
		};

		// prints the status of each resource to the console
		var log = this.log = function(showAll) {
			if (!window.console) {
				return;
			}

			var elapsedSeconds = Math.round((Date.now() - timeStarted) / 1000);
			window.console.log('PxLoader elapsed: ' + elapsedSeconds + ' sec');

			for (var i = 0, len = entries.length; i < len; i++) {
				var entry = entries[i];
				if (!showAll && entry.status !== ResourceState.WAITING) {
					continue;
				}

				var message = 'PxLoader: #' + i + ' ' + entry.resource.getName();
				switch(entry.status) {
					case ResourceState.QUEUED:
						message += ' (Not Started)';
						break;
					case ResourceState.WAITING:
						message += ' (Waiting)';
						break;
					case ResourceState.LOADED:
						message += ' (Loaded)';
						break;
					case ResourceState.ERROR:
						message += ' (Error)';
						break;
					case ResourceState.TIMEOUT:
						message += ' (Timeout)';
						break;
				}

				if (entry.resource.tags.length > 0) {
					message += ' Tags: [' + entry.resource.tags.all.join(',') + ']';
				}

				window.console.log(message);
			}
		};
	}


	// Tag object to handle tag intersection; once created not meant to be changed
	// Performance rationale: http://jsperf.com/lists-indexof-vs-in-operator/3

	function PxLoaderTags(values) {

		this.all = [];
		this.first = null; // cache the first value
		this.length = 0;

		// holds values as keys for quick lookup
		this.lookup = {};

		if (values) {

			// first fill the array of all values
			if (Array.isArray(values)) {
				// copy the array of values, just to be safe
				this.all = values.slice(0);
			} else if (typeof values === 'object') {
				for (var key in values) {
					if(values.hasOwnProperty(key)) {
						this.all.push(key);
					}
				}
			} else {
				this.all.push(values);
			}

			// cache the length and the first value
			this.length = this.all.length;
			if (this.length > 0) {
				this.first = this.all[0];
			}

			// set values as object keys for quick lookup during intersection test
			for (var i = 0; i < this.length; i++) {
				this.lookup[this.all[i]] = true;
			}
		}
	}

	// compare this object with another; return true if they share at least one value
	PxLoaderTags.prototype.intersects = function(other) {

		// handle empty values case
		if (this.length === 0 || other.length === 0) {
			return false;
		}

		// only a single value to compare?
		if (this.length === 1 && other.length === 1) {
			return this.first === other.first;
		}

		// better to loop through the smaller object
		if (other.length < this.length) {
			return other.intersects(this);
		}

		// loop through every key to see if there are any matches
		for (var key in this.lookup) {
			if (other.lookup[key]) {
				return true;
			}
		}

		return false;
	};

	// AMD module support
	if (typeof define === 'function' && define.amd) {
		define('PxLoader', [], function() {
			return PxLoader;
		});
	}

	// exports
	global.PxLoader = PxLoader;

}(this));


// PxLoader v1.0 Image Extension | Copyright (c) 2012 Pixel Lab | https://github.com/thinkpixellab/PxLoader | MIT License
// removed Date.now and Array.isArray polyfill... add back if needed
function PxLoaderImage(url, tags, priority) {
	var self = this,
		loader = null;

	this.img = new Image();
	this.tags = tags;
	this.priority = priority;

	var onReadyStateChange = function() {
		if (self.img.readyState === 'complete') {
			removeEventHandlers();
			loader.onLoad(self);
		}
	};

	var onLoad = function() {
		removeEventHandlers();
		loader.onLoad(self);
	};

	var onError = function() {
		removeEventHandlers();
		loader.onError(self);
	};

	var removeEventHandlers = function() {
		self.unbind('load', onLoad);
		self.unbind('readystatechange', onReadyStateChange);
		self.unbind('error', onError);
	};

	this.start = function(pxLoader) {
		// we need the loader ref so we can notify upon completion
		loader = pxLoader;

		// NOTE: Must add event listeners before the src is set. We
		// also need to use the readystatechange because sometimes
		// load doesn't fire when an image is in the cache.
		self.bind('load', onLoad);
		self.bind('readystatechange', onReadyStateChange);
		self.bind('error', onError);

		self.img.src = url;
	};

	// called by PxLoader to check status of image (fallback in case
	// the event listeners are not triggered).
	this.checkStatus = function() {
		if (self.img.complete) {
			removeEventHandlers();
			loader.onLoad(self);
		}
	};

	// called by PxLoader when it is no longer waiting
	this.onTimeout = function() {
		removeEventHandlers();
		if (self.img.complete) {
			loader.onLoad(self);
		} else {
			loader.onTimeout(self);
		}
	};

	// returns a name for the resource that can be used in logging
	this.getName = function() {
		return url;
	};

	// cross-browser event binding
	this.bind = function(eventName, eventHandler) {
		if (self.img.addEventListener) {
			self.img.addEventListener(eventName, eventHandler, false);
		} else if (self.img.attachEvent) {
			self.img.attachEvent('on' + eventName, eventHandler);
		}
	};

	// cross-browser event un-binding
	this.unbind = function(eventName, eventHandler) {
		if (self.img.removeEventListener) {
			self.img.removeEventListener(eventName, eventHandler, false);
		} else if (self.img.detachEvent) {
			self.img.detachEvent('on' + eventName, eventHandler);
		}
	};

}

// add a convenience method to PxLoader for adding an image
PxLoader.prototype.addImage = function(url, tags, priority) {
	var imageLoader = new PxLoaderImage(url, tags, priority);
	this.add(imageLoader);

	// return the img element to the caller
	return imageLoader.img;
};

// AMD module support
if (typeof define === 'function' && define.amd) {
	define('PxLoaderImage', [], function() {
		return PxLoaderImage;
	});
}


// smooth-scroll v5.2.2 | copyright Chris Ferdinandi | http://github.com/cferdinandi/smooth-scroll | Licensed under MIT: http://gomakethings.com/mit/
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('smoothScroll', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.smoothScroll = factory(root);
	}
})(window || this, function (root) {

	'use strict';

	//
	// Variables
	//

	var smoothScroll = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var settings;

	// Default settings
	var defaults = {
		speed: 500,
		easing: 'easeInOutCubic',
		offset: 0,
		updateURL: true,
		callbackBefore: function () {},
		callbackAfter: function () {}
	};


	//
	// Methods
	//

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists
	 * @private
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function} callback Callback function for each iteration
	 * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
	 */
	var extend = function ( defaults, options ) {
		var extended = {};
		forEach(defaults, function (value, prop) {
			extended[prop] = defaults[prop];
		});
		forEach(options, function (value, prop) {
			extended[prop] = options[prop];
		});
		return extended;
	};

	/**
	 * Get the closest matching element up the DOM tree
	 * @param {Element} elem Starting element
	 * @param {String} selector Selector to match against (class, ID, or data attribute)
	 * @return {Boolean|Element} Returns false if not match found
	 */
	var getClosest = function (elem, selector) {
		var firstChar = selector.charAt(0);
		for ( ; elem && elem !== document; elem = elem.parentNode ) {
			if ( firstChar === '.' ) {
				if ( elem.classList.contains( selector.substr(1) ) ) {
					return elem;
				}
			} else if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			} else if ( firstChar === '[' ) {
				if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
					return elem;
				}
			}
		}
		return false;
	};

	/**
	 * Escape special characters for use with querySelector
	 * @private
	 * @param {String} id The anchor ID to escape
	 * @author Mathias Bynens
	 * @link https://github.com/mathiasbynens/CSS.escape
	 */
	var escapeCharacters = function ( id ) {
		var string = String(id);
		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = '';
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);
			// Note: there’s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then throw an
			// `InvalidCharacterError` exception and terminate these steps.
			if (codeUnit === 0x0000) {
				throw new InvalidCharacterError(
					'Invalid character: the input contains U+0000.'
				);
			}

			if (
				// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
				// U+007F, […]
				(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
				// If the character is the first character and is in the range [0-9]
				// (U+0030 to U+0039), […]
				(index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				// If the character is the second character and is in the range [0-9]
				// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
				(
					index === 1 &&
					codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
					firstCodeUnit === 0x002D
				)
			) {
				// http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}

			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), […]
			if (
				codeUnit >= 0x0080 ||
				codeUnit === 0x002D ||
				codeUnit === 0x005F ||
				codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
				codeUnit >= 0x0041 && codeUnit <= 0x005A ||
				codeUnit >= 0x0061 && codeUnit <= 0x007A
			) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// http://dev.w3.org/csswg/cssom/#escape-a-character
			result += '\\' + string.charAt(index);

		}
		return result;
	};

	/**
	 * Calculate the easing pattern
	 * @private
	 * @link https://gist.github.com/gre/1650294
	 * @param {String} type Easing pattern
	 * @param {Number} time Time animation should take to complete
	 * @returns {Number}
	 */
	var easingPattern = function ( type, time ) {
		var pattern;
		if ( type === 'easeInQuad' ) pattern = time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuad' ) pattern = time * (2 - time); // decelerating to zero velocity
		if ( type === 'easeInOutQuad' ) pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
		if ( type === 'easeInCubic' ) pattern = time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutCubic' ) pattern = (--time) * time * time + 1; // decelerating to zero velocity
		if ( type === 'easeInOutCubic' ) pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
		if ( type === 'easeInQuart' ) pattern = time * time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuart' ) pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
		if ( type === 'easeInOutQuart' ) pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
		if ( type === 'easeInQuint' ) pattern = time * time * time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuint' ) pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
		if ( type === 'easeInOutQuint' ) pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
		return pattern || time; // no easing, no acceleration
	};

	/**
	 * Calculate how far to scroll
	 * @private
	 * @param {Element} anchor The anchor element to scroll to
	 * @param {Number} headerHeight Height of a fixed header, if any
	 * @param {Number} offset Number of pixels by which to offset scroll
	 * @returns {Number}
	 */
	var getEndLocation = function ( anchor, headerHeight, offset ) {
		var location = 0;
		if (anchor.offsetParent) {
			do {
				location += anchor.offsetTop;
				anchor = anchor.offsetParent;
			} while (anchor);
		}
		location = location - headerHeight - offset;
		return location >= 0 ? location : 0;
	};

	/**
	 * Determine the document's height
	 * @private
	 * @returns {Number}
	 */
	var getDocumentHeight = function () {
		return Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		);
	};

	/**
	 * Convert data-options attribute into an object of key/value pairs
	 * @private
	 * @param {String} options Link-specific options as a data attribute string
	 * @returns {Object}
	 */
	var getDataOptions = function ( options ) {
		return !options || !(typeof JSON === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse( options );
	};

	/**
	 * Update the URL
	 * @private
	 * @param {Element} anchor The element to scroll to
	 * @param {Boolean} url Whether or not to update the URL history
	 */
	var updateUrl = function ( anchor, url ) {
		if ( history.pushState && (url || url === 'true') ) {
			history.pushState( null, null, [root.location.protocol, '//', root.location.host, root.location.pathname, root.location.search, anchor].join('') );
		}
	};

	/**
	 * Start/stop the scrolling animation
	 * @public
	 * @param {Element} toggle The element that toggled the scroll event
	 * @param {Element} anchor The element to scroll to
	 * @param {Object} options
	 */
	smoothScroll.animateScroll = function ( toggle, anchor, options ) {

		// Options and overrides
		var settings = extend( settings || defaults, options || {} );  // Merge user options with defaults
		var overrides = getDataOptions( toggle ? toggle.getAttribute('data-options') : null );
		settings = extend( settings, overrides );
		anchor = '#' + escapeCharacters(anchor.substr(1)); // Escape special characters and leading numbers

		// Selectors and variables
		var anchorElem = document.querySelector(anchor);
		var fixedHeader = document.querySelector('[data-scroll-header]'); // Get the fixed header
		var headerHeight = fixedHeader === null ? 0 : (fixedHeader.offsetHeight + fixedHeader.offsetTop); // Get the height of a fixed header if one exists
		var startLocation = root.pageYOffset; // Current location on the page
		var endLocation = getEndLocation( anchorElem, headerHeight, parseInt(settings.offset, 10) ); // Scroll to location
		var animationInterval; // interval timer
		var distance = endLocation - startLocation; // distance to travel
		var documentHeight = getDocumentHeight();
		var timeLapsed = 0;
		var percentage, position;

		// Update URL
		updateUrl(anchor, settings.updateURL);

		/**
		 * Stop the scroll animation when it reaches its target (or the bottom/top of page)
		 * @private
		 * @param {Number} position Current position on the page
		 * @param {Number} endLocation Scroll to location
		 * @param {Number} animationInterval How much to scroll on this loop
		 */
		var stopAnimateScroll = function (position, endLocation, animationInterval) {
			var currentLocation = root.pageYOffset;
			if ( position == endLocation || currentLocation == endLocation || ( (root.innerHeight + currentLocation) >= documentHeight ) ) {
				clearInterval(animationInterval);
				anchorElem.focus();
				settings.callbackAfter( toggle, anchor ); // Run callbacks after animation complete
			}
		};

		/**
		 * Loop scrolling animation
		 * @private
		 */
		var loopAnimateScroll = function () {
			timeLapsed += 16;
			percentage = ( timeLapsed / parseInt(settings.speed, 10) );
			percentage = ( percentage > 1 ) ? 1 : percentage;
			position = startLocation + ( distance * easingPattern(settings.easing, percentage) );
			root.scrollTo( 0, Math.floor(position) );
			stopAnimateScroll(position, endLocation, animationInterval);
		};

		/**
		 * Set interval timer
		 * @private
		 */
		var startAnimateScroll = function () {
			settings.callbackBefore( toggle, anchor ); // Run callbacks before animating scroll
			animationInterval = setInterval(loopAnimateScroll, 16);
		};

		/**
		 * Reset position to fix weird iOS bug
		 * @link https://github.com/cferdinandi/smooth-scroll/issues/45
		 */
		if ( root.pageYOffset === 0 ) {
			root.scrollTo( 0, 0 );
		}

		// Start scrolling animation
		startAnimateScroll();

	};

	/**
	 * If smooth scroll element clicked, animate scroll
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = getClosest(event.target, '[data-scroll]');
		if ( toggle && toggle.tagName.toLowerCase() === 'a' ) {
			event.preventDefault(); // Prevent default click event
			smoothScroll.animateScroll( toggle, toggle.hash, settings); // Animate scroll
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	smoothScroll.destroy = function () {
		if ( !settings ) return;
		document.removeEventListener( 'click', eventHandler, false );
		settings = null;
	};

	/**
	 * Initialize Smooth Scroll
	 * @public
	 * @param {Object} options User settings
	 */
	smoothScroll.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		smoothScroll.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults

		// When a toggle is clicked, run the click handler
		document.addEventListener('click', eventHandler, false);

	};


	//
	// Public APIs
	//

	return smoothScroll;

});