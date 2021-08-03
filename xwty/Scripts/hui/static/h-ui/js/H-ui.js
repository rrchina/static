!function(){
	if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
		var msViewportStyle = document.createElement("style");
		msViewportStyle.appendChild(
			document.createTextNode(
				"@-ms-viewport{width:auto!important}"
			)
		);
		document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
	}
} ();

function stopDefault(e) {
	if (e && e.preventDefault) e.preventDefault();
	else window.event.returnValue = false;
	return false;
}

/* =======================================================================
 * jQuery.cookie.js v1.4.1
 * https://github.com/carhartl/jQuery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 * ======================================================================== */
!(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}
(function($){
	var pluses = /\+/g;
	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}
	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}
	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}
	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}
	function read(s, converter) {
		var value = config.raw ? s: parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}
	var config = $.cookie = function(key, value, options) {
		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({},
			config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires,
				t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
			options.path ? '; path=' + options.path: '', options.domain ? '; domain=' + options.domain: '', options.secure ? '; secure': ''].join(''));
		}
		var result = key ? undefined: {},
		cookies = document.cookie ? document.cookie.split('; ') : [],
		i = 0,
		l = cookies.length;
		for (; i < l; i++) {
			var parts = cookies[i].split('='),
			name = decode(parts.shift()),
			cookie = parts.join('=');
			if (key === name) {
				result = read(cookie, value);
				break;
			}
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}
		return result;
	};
	config.defaults = {};
	$.removeCookie = function(key, options) {
		$.cookie(key, '', $.extend({},
		options, {
			expires: -1
		}));
		return ! $.cookie(key);
	};
}));

/* =======================================================================
 * jQuery.lazyload v1.9.3
 * Lazy Load - jQuery plugin for lazy loading images
 * Copyright (c) 2007-2013 Mika Tuupola
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * Project home: http://www.appelsiini.net/projects/lazyload
 * ======================================================================== */
! (function($, window, document, undefined) {
	var $window = $(window);
	$.fn.lazyload = function(options) {
		var elements = this;
		var $container;
		var settings = {
			threshold: 0,
			failure_limit: 0,
			event: "scroll",
			effect: "show",
			container: window,
			data_attribute: "original",
			skip_invisible: true,
			appear: null,
			load: null,
			placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
		};
		function update() {
			var counter = 0;
			elements.each(function() {
				var $this = $(this);
				if (settings.skip_invisible && !$this.is(":visible")) {
					return;
				}
				if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {
					/* Nothing. */
				} else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
					$this.trigger("appear");
					/* if we found an image we'll load, reset the counter */
					counter = 0;
				} else {
					if (++counter > settings.failure_limit) {
						return false;
					}
				}
			});
		}
		if (options) {
			/* Maintain BC for a couple of versions. */
			if (undefined !== options.failurelimit) {
				options.failure_limit = options.failurelimit;
				delete options.failurelimit;
			}
			if (undefined !== options.effectspeed) {
				options.effect_speed = options.effectspeed;
				delete options.effectspeed;
			}
			$.extend(settings, options);
		}

		/* Cache container as jQuery as object. */
		$container = (settings.container === undefined || settings.container === window) ? $window: $(settings.container);

		/* Fire one scroll event per scroll. Not one scroll event per image. */
		if (0 === settings.event.indexOf("scroll")) {
			$container.on(settings.event,
			function() {
				return update();
			});
		}
		this.each(function() {
			var self = this;
			var $self = $(self);
			self.loaded = false;

			/* If no src attribute given use data:uri. */
			if ($self.attr("src") === undefined || $self.attr("src") === false) {
				if ($self.is("img")) {
					$self.attr("src", settings.placeholder);
				}
			}

			/* When appear is triggered load original image. */
			$self.one("appear",
			function() {
				if (!this.loaded) {
					if (settings.appear) {
						var elements_left = elements.length;
						settings.appear.call(self, elements_left, settings);
					}
					$("<img />").on("load",
					function() {
						var original = $self.attr("data-" + settings.data_attribute);
						$self.hide();
						if ($self.is("img")) {
							$self.attr("src", original);
						} else {
							$self.css("background-image", "url('" + original + "')");
						}
						$self[settings.effect](settings.effect_speed);
						self.loaded = true;

						/* Remove image from array so it is not looped next time. */
						var temp = $.grep(elements,
						function(element) {
							return ! element.loaded;
						});
						elements = $(temp);
						if (settings.load) {
							var elements_left = elements.length;
							settings.load.call(self, elements_left, settings);
						}
					}).attr("src", $self.attr("data-" + settings.data_attribute));
				}
			});

			/* When wanted event is triggered load original image */
			/* by triggering appear.                              */
			if (0 !== settings.event.indexOf("scroll")) {
				$self.on(settings.event,
				function() {
					if (!self.loaded) {
						$self.trigger("appear");
					}
				});
			}
		});

		/* Check if something appears when window is resized. */
		$window.on("resize",
		function() {
			update();
		});

		/* With IOS5 force loading images when navigating with back button. */
		/* Non optimal workaround. */
		if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
			$window.on("pageshow",
			function(event) {
				if (event.originalEvent && event.originalEvent.persisted) {
					elements.each(function() {
						$(this).trigger("appear");
					});
				}
			});
		}

		/* Force initial check if images should appear. */
		$(document).ready(function() {
			update();
		});
		return this;
	};

	/* Convenience methods in jQuery namespace.           */
	/* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
	$.belowthefold = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = (window.innerHeight ? window.innerHeight: $window.height()) + $window.scrollTop();
		} else {
			fold = $(settings.container).offset().top + $(settings.container).height();
		}
		return fold <= $(element).offset().top - settings.threshold;
	};

	$.rightoffold = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = $window.width() + $window.scrollLeft();
		} else {
			fold = $(settings.container).offset().left + $(settings.container).width();
		}
		return fold <= $(element).offset().left - settings.threshold;
	};

	$.abovethetop = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = $window.scrollTop();
		} else {
			fold = $(settings.container).offset().top;
		}
		return fold >= $(element).offset().top + settings.threshold + $(element).height();
	};

	$.leftofbegin = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = $window.scrollLeft();
		} else {
			fold = $(settings.container).offset().left;
		}
		return fold >= $(element).offset().left + settings.threshold + $(element).width();
	};

	$.inviewport = function(element, settings) {
		return ! $.rightoffold(element, settings) && !$.leftofbegin(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
	};

	/* Custom selectors for your convenience.   */
	/* Use as $("img:below-the-fold").something() or */
	/* $("img").filter(":below-the-fold").something() which is faster */
	$.extend($.expr[":"], {
		"below-the-fold": function(a) {
			return $.belowthefold(a, {
				threshold: 0
			});
		},
		"above-the-top": function(a) {
			return ! $.belowthefold(a, {
				threshold: 0
			});
		},
		"right-of-screen": function(a) {
			return $.rightoffold(a, {
				threshold: 0
			});
		},
		"left-of-screen": function(a) {
			return ! $.rightoffold(a, {
				threshold: 0
			});
		},
		"in-viewport": function(a) {
			return $.inviewport(a, {
				threshold: 0
			});
		},
		/* Maintain BC for couple of versions. */
		"above-the-fold": function(a) {
			return ! $.belowthefold(a, {
				threshold: 0
			});
		},
		"right-of-fold": function(a) {
			return $.rightoffold(a, {
				threshold: 0
			});
		},
		"left-of-fold": function(a) {
			return ! $.rightoffold(a, {
				threshold: 0
			});
		}
	});
})(jQuery, window, document);

/* =======================================================================
* jQuery.responsive-nav.js v1.0.39
* https://github.com/viljamis/responsive-nav.js
* http://responsive-nav.com
*
* Copyright (c) 2015 @viljamis
* Available under the MIT license
 * ======================================================================== */
/* global Event */
(function(document, window, index) {
	// Index is used to keep multiple navs on the same page namespaced
	"use strict";
	var responsiveNav = function(el, options) {
		var computed = !!window.getComputedStyle;

		/**
		* getComputedStyle polyfill for old browsers
		*/
		if (!computed) {
			window.getComputedStyle = function(el) {
				this.el = el;
				this.getPropertyValue = function(prop) {
					var re = /(\-([a-z]){1})/g;
					if (prop === "float") {
						prop = "styleFloat";
					}
					if (re.test(prop)) {
						prop = prop.replace(re,
						function() {
							return arguments[2].toUpperCase();
						});
					}
					return el.currentStyle[prop] ? el.currentStyle[prop] : null;
				};
				return this;
			};
		}
		/* exported addEvent, removeEvent, getChildren, setAttributes, addClass, removeClass, forEach */

		/**
		* Add Event
		* fn arg can be an object or a function, thanks to handleEvent
		* read more at: http://www.thecssninja.com/javascript/handleevent
		*
		* @param  {element}  element
		* @param  {event}    event
		* @param  {Function} fn
		* @param  {boolean}  bubbling
		*/
		var addEvent = function(el, evt, fn, bubble) {
			if ("addEventListener" in el) {
				// BBOS6 doesn't support handleEvent, catch and polyfill
				try {
					el.addEventListener(evt, fn, bubble);
				} catch(e) {
					if (typeof fn === "object" && fn.handleEvent) {
						el.addEventListener(evt,
						function(e) {
							// Bind fn as this and set first arg as event object
							fn.handleEvent.call(fn, e);
						},
						bubble);
					} else {
						throw e;
					}
				}
			} else if ("attachEvent" in el) {
				// check if the callback is an object and contains handleEvent
				if (typeof fn === "object" && fn.handleEvent) {
					el.attachEvent("on" + evt,
					function() {
						// Bind fn as this
						fn.handleEvent.call(fn);
					});
				} else {
					el.attachEvent("on" + evt, fn);
				}
			}
		},

		/**
	* Remove Event
	*
	* @param  {element}  element
	* @param  {event}    event
	* @param  {Function} fn
	* @param  {boolean}  bubbling
	*/
		removeEvent = function(el, evt, fn, bubble) {
			if ("removeEventListener" in el) {
				try {
					el.removeEventListener(evt, fn, bubble);
				} catch(e) {
					if (typeof fn === "object" && fn.handleEvent) {
						el.removeEventListener(evt,
						function(e) {
							fn.handleEvent.call(fn, e);
						},
						bubble);
					} else {
						throw e;
					}
				}
			} else if ("detachEvent" in el) {
				if (typeof fn === "object" && fn.handleEvent) {
					el.detachEvent("on" + evt,
					function() {
						fn.handleEvent.call(fn);
					});
				} else {
					el.detachEvent("on" + evt, fn);
				}
			}
		},

		/**
	* Get the children of any element
	*
	* @param  {element}
	* @return {array} Returns matching elements in an array
	*/
		getChildren = function(e) {
			if (e.children.length < 1) {
				throw new Error("The Nav container has no containing elements");
			}
			// Store all children in array
			var children = [];
			// Loop through children and store in array if child != TextNode
			for (var i = 0; i < e.children.length; i++) {
				if (e.children[i].nodeType === 1) {
					children.push(e.children[i]);
				}
			}
			return children;
		},

		/**
	* Sets multiple attributes at once
	*
	* @param {element} element
	* @param {attrs}   attrs
	*/
		setAttributes = function(el, attrs) {
			for (var key in attrs) {
				el.setAttribute(key, attrs[key]);
			}
		},

		/**
	* Adds a class to any element
	*
	* @param {element} element
	* @param {string}  class
	*/
		addClass = function(el, cls) {
			if (el.className.indexOf(cls) !== 0) {
				el.className += " " + cls;
				el.className = el.className.replace(/(^\s*)|(\s*$)/g, "");
			}
		},

		/**
	* Remove a class from any element
	*
	* @param  {element} element
	* @param  {string}  class
	*/
		removeClass = function(el, cls) {
			var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
			el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g, "");
		},

		/**
	* forEach method that passes back the stuff we need
	*
	* @param  {array}    array
	* @param  {Function} callback
	* @param  {scope}    scope
	*/
		forEach = function(array, callback, scope) {
			for (var i = 0; i < array.length; i++) {
				callback.call(scope, i, array[i]);
			}
		};

		var nav, opts, navToggle, styleElement = document.createElement("style"),
		htmlEl = document.documentElement,
		hasAnimFinished,
		isMobile,
		navOpen;

		var ResponsiveNav = function(el, options) {
			var i;

			/**
		* Default options
		* @type {Object}
		*/
			this.options = {
				animate: true,
				// Boolean: Use CSS3 transitions, true or false
				transition: 284,
				// Integer: Speed of the transition, in milliseconds
				label: "Menu",
				// String: Label for the navigation toggle
				insert: "before",
				// String: Insert the toggle before or after the navigation
				customToggle: "",
				// Selector: Specify the ID of a custom toggle
				closeOnNavClick: false,
				// Boolean: Close the navigation when one of the links are clicked
				openPos: "relative",
				// String: Position of the opened nav, relative or static
				navClass: "nav-collapse",
				// String: Default CSS class. If changed, you need to edit the CSS too!
				navActiveClass: "js-nav-active",
				// String: Class that is added to <html> element when nav is active
				jsClass: "js",
				// String: 'JS enabled' class which is added to <html> element
				init: function() {},
				// Function: Init callback
				open: function() {},
				// Function: Open callback
				close: function() {} // Function: Close callback
			};

			// User defined options
			for (i in options) {
				this.options[i] = options[i];
			}

			// Adds "js" class for <html>
			addClass(htmlEl, this.options.jsClass);

			// Wrapper
			this.wrapperEl = el.replace("#", "");

			// Try selecting ID first
			if (document.getElementById(this.wrapperEl)) {
				this.wrapper = document.getElementById(this.wrapperEl);

				// If element with an ID doesn't exist, use querySelector
			} else if (document.querySelector(this.wrapperEl)) {
				this.wrapper = document.querySelector(this.wrapperEl);

				// If element doesn't exists, stop here.
			} else {
				throw new Error("The nav element you are trying to select doesn't exist");
			}

			// Inner wrapper
			this.wrapper.inner = getChildren(this.wrapper);

			// For minification
			opts = this.options;
			nav = this.wrapper;

			// Init
			this._init(this);
		};

		ResponsiveNav.prototype = {

			/**
		* Unattaches events and removes any classes that were added
		*/
			destroy: function() {
				this._removeStyles();
				removeClass(nav, "closed");
				removeClass(nav, "opened");
				removeClass(nav, opts.navClass);
				removeClass(nav, opts.navClass + "-" + this.index);
				removeClass(htmlEl, opts.navActiveClass);
				nav.removeAttribute("style");
				nav.removeAttribute("aria-hidden");

				removeEvent(window, "resize", this, false);
				removeEvent(window, "focus", this, false);
				removeEvent(document.body, "touchmove", this, false);
				removeEvent(navToggle, "touchstart", this, false);
				removeEvent(navToggle, "touchend", this, false);
				removeEvent(navToggle, "mouseup", this, false);
				removeEvent(navToggle, "keyup", this, false);
				removeEvent(navToggle, "click", this, false);

				if (!opts.customToggle) {
					navToggle.parentNode.removeChild(navToggle);
				} else {
					navToggle.removeAttribute("aria-hidden");
				}
			},

			/**
		* Toggles the navigation open/close
		*/
			toggle: function() {
				if (hasAnimFinished === true) {
					if (!navOpen) {
						this.open();
					} else {
						this.close();
					}
				}
			},

			/**
		* Opens the navigation
		*/
			open: function() {
				if (!navOpen) {
					removeClass(nav, "closed");
					addClass(nav, "opened");
					addClass(htmlEl, opts.navActiveClass);
					addClass(navToggle, "active");
					nav.style.position = opts.openPos;
					setAttributes(nav, {
						"aria-hidden": "false"
					});
					navOpen = true;
					opts.open();
				}
			},

			/**
		* Closes the navigation
		*/
			close: function() {
				if (navOpen) {
					addClass(nav, "closed");
					removeClass(nav, "opened");
					removeClass(htmlEl, opts.navActiveClass);
					removeClass(navToggle, "active");
					setAttributes(nav, {
						"aria-hidden": "true"
					});

					// If animations are enabled, wait until they finish
					if (opts.animate) {
						hasAnimFinished = false;
						setTimeout(function() {
							nav.style.position = "absolute";
							hasAnimFinished = true;
						},
						opts.transition + 10);

						// Animations aren't enabled, we can do these immediately
					} else {
						nav.style.position = "absolute";
					}

					navOpen = false;
					opts.close();
				}
			},

			/**
		* Resize is called on window resize and orientation change.
		* It initializes the CSS styles and height calculations.
		*/
			resize: function() {

				// Resize watches navigation toggle's display state
				if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {

					isMobile = true;
					setAttributes(navToggle, {
						"aria-hidden": "false"
					});

					// If the navigation is hidden
					if (nav.className.match(/(^|\s)closed(\s|$)/)) {
						setAttributes(nav, {
							"aria-hidden": "true"
						});
						nav.style.position = "absolute";
					}

					this._createStyles();
					this._calcHeight();
				} else {
					isMobile = false;
					setAttributes(navToggle, {
						"aria-hidden": "true"
					});
					setAttributes(nav, {
						"aria-hidden": "false"
					});
					nav.style.position = opts.openPos;
					this._removeStyles();
				}
			},

			/**
		* Takes care of all even handling
		*
		* @param  {event} event
		* @return {type} returns the type of event that should be used
		*/
			handleEvent: function(e) {
				var evt = e || window.event;
				switch (evt.type) {
				case "touchstart":
					this._onTouchStart(evt);
					break;
				case "touchmove":
					this._onTouchMove(evt);
					break;
				case "touchend":
				case "mouseup":
					this._onTouchEnd(evt);
					break;
				case "click":
					this._preventDefault(evt);
					break;
				case "keyup":
					this._onKeyUp(evt);
					break;
				case "focus":
				case "resize":
					this.resize(evt);
					break;
				}
			},

			/**
		* Initializes the widget
		*/
			_init: function() {
				this.index = index++;

				addClass(nav, opts.navClass);
				addClass(nav, opts.navClass + "-" + this.index);
				addClass(nav, "closed");
				hasAnimFinished = true;
				navOpen = false;

				this._closeOnNavClick();
				this._createToggle();
				this._transitions();
				this.resize();

				/**
			* On IE8 the resize event triggers too early for some reason
			* so it's called here again on init to make sure all the
			* calculated styles are correct.
			*/
				var self = this;
				setTimeout(function() {
					self.resize();
				},
				20);

				addEvent(window, "resize", this, false);
				addEvent(window, "focus", this, false);
				addEvent(document.body, "touchmove", this, false);
				addEvent(navToggle, "touchstart", this, false);
				addEvent(navToggle, "touchend", this, false);
				addEvent(navToggle, "mouseup", this, false);
				addEvent(navToggle, "keyup", this, false);
				addEvent(navToggle, "click", this, false);

				/**
			* Init callback here
			*/
				opts.init();
			},

			/**
		* Creates Styles to the <head>
		*/
			_createStyles: function() {
				if (!styleElement.parentNode) {
					styleElement.type = "text/css";
					document.getElementsByTagName("head")[0].appendChild(styleElement);
				}
			},

			/**
		* Removes styles from the <head>
		*/
			_removeStyles: function() {
				if (styleElement.parentNode) {
					styleElement.parentNode.removeChild(styleElement);
				}
			},

			/**
		* Creates Navigation Toggle
		*/
			_createToggle: function() {
				// If there's no toggle, let's create one
				if (!opts.customToggle) {
					var toggle = document.createElement("a");
					toggle.innerHTML = opts.label;
					setAttributes(toggle, {
						"href": "#",
						"class": "nav-toggle"
					});

					// Determine where to insert the toggle
					if (opts.insert === "after") {
						nav.parentNode.insertBefore(toggle, nav.nextSibling);
					} else {
						nav.parentNode.insertBefore(toggle, nav);
					}

					navToggle = toggle;

					// There is a toggle already, let's use that one
				} else {
					var toggleEl = opts.customToggle.replace("#", "");

					if (document.getElementById(toggleEl)) {
						navToggle = document.getElementById(toggleEl);
					} else if (document.querySelector(toggleEl)) {
						navToggle = document.querySelector(toggleEl);
					} else {
						throw new Error("The custom nav toggle you are trying to select doesn't exist");
					}
				}
			},

			/**
		* Closes the navigation when a link inside is clicked.
		*/
			_closeOnNavClick: function() {
				if (opts.closeOnNavClick) {
					var links = nav.getElementsByTagName("a"),
					self = this;
					forEach(links,
					function(i, el) {
						addEvent(links[i], "click",
						function() {
							if (isMobile) {
								self.toggle();
							}
						},
						false);
					});
				}
			},

			/**
		* Prevents the default functionality.
		*
		* @param  {event} event
		*/
			_preventDefault: function(e) {
				if (e.preventDefault) {
					if (e.stopImmediatePropagation) {
						e.stopImmediatePropagation();
					}
					e.preventDefault();
					e.stopPropagation();
					return false;

					// This is strictly for old IE
				} else {
					e.returnValue = false;
				}
			},

			/**
		* On touch start we get the location of the touch.
		*
		* @param  {event} event
		*/
			_onTouchStart: function(e) {
				if (!Event.prototype.stopImmediatePropagation) {
					this._preventDefault(e);
				}
				this.startX = e.touches[0].clientX;
				this.startY = e.touches[0].clientY;
				this.touchHasMoved = false;

				/**
			* Remove mouseup event completely here to avoid
			* double triggering the event.
			*/
				removeEvent(navToggle, "mouseup", this, false);
			},

			/**
		* Check if the user is scrolling instead of tapping.
		*
		* @param  {event} event
		*/
			_onTouchMove: function(e) {
				if (Math.abs(e.touches[0].clientX - this.startX) > 10 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
					this.touchHasMoved = true;
				}
			},

			/**
		* On touch end toggle the navigation.
		*
		* @param  {event} event
		*/
			_onTouchEnd: function(e) {
				this._preventDefault(e);
				if (!isMobile) {
					return;
				}

				// If the user isn't scrolling
				if (!this.touchHasMoved) {

					// If the event type is touch
					if (e.type === "touchend") {
						this.toggle();
						return;

						// Event type was click, not touch
					} else {
						var evt = e || window.event;

						// If it isn't a right click, do toggling
						if (! (evt.which === 3 || evt.button === 2)) {
							this.toggle();
						}
					}
				}
			},

			/**
		* For keyboard accessibility, toggle the navigation on Enter
		* keypress too.
		*
		* @param  {event} event
		*/
			_onKeyUp: function(e) {
				var evt = e || window.event;
				if (evt.keyCode === 13) {
					this.toggle();
				}
			},

			/**
		* Adds the needed CSS transitions if animations are enabled
		*/
			_transitions: function() {
				if (opts.animate) {
					var objStyle = nav.style,
					transition = "max-height " + opts.transition + "ms";
					objStyle.WebkitTransition = objStyle.MozTransition = objStyle.OTransition = objStyle.transition = transition;
				}
			},

			/**
		* Calculates the height of the navigation and then creates
		* styles which are later added to the page <head>
		*/
			_calcHeight: function() {
				var savedHeight = 0;
				for (var i = 0; i < nav.inner.length; i++) {
					savedHeight += nav.inner[i].offsetHeight;
				}
				var innerStyles = "." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened{max-height:" + savedHeight + "px !important} ." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened.dropdown-active {max-height:9999px !important}";
				if (styleElement.styleSheet) {
					styleElement.styleSheet.cssText = innerStyles;
				} else {
					styleElement.innerHTML = innerStyles;
				}
				innerStyles = "";
			}
		};
		/**
		* Return new Responsive Nav
		*/
		return new ResponsiveNav(el, options);
	};
	if (typeof module !== "undefined" && module.exports) {
		module.exports = responsiveNav;
	} else {
		window.responsiveNav = responsiveNav;
	}
} (document, window, 0));

/* =======================================================================
 * jQuery.placeholder.js 兼容性处理
 * ======================================================================== */
!function(window, document, $) {
	var isInputSupported = 'placeholder' in document.createElement('input');
	var isTextareaSupported = 'placeholder' in document.createElement('textarea');
	var prototype = $.fn;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;

	if (isInputSupported && isTextareaSupported) {
		placeholder = prototype.placeholder = function() {
			return this;
		};
		placeholder.input = placeholder.textarea = true;
	} else {
		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this.filter((isInputSupported ? 'textarea': ':input') + '[placeholder]').not('.placeholder').on({
				'focus.placeholder': clearPlaceholder,
				'blur.placeholder': setPlaceholder
			}).data('placeholder-enabled', true).trigger('blur.placeholder');
			return $this;
		};
		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;
		hooks = {
			'get': function(element) {
				var $element = $(element);
				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}
				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '': element.value;
			},
			'set': function(element, value) {
				var $element = $(element);
				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}
				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					if (element != safeActiveElement()) {
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			$(document).delegate('form', 'submit.placeholder',
			function() {
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				},
				10);
			});
		});

		$(window).on('beforeunload.placeholder',
		function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});
	}

	function args(elem) {
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes,
		function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == safeActiveElement() && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().prop('type', 'text');
					} catch(e) {
						$replacement = $('<input>').prop($.extend(args(this), {
							'type': 'text'
						}));
					}
					$replacement.removeAttr('name').data({
						'placeholder-password': $input,
						'placeholder-id': id
					}).on('focus.placeholder', clearPlaceholder);
					$input.data({
						'placeholder-textinput': $replacement,
						'placeholder-id': id
					}).before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch(exception) {}
	}
} (this, document, jQuery);

/* =======================================================================
 * jquery.emailsuggest.js v1.0 邮箱自动提示
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
!function($) {
	var
	// 插件名
	plugin = 'emailsuggest',

	// 默认参数配置
	defaults = {
		sugClass: 'emailSug',
		domains: ['163.com', '126.com', 'sohu.com', '139.com', 'sina.com', 'qq.com', 'gmail.com']
	};

	function EmailSug(elem, options) {
		this.$field = $(elem);
		this.options = $.extend(true, {},
		defaults, options);
		this._defaults = defaults;
		this._domains = this.options.domains;
		// 当前选中元素下标
		this.selectedIndex = 0;

		this.init();
	}

	EmailSug.prototype = {
		init: function() {
			this.addEvent();
		},

		addEvent: function() {
			var that = this,
			value;

			this.$field.on('keyup.ema',
			function(e) {
				value = $.trim(this.value);

				if (value) {
					that.create(this, value);
					that.doSelect(e.keyCode);
				} else {
					that.hide();
				}
			}).on('blur.ema',
			function() {
				setTimeout(function() {
					that.hide();
				},
				200);
			});
		},
		create: function(elem, value) {
			var that = this,
			arr, len, fragment, ul = [],
			offset,
			left,
			top,
			width,
			height,
			style,
			// 左右边框
			borderWidth = 2;

			elem = $(elem);
			offset = elem.offset();
			width = elem.outerWidth(true) - borderWidth;
			height = elem.outerHeight(true);
			left = offset.left;
			top = offset.top + height;
			style = 'left: ' + left + 'px; top: ' + top + 'px; width: ' + width + 'px; border: 1px solid #e2e2e2; border-top: 0; display: none';
			fragment = $('<div class="' + this.options.sugClass + '-wrapper" style="' + style + '" />');
			ul.push('<ul class="' + this.options.sugClass + '-list">');

			arr = this.filter(value, this._domains);
			len = arr.length;
			$.each(arr,
			function(i, domain) {
				var _class = that.options.sugClass + '-item';

				if (that.selectedIndex > len - 1) {
					if (i === 0) {
						_class += ' active';
						that.selectedIndex = 0;
					}
				} else {
					if (i === that.selectedIndex) {
						_class += ' active';
					}
				}
				ul.push('<li class="' + _class + '" data-index="' + i + '">' + value.replace(/@.*/, '') + '@' + domain + '</li>');
			});

			ul.push('</ul>');
			ul = ul.join('');
			if (this.$suggest) {
				this.$suggest.empty();
				this.$suggest.append(ul);
			} else {
				fragment.append(ul);
				// 显示到页面
				$('body').append(fragment);
				this.$suggest = fragment;
				this.$suggest.on('mouseenter click', '.' + this.options.sugClass + '-item',
				function(e) {
					var lis, li;
					li = $(this);
					lis = li.parent().children();
					if (e.type === 'mouseenter') {
						li.addClass('active').siblings().removeClass('active');
						that.selectedIndex = $.inArray(this, lis);
					} else {
						// 当前选中
						that.$field.val(lis.eq(that.selectedIndex).text());
						// 隐藏email sug
						that.hide();
					}
				});
			}
			this.show();
		},

		doSelect: function(keyCode) {
			var elems = $('.' + this.options.sugClass + '-item', this.$suggest),
			min = 0,
			max = elems.length - 1;
			switch (keyCode) {
			case 13:
				// 回车选中当前已选项
				$('li.active', this.$suggest).trigger('click');

				// 下标重置
				this.selectedIndex = 0;

				break;
				// 向上
			case 38:
				this.selectedIndex--;

				if (this.selectedIndex < min) {
					this.selectedIndex = max;
				}

				elems.removeClass('active').eq(this.selectedIndex).addClass('active');
				break;
				// 向下
			case 40:
				this.selectedIndex++;

				if (this.selectedIndex > max) {
					this.selectedIndex = min;
				}

				elems.removeClass('active').eq(this.selectedIndex).addClass('active');
				break;
			default:
				break;
			}
		},
		filter: function(value, arr) {
			var start, suffix, r = [];

			start = value.indexOf('@');
			if (start > -1) {
				suffix = value.substring(start + 1);
				$.each(arr,
				function(i, str) {
					if (str.indexOf(suffix) > -1) {
						r.push(str);
					}
				});
			} else {
				r = arr;
			}
			return r;
		},
		show: function() {
			if (this.$suggest) {
				this.$suggest.show();
			}
		},

		hide: function() {
			if (this.$suggest) {
				this.$suggest.hide();
			}
		}
	}

	$.fn[plugin] = function(options) {
		return this.each(function() {
			if (!$.data(this, plugin)) {
				$.data(this, plugin, new EmailSug(this, options));
			}
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huispinner.js v2.1.2 微调器
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.06.26
 *
 * Copyright 2017 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huispinner = function(options, callback) {
		var defaults = {
			value : 1,
			minValue : 1,
			maxValue : 999,
			dis : 1,
		}
		var options = $.extend(defaults, options);
		var keyCodes = {
			up : 38,
			down : 40
		}

		this.each(function() {
			var that = $(this);
			var str = '<div class="spinner">'
					+ '<a class="subtract" href="javascript:void(0)"><i>-</i></a>'
					+ '<input class="amount input-text" value="'
					+ options.value + '" autocomplete="off">'
					+ '<a class="add" href="javascript:void(0)"><i>+</i></a>'
					+ '</div>';
			that.append(str);

			var input = that.find(".input-text"),
				subtract = that.find(".subtract"),
				add = that.find(".add"),
				value = parseInt(input.val());

			if (value <= options.minValue) {
				subtract.addClass("disabled");
				add.removeClass("disabled");
			}
			if (value >= options.maxValue) {
				subtract.removeClass("disabled");
				add.addClass("disabled");
			}

			// 输入框失去焦点
			input.on('blur', function() {
				var v = $(this).val();
				v = v.replace(/[^\d]/g, "");
				v = v.replace(/\b(0+)/gi, "");

				if (v != "") {
					if (v > options.minValue && v < options.maxValue) {
						input.val(v)
						add.removeClass("disabled");
						subtract.removeClass("disabled");
					} else {
						if (v <= options.minValue) {
							input.val(options.minValue);
							subtract.addClass("disabled");
							add.removeClass("disabled");
						} else {
							input.val(options.maxValue);
							subtract.removeClass("disabled");
							add.addClass("disabled");
						}
					}
				} else {
					$(this).val(options.minValue);
					subtract.addClass("disabled");
					add.removeClass("disabled");
				}
				if (callback) {
					callback(input.val());
				}
			});

			// 上下方向键
			input.on("keydown", function(e) {
				var evt = e || window.event;
				if (evt.keyCode === keyCodes.up) {
					subtract.trigger("click");
					evt.returnValue = false;
				}
				if (evt.keyCode === keyCodes.down) {
					add.trigger("click");
					evt.returnValue = false;
				}
			});

			// 减
			subtract.on('click', function() {
				var goodsCount = parseInt(input.val());
				input.val(goodsCount <= options.minValue
						? options.minValue
						: goodsCount - options.dis);
				add.removeClass("disabled");
				if (input.val() <= options.minValue) {
					input.val(options.minValue)
					subtract.addClass("disabled");
				}
				if (callback) {
					callback(input.val());
				}
			});

			// 加
			add.on('click', function() {
				var goodsCount = parseInt(input.val());
				input.val(goodsCount >= options.maxValue
						? options.maxValue
						: goodsCount + options.dis);
				subtract.removeClass("disabled");

				if (input.val() >= options.maxValue) {
					input.val(options.maxValue);
					add.addClass("disabled");
				}
				if (callback) {
					callback(input.val());
				}
			});
		});
	}
}(window.jQuery);

/* =======================================================================
 * jQuery.Huiloading.js v1.0 Huiloading
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.07.18
 *
 * Copyright 2017 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.Huiloading =  {
		show:function(messages){
			if ($(".loading-wrapper").length > 0) {
				$(".loading-wrapper").remove();
			}
			if( messages == null ) messages = '';
			var htmlstr = '<div class="loading-wrapper"><div class="loading-content"><i class="iconpic iconpic-loading"></i> <span>'+messages+'</span></div></div>';
			$(document.body).append(htmlstr);
			var w = $(".loading-wrapper .loading-content").width()+40;
			$(".loading-wrapper .loading-content").css({
				"margin-left":-(w/2)+"px",
			});
		},
		hide:function(){
			$(".loading-wrapper").remove();
		}
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.HuicheckAll.js v1.0 Huiloading
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2019.07.01
 *
 * Copyright 2019 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
// 全选与反选 2019.7.1 14:28 @guojunhui
!function($) {
  $.fn.HuicheckAll = function(options,callback) {
    var defaults = {
      checkboxAll: 'thead input[type="checkbox"]',
      checkbox: 'tbody input[type="checkbox"]'
    }
    var options = $.extend(defaults, options);
    this.each(function(){
      var that = $(this);
      var checkboxAll = that.find(options.checkboxAll);
      var checkbox = that.find(options.checkbox);

      checkboxAll.on("click",function(){
        var isChecked = checkboxAll.prop("checked");
        checkbox.prop("checked", isChecked);
        var _Num = 0,checkedArr = [];
        checkbox.each(function(){
          if($(this).prop("checked")) {
            checkedArr.push($(this).val());
            _Num++;
          }
        });
        var checkedInfo = {
          Number: _Num,
          checkedArr: checkedArr
        }
        if(callback){
          callback(checkedInfo);
        }
      });

      checkbox.on("click",function(){
        var allLength = checkbox.length;
        var checkedLength = checkbox.prop("checked").length;
        allLength == checkedLength ? checkboxAll.prop("checked",true) : checkboxAll.prop("checked",false);
        var _Num = 0,checkedArr = [];
        checkbox.each(function(){
          if($(this).prop("checked")) {
            checkedArr.push($(this).val());
            _Num++;
          }
        });
        var checkedInfo = {
          Number: _Num,
          checkedArr: checkedArr
        }
        if(callback){
          callback(checkedInfo);
        }
      });
    });
  }
} (window.jQuery);

/* =======================================================================
 * jQuery.format.js 金额格式化
 * ========================================================================*/
!function($) {
	$.extend({
		format: function(str, step, splitor) {
			str = str.toString();
			var len = str.length;

			if (len > step) {
				var l1 = len % step,
				l2 = parseInt(len / step),
				arr = [],
				first = str.substr(0, l1);
				if (first != '') {
					arr.push(first);
				};
				for (var i = 0; i < l2; i++) {
					arr.push(str.substr(l1 + i * step, step));
				};
				str = arr.join(splitor);
			};
			return str;
		}
	});
} (window.jQuery);

/* =======================================================================
 * jquery.togglePassword.js 隐藏显示密码
 * type="password"
 * ========================================================================*/
!function($) {
	$.fn.togglePassword = function(options) {
		var s = $.extend($.fn.togglePassword.defaults, options),
		input = $(this);

		$(s.el).on(s.ev,
		function() {
			"password" == $(input).attr("type") ? $(input).attr("type", "text") : $(input).attr("type", "password");
		});
	};

	$.fn.togglePassword.defaults = {
		ev: "click"
	};
} (window.jQuery);

/* =======================================================================
 * jQuery.iCheck.js v1.0.2, http://git.io/arlzeA
 * Powerful jQuery and Zepto plugin for checkboxes and radio buttons customization
 *
 * (c) 2013 Damir Sultanov, http://fronteed.com
 * MIT Licensed
 * ======================================================================== */
!(function($) {
	// Cached vars
	var _iCheck = 'iCheck',
	_iCheckHelper = _iCheck + '-helper',
	_checkbox = 'checkbox',
	_radio = 'radio',
	_checked = 'checked',
	_unchecked = 'un' + _checked,
	_disabled = 'disabled',
	_determinate = 'determinate',
	_indeterminate = 'in' + _determinate,
	_update = 'update',
	_type = 'type',
	_click = 'click',
	_touch = 'touchbegin.i touchend.i',
	_add = 'addClass',
	_remove = 'removeClass',
	_callback = 'trigger',
	_label = 'label',
	_cursor = 'cursor',
	_mobile = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);

	// Plugin init
	$.fn[_iCheck] = function(options, fire) {
		// Walker
		var handle = 'input[type="' + _checkbox + '"], input[type="' + _radio + '"]',
		stack = $(),
		walker = function(object) {
			object.each(function() {
				var self = $(this);

				if (self.is(handle)) {
					stack = stack.add(self);
				} else {
					stack = stack.add(self.find(handle));
				}
			});
		};

		// Check if we should operate with some method
		if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(options)) {

			// Normalize method's name
			options = options.toLowerCase();

			// Find checkboxes and radio buttons
			walker(this);

			return stack.each(function() {
				var self = $(this);

				if (options == 'destroy') {
					tidy(self, 'ifDestroyed');
				} else {
					operate(self, true, options);
				}

				// Fire method's callback
				if ($.isFunction(fire)) {
					fire();
				}
			});

			// Customization
		} else if (typeof options == 'object' || !options) {

			// Check if any options were passed
			var settings = $.extend({
				checkedClass: _checked,
				disabledClass: _disabled,
				indeterminateClass: _indeterminate,
				labelHover: true
			},
			options),

			selector = settings.handle,
			hoverClass = settings.hoverClass || 'hover',
			focusClass = settings.focusClass || 'focus',
			activeClass = settings.activeClass || 'active',
			labelHover = !!settings.labelHover,
			labelHoverClass = settings.labelHoverClass || 'hover',

			// Setup clickable area
			area = ('' + settings.increaseArea).replace('%', '') | 0;

			// Selector limit
			if (selector == _checkbox || selector == _radio) {
				handle = 'input[type="' + selector + '"]';
			}

			// Clickable area limit
			if (area < -50) {
				area = -50;
			}

			// Walk around the selector
			walker(this);

			return stack.each(function() {
				var self = $(this);

				// If already customized
				tidy(self);

				var node = this,
				id = node.id,

				// Layer styles
				offset = -area + '%',
				size = 100 + (area * 2) + '%',
				layer = {
					position: 'absolute',
					top: offset,
					left: offset,
					display: 'block',
					width: size,
					height: size,
					margin: 0,
					padding: 0,
					background: '#fff',
					border: 0,
					opacity: 0
				},

				// Choose how to hide input
				hide = _mobile ? {
					position: 'absolute',
					visibility: 'hidden'
				}: area ? layer: {
					position: 'absolute',
					opacity: 0
				},

				// Get proper class
				className = node[_type] == _checkbox ? settings.checkboxClass || 'i' + _checkbox: settings.radioClass || 'i' + _radio,

				// Find assigned labels
				label = $(_label + '[for="' + id + '"]').add(self.closest(_label)),

				// Check ARIA option
				aria = !!settings.aria,

				// Set ARIA placeholder
				ariaID = _iCheck + '-' + Math.random().toString(36).substr(2, 6),

				// Parent & helper
				parent = '<div class="' + className + '" ' + (aria ? 'role="' + node[_type] + '" ': ''),
				helper;

				// Set ARIA "labelledby"
				if (aria) {
					label.each(function() {
						parent += 'aria-labelledby="';

						if (this.id) {
							parent += this.id;
						} else {
							this.id = ariaID;
							parent += ariaID;
						}

						parent += '"';
					});
				}

				// Wrap input
				parent = self.wrap(parent + '/>')[_callback]('ifCreated').parent().append(settings.insert);

				// Layer addition
				helper = $('<ins class="' + _iCheckHelper + '"/>').css(layer).appendTo(parent);

				// Finalize customization
				self.data(_iCheck, {
					o: settings,
					s: self.attr('style')
				}).css(hide); !! settings.inheritClass && parent[_add](node.className || ''); !! settings.inheritID && id && parent.attr('id', _iCheck + '-' + id);
				parent.css('position') == 'static' && parent.css('position', 'relative');
				operate(self, true, _update);

				// Label events
				if (label.length) {
					label.on(_click + '.i mouseover.i mouseout.i ' + _touch,
					function(event) {
						var type = event[_type],
						item = $(this);

						// Do nothing if input is disabled
						if (!node[_disabled]) {

							// Click
							if (type == _click) {
								if ($(event.target).is('a')) {
									return;
								}
								operate(self, false, true);

								// Hover state
							} else if (labelHover) {

								// mouseout|touchend
								if (/ut|nd/.test(type)) {
									parent[_remove](hoverClass);
									item[_remove](labelHoverClass);
								} else {
									parent[_add](hoverClass);
									item[_add](labelHoverClass);
								}
							}

							if (_mobile) {
								event.stopPropagation();
							} else {
								return false;
							}
						}
					});
				}

				// Input events
				self.on(_click + '.i focus.i blur.i keyup.i keydown.i keypress.i',
				function(event) {
					var type = event[_type],
					key = event.keyCode;

					// Click
					if (type == _click) {
						return false;

						// Keydown
					} else if (type == 'keydown' && key == 32) {
						if (! (node[_type] == _radio && node[_checked])) {
							if (node[_checked]) {
								off(self, _checked);
							} else {
								on(self, _checked);
							}
						}

						return false;

						// Keyup
					} else if (type == 'keyup' && node[_type] == _radio) { ! node[_checked] && on(self, _checked);

						// Focus/blur
					} else if (/us|ur/.test(type)) {
						parent[type == 'blur' ? _remove: _add](focusClass);
					}
				});

				// Helper events
				helper.on(_click + ' mousedown mouseup mouseover mouseout ' + _touch,
				function(event) {
					var type = event[_type],

					// mousedown|mouseup
					toggle = /wn|up/.test(type) ? activeClass: hoverClass;

					// Do nothing if input is disabled
					if (!node[_disabled]) {

						// Click
						if (type == _click) {
							operate(self, false, true);

							// Active and hover states
						} else {

							// State is on
							if (/wn|er|in/.test(type)) {

								// mousedown|mouseover|touchbegin
								parent[_add](toggle);

								// State is off
							} else {
								parent[_remove](toggle + ' ' + activeClass);
							}

							// Label hover
							if (label.length && labelHover && toggle == hoverClass) {

								// mouseout|touchend
								label[/ut|nd/.test(type) ? _remove: _add](labelHoverClass);
							}
						}

						if (_mobile) {
							event.stopPropagation();
						} else {
							return false;
						}
					}
				});
			});
		} else {
			return this;
		}
	};

	// Do something with inputs
	function operate(input, direct, method) {
		var node = input[0],
		state = /er/.test(method) ? _indeterminate: /bl/.test(method) ? _disabled: _checked,
		active = method == _update ? {
			checked: node[_checked],
			disabled: node[_disabled],
			indeterminate: input.attr(_indeterminate) == 'true' || input.attr(_determinate) == 'false'
		}: node[state];

		// Check, disable or indeterminate
		if (/^(ch|di|in)/.test(method) && !active) {
			on(input, state);

			// Uncheck, enable or determinate
		} else if (/^(un|en|de)/.test(method) && active) {
			off(input, state);

			// Update
		} else if (method == _update) {

			// Handle states
			for (var each in active) {
				if (active[each]) {
					on(input, each, true);
				} else {
					off(input, each, true);
				}
			}

		} else if (!direct || method == 'toggle') {

			// Helper or label was clicked
			if (!direct) {
				input[_callback]('ifClicked');
			}

			// Toggle checked state
			if (active) {
				if (node[_type] !== _radio) {
					off(input, state);
				}
			} else {
				on(input, state);
			}
		}
	}

	// Add checked, disabled or indeterminate state
	function on(input, state, keep) {
		var node = input[0],
		parent = input.parent(),
		checked = state == _checked,
		indeterminate = state == _indeterminate,
		disabled = state == _disabled,
		callback = indeterminate ? _determinate: checked ? _unchecked: 'enabled',
		regular = option(input, callback + capitalize(node[_type])),
		specific = option(input, state + capitalize(node[_type]));

		// Prevent unnecessary actions
		if (node[state] !== true) {

			// Toggle assigned radio buttons
			if (!keep && state == _checked && node[_type] == _radio && node.name) {
				var form = input.closest('form'),
				inputs = 'input[name="' + node.name + '"]';

				inputs = form.length ? form.find(inputs) : $(inputs);

				inputs.each(function() {
					if (this !== node && $(this).data(_iCheck)) {
						off($(this), state);
					}
				});
			}

			// Indeterminate state
			if (indeterminate) {

				// Add indeterminate state
				node[state] = true;

				// Remove checked state
				if (node[_checked]) {
					off(input, _checked, 'force');
				}

				// Checked or disabled state
			} else {

				// Add checked or disabled state
				if (!keep) {
					node[state] = true;
				}

				// Remove indeterminate state
				if (checked && node[_indeterminate]) {
					off(input, _indeterminate, false);
				}
			}

			// Trigger callbacks
			callbacks(input, checked, state, keep);
		}

		// Add proper cursor
		if (node[_disabled] && !!option(input, _cursor, true)) {
			parent.find('.' + _iCheckHelper).css(_cursor, 'default');
		}

		// Add state class
		parent[_add](specific || option(input, state) || '');

		// Set ARIA attribute
		if ( !! parent.attr('role') && !indeterminate) {
			parent.attr('aria-' + (disabled ? _disabled: _checked), 'true');
		}

		// Remove regular state class
		parent[_remove](regular || option(input, callback) || '');
	}

	// Remove checked, disabled or indeterminate state
	function off(input, state, keep) {
		var node = input[0],
		parent = input.parent(),
		checked = state == _checked,
		indeterminate = state == _indeterminate,
		disabled = state == _disabled,
		callback = indeterminate ? _determinate: checked ? _unchecked: 'enabled',
		regular = option(input, callback + capitalize(node[_type])),
		specific = option(input, state + capitalize(node[_type]));

		// Prevent unnecessary actions
		if (node[state] !== false) {

			// Toggle state
			if (indeterminate || !keep || keep == 'force') {
				node[state] = false;
			}

			// Trigger callbacks
			callbacks(input, checked, callback, keep);
		}

		// Add proper cursor
		if (!node[_disabled] && !!option(input, _cursor, true)) {
			parent.find('.' + _iCheckHelper).css(_cursor, 'pointer');
		}

		// Remove state class
		parent[_remove](specific || option(input, state) || '');

		// Set ARIA attribute
		if ( !! parent.attr('role') && !indeterminate) {
			parent.attr('aria-' + (disabled ? _disabled: _checked), 'false');
		}

		// Add regular state class
		parent[_add](regular || option(input, callback) || '');
	}

	// Remove all traces
	function tidy(input, callback) {
		if (input.data(_iCheck)) {

			// Remove everything except input
			input.parent().html(input.attr('style', input.data(_iCheck).s || ''));

			// Callback
			if (callback) {
				input[_callback](callback);
			}

			// Unbind events
			input.off('.i').unwrap();
			$(_label + '[for="' + input[0].id + '"]').add(input.closest(_label)).off('.i');
		}
	}

	// Get some option
	function option(input, state, regular) {
		if (input.data(_iCheck)) {
			return input.data(_iCheck).o[state + (regular ? '': 'Class')];
		}
	}

	// Capitalize some string
	function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// Executable handlers
	function callbacks(input, checked, callback, keep) {
		if (!keep) {
			if (checked) {
				input[_callback]('ifToggled');
			}

			input[_callback]('ifChanged')[_callback]('if' + capitalize(callback));
		}
	}
})(window.jQuery || window.Zepto);

/* =======================================================================
 * jQuery.raty.js v2.4.5- A Star Rating Plugin
 * -------------------------------------------------------------------
 * jQuery Raty is a plugin that generates a customizable star rating.
 * Licensed under The MIT License
 *
 * @version        2.4.5
 * @since          2010.06.11
 * @author         Washington Botelho
 * @documentation  wbotelhos.com/raty
 * @twitter        twitter.com/wbotelhos
 *
 * Usage:
 * -------------------------------------------------------------------
 * $('#star').raty();
 * <div id="star"></div>
 * ======================================================================== */
!(function($) {
	var methods = {
		init: function(settings) {
			return this.each(function() {
				var self = this,
				$this = $(self).empty();
				self.opt = $.extend(true, {},
				$.fn.raty.defaults, settings);
				$this.data('settings', self.opt);
				self.opt.number = methods.between(self.opt.number, 0, 20);
				if (self.opt.path.substring(self.opt.path.length - 1, self.opt.path.length) != '/') {
					self.opt.path += '/';
				}
				if (typeof self.opt.score == 'function') {
					self.opt.score = self.opt.score.call(self);
				}
				if (self.opt.score) {
					self.opt.score = methods.between(self.opt.score, 0, self.opt.number);
				}
				for (var i = 1; i <= self.opt.number; i++) {
					$('<img />', {
						src: self.opt.path + ((!self.opt.score || self.opt.score < i) ? self.opt.starOff: self.opt.starOn),
						alt: i,
						title: (i <= self.opt.hints.length && self.opt.hints[i - 1] !== null) ? self.opt.hints[i - 1] : i
					}).appendTo(self);

					if (self.opt.space) {
						$this.append((i < self.opt.number) ? '': '');
					}
				}

				self.stars = $this.children('img:not(".raty-cancel")');
				self.score = $('<input />', {
					type: 'hidden',
					name: self.opt.scoreName
				}).appendTo(self);
				if (self.opt.score && self.opt.score > 0) {
					self.score.val(self.opt.score);
					methods.roundStar.call(self, self.opt.score);
				}
				if (self.opt.iconRange) {
					methods.fill.call(self, self.opt.score);				}
				methods.setTarget.call(self, self.opt.score, self.opt.targetKeep);
				var space = self.opt.space ? 4 : 0,
				width = self.opt.width || (self.opt.number * self.opt.size + self.opt.number * space);
				if (self.opt.cancel) {
					self.cancel = $('<img />', {
						src: self.opt.path + self.opt.cancelOff,
						alt: 'x',
						title: self.opt.cancelHint,
						'class': 'raty-cancel'
					});
					if (self.opt.cancelPlace == 'left') {
						//$this.prepend('&#160;').prepend(self.cancel);
					} else {
						//$this.append('&#160;').append(self.cancel);
					}
					width += (self.opt.size + space);
				}
				if (self.opt.readOnly) {
					methods.fixHint.call(self);

					if (self.cancel) {
						self.cancel.hide();
					}
				} else {
					$this.css('cursor', 'pointer');
					methods.bindAction.call(self);
				}
				//$this.css('width', width);
			});
		},
		between: function(value, min, max) {
			return Math.min(Math.max(parseFloat(value), min), max);
		},
		bindAction: function() {
			var self = this,
			$this = $(self);
			$this.mouseleave(function() {
				var score = self.score.val() || undefined;

				methods.initialize.call(self, score);
				methods.setTarget.call(self, score, self.opt.targetKeep);

				if (self.opt.mouseover) {
					self.opt.mouseover.call(self, score);
				}
			});
			var action = self.opt.half ? 'mousemove': 'mouseover';
			if (self.opt.cancel) {
				self.cancel.mouseenter(function() {
					$(this).attr('src', self.opt.path + self.opt.cancelOn);

					self.stars.attr('src', self.opt.path + self.opt.starOff);

					methods.setTarget.call(self, null, true);

					if (self.opt.mouseover) {
						self.opt.mouseover.call(self, null);
					}
				}).mouseleave(function() {
					$(this).attr('src', self.opt.path + self.opt.cancelOff);

					if (self.opt.mouseover) {
						self.opt.mouseover.call(self, self.score.val() || null);
					}
				}).click(function(evt) {
					self.score.removeAttr('value');
					if (self.opt.click) {
						self.opt.click.call(self, null, evt);
					}
				});
			}

			self.stars.bind(action,
			function(evt) {
				var value = parseInt(this.alt, 10);
				if (self.opt.half) {
					var position = parseFloat((evt.pageX - $(this).offset().left) / self.opt.size),
					diff = (position > .5) ? 1 : .5;
					value = parseFloat(this.alt) - 1 + diff;
					methods.fill.call(self, value);
					if (self.opt.precision) {
						value = value - diff + position;
					}
					methods.showHalf.call(self, value);
				} else {
					methods.fill.call(self, value);
				}
				$this.data('score', value);
				methods.setTarget.call(self, value, true);
				if (self.opt.mouseover) {
					self.opt.mouseover.call(self, value, evt);
				}
			}).click(function(evt) {
				self.score.val((self.opt.half || self.opt.precision) ? $this.data('score') : this.alt);
				if (self.opt.click) {
					self.opt.click.call(self, self.score.val(), evt);
				}
			});
		},
		cancel: function(isClick) {
			return $(this).each(function() {
				var self = this,
				$this = $(self);

				if ($this.data('readonly') === true) {
					return this;
				}

				if (isClick) {
					methods.click.call(self, null);
				} else {
					methods.score.call(self, null);
				}

				self.score.removeAttr('value');
			});
		},
		click: function(score) {
			return $(this).each(function() {
				if ($(this).data('readonly') === true) {
					return this;
				}

				methods.initialize.call(this, score);

				if (this.opt.click) {
					this.opt.click.call(this, score);
				} else {
					methods.error.call(this, 'you must add the "click: function(score, evt) { }" callback.');
				}
				methods.setTarget.call(this, score, true);
			});
		},
		error: function(message) {
			$(this).html(message);
			$.error(message);
		},
		fill: function(score) {
			var self = this,
			number = self.stars.length,
			count = 0,
			$star, star, icon;
			for (var i = 1; i <= number; i++) {
				$star = self.stars.eq(i - 1);
				if (self.opt.iconRange && self.opt.iconRange.length > count) {
					star = self.opt.iconRange[count];
					if (self.opt.single) {
						icon = (i == score) ? (star.on || self.opt.starOn) : (star.off || self.opt.starOff);
					} else {
						icon = (i <= score) ? (star.on || self.opt.starOn) : (star.off || self.opt.starOff);
					}
					if (i <= star.range) {
						$star.attr('src', self.opt.path + icon);
					}
					if (i == star.range) {
						count++;
					}
				} else {
					if (self.opt.single) {
						icon = (i == score) ? self.opt.starOn: self.opt.starOff;
					} else {
						icon = (i <= score) ? self.opt.starOn: self.opt.starOff;
					}
					$star.attr('src', self.opt.path + icon);
				}
			}
		},
		fixHint: function() {
			var $this = $(this),
			score = parseInt(this.score.val(), 10),
			hint = this.opt.noRatedMsg;

			if (!isNaN(score) && score > 0) {
				hint = (score <= this.opt.hints.length && this.opt.hints[score - 1] !== null) ? this.opt.hints[score - 1] : score;
			}
			$this.data('readonly', true).css('cursor', 'default').attr('title', hint);
			this.score.attr('readonly', 'readonly');
			this.stars.attr('title', hint);
		},
		getScore: function() {
			var score = [],
			value;
			$(this).each(function() {
				value = this.score.val();
				score.push(value ? parseFloat(value) : undefined);
			});
			return (score.length > 1) ? score: score[0];
		},
		readOnly: function(isReadOnly) {
			return this.each(function() {
				var $this = $(this);
				if ($this.data('readonly') === isReadOnly) {
					return this;
				}
				if (this.cancel) {
					if (isReadOnly) {
						this.cancel.hide();
					} else {
						this.cancel.show();
					}
				}
				if (isReadOnly) {
					$this.unbind();
					$this.children('img').unbind();
					methods.fixHint.call(this);
				} else {
					methods.bindAction.call(this);
					methods.unfixHint.call(this);
				}

				$this.data('readonly', isReadOnly);
			});
		},
		reload: function() {
			return methods.set.call(this, {});
		},
		roundStar: function(score) {
			var diff = (score - Math.floor(score)).toFixed(2);

			if (diff > this.opt.round.down) {
				var icon = this.opt.starOn; // Full up: [x.76 .. x.99]
				if (diff < this.opt.round.up && this.opt.halfShow) { // Half: [x.26 .. x.75]
					icon = this.opt.starHalf;
				} else if (diff < this.opt.round.full) { // Full down: [x.00 .. x.5]
					icon = this.opt.starOff;
				}

				this.stars.eq(Math.ceil(score) - 1).attr('src', this.opt.path + icon);
			} // Full down: [x.00 .. x.25]
		},
		score: function() {
			return arguments.length ? methods.setScore.apply(this, arguments) : methods.getScore.call(this);
		},
		set: function(settings) {
			this.each(function() {
				var $this = $(this),
				actual = $this.data('settings'),
				clone = $this.clone().removeAttr('style').insertBefore($this);

				$this.remove();

				clone.raty($.extend(actual, settings));
			});

			return $(this.selector);
		},
		setScore: function(score) {
			return $(this).each(function() {
				if ($(this).data('readonly') === true) {
					return this;
				}

				methods.initialize.call(this, score);
				methods.setTarget.call(this, score, true);
			});
		},
		setTarget: function(value, isKeep) {
			if (this.opt.target) {
				var $target = $(this.opt.target);

				if ($target.length == 0) {
					methods.error.call(this, '目标选择器无效或丢失!');
				}

				var score = value;

				if (!isKeep || score === undefined) {
					score = this.opt.targetText;
				} else {
					if (this.opt.targetType == 'hint') {
						score = (score === null && this.opt.cancel) ? this.opt.cancelHint: this.opt.hints[Math.ceil(score - 1)];
					} else {
						score = this.opt.precision ? parseFloat(score).toFixed(1) : parseInt(score, 10);
					}
				}

				if (this.opt.targetFormat.indexOf('{score}') < 0) {
					methods.error.call(this, '模版 "{score}" 找不到!');
				}

				if (value !== null) {
					score = this.opt.targetFormat.toString().replace('{score}', score);
				}

				if ($target.is(':input')) {
					$target.val(score);
				} else {
					$target.html(score);
				}
			}
		},
		showHalf: function(score) {
			var diff = (score - Math.floor(score)).toFixed(1);

			if (diff > 0 && diff < .6) {
				this.stars.eq(Math.ceil(score) - 1).attr('src', this.opt.path + this.opt.starHalf);
			}
		},
		initialize: function(score) {
			score = !score ? 0 : methods.between(score, 0, this.opt.number);

			methods.fill.call(this, score);

			if (score > 0) {
				if (this.opt.halfShow) {
					methods.roundStar.call(this, score);
				}

				this.score.val(score);
			}
		},
		unfixHint: function() {
			for (var i = 0; i < this.opt.number; i++) {
				this.stars.eq(i).attr('title', (i < this.opt.hints.length && this.opt.hints[i] !== null) ? this.opt.hints[i] : i);
			}

			$(this).data('readonly', false).css('cursor', 'pointer').removeAttr('title');

			this.score.attr('readonly', 'readonly');
		}
	};

	$.fn.raty = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('方法 ' + method + ' 不存在!');
		}
	};

	$.fn.raty.defaults = {
		cancel: false,
		cancelHint: '取消评级!',
		cancelOff: 'cancel-off.png',
		cancelOn: 'cancel-on.png',
		cancelPlace: 'left',
		click: undefined,
		half: false,
		halfShow: true,
		hints: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
		iconRange: undefined,
		mouseover: undefined,
		noRatedMsg: '没有额定',
		number: 10,
		path: 'images/',
		precision: false,
		round: {
			down: .25,
			full: .6,
			up: .76
		},
		readOnly: false,
		score: undefined,
		scoreName: 'score',
		single: false,
		size: 16,
		space: true,
		starHalf: 'star-half.png',
		starOff: 'star-off.png',
		starOn: 'star-on.png',
		target: undefined,
		targetFormat: '{score}',
		targetKeep: false,
		targetText: '',
		targetType: 'hint',
		width: undefined
	};
})(jQuery);

/* =======================================================================
 * jQuery.onePageNav.js v0.9One Page Nav Plugin
 * http://github.com/davist11/jQuery-One-Page-Nav
 * Copyright (c) 2010 Trevor Davis (http://trevordavis.net)
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://jquery.org/license
 * Example usage:
 * $('#nav').onePageNav({
 *   currentClass: 'current',
 *   changeHash: false,
 *   scrollSpeed: 750
 * });
 * ========================================================================*/
!(function($) {
	$.fn.onePageNav = function(options) {
		var opts = $.extend({},
		$.fn.onePageNav.defaults, options),
		onePageNav = {};

		onePageNav.sections = {};

		onePageNav.bindNav = function($el, $this, o) {
			var $par = $el.parent(),
			newLoc = $el.attr('href'),
			$win = $(window);

			if (!$par.hasClass(o.currentClass)) {
				if (o.begin) {
					o.begin();
				}
				onePageNav.adjustNav($this, $par, o.currentClass);
				$win.unbind('.onePageNav');
				$.scrollTo(newLoc, o.scrollSpeed, {
					easing: o.easing,
					offset: {
						top: -o.scrollOffset
					},
					onAfter: function() {
						if (o.changeHash) {
							window.location.hash = newLoc;
						}
						$win.bind('scroll.onePageNav',
						function() {
							onePageNav.scrollChange($this, o);
						});
						if (o.end) {
							o.end();
						}
					}
				});
			}
		};

		onePageNav.adjustNav = function($this, $el, curClass) {
			$this.find('.' + curClass).removeClass(curClass);
			$el.addClass(curClass);
		};

		onePageNav.getPositions = function($this, o) {
			var $nav = $this.find('a');

			if (o.filter !== '') {
				$nav = $nav.filter(o.filter);
			}

			$nav.each(function() {
				var linkHref = $(this).attr('href'),
				divPos = $(linkHref).offset(),
				topPos = divPos.top;

				onePageNav.sections[linkHref.substr(1)] = Math.round(topPos) - o.scrollOffset;
			});
		};

		onePageNav.getSection = function(windowPos, o) {
			var returnValue = '',
			windowHeight = Math.round($(window).height() * o.scrollThreshold);

			for (var section in onePageNav.sections) {
				if ((onePageNav.sections[section] - windowHeight) < windowPos) {
					returnValue = section;
				}
			}
			return returnValue;
		};

		onePageNav.scrollChange = function($this, o) {
			onePageNav.getPositions($this, o);

			var windowTop = $(window).scrollTop(),
			position = onePageNav.getSection(windowTop, o);

			if (position !== '') {
				onePageNav.adjustNav($this, $this.find('a[href=#' + position + ']').parent(), o.currentClass);
			}
		};

		onePageNav.init = function($this, o) {
			var didScroll = false,
			$nav = $this.find('a');

			if (o.filter !== '') {
				$nav = $nav.filter(o.filter);
			}

			$nav.bind('click',
			function(e) {
				onePageNav.bindNav($(this), $this, o);
				e.preventDefault();
			});

			onePageNav.getPositions($this, o);

			$(window).bind('scroll.onePageNav',
			function() {
				didScroll = true;
			});

			setInterval(function() {
				if (didScroll) {
					didScroll = false;
					onePageNav.scrollChange($this, o);
				}
			},
			250);
		};

		return this.each(function() {
			var $this = $(this),
			o = $.meta ? $.extend({},
			opts, $this.data()) : opts;

			onePageNav.init($this, o);

		});
	};

	// default options
	$.fn.onePageNav.defaults = {
		currentClass: 'current',
		changeHash: false,
		easing: 'swing',
		filter: '',
		scrollSpeed: 750,
		scrollOffset: 0,
		scrollThreshold: 0.5,
		begin: false,
		end: false
	};
})(jQuery);

 /* =======================================================================
 * jQuery.ColorPicker.js 颜色控件
 * ========================================================================*/
(function($) {
	'use strict';
	var name = 'Hui.colorPicker'; // modal name
	var TEAMPLATE = '<div class="colorpicker"><button type="button" class="btn dropdown-toggle" data-toggle="dropdown"><span class="cp-title"></span><i class="ic"></i></button><ul class="dropdown-menu clearfix"></ul></div>';
	var LANG = {
		zh_cn: {
			errorTip: "不是有效的颜色值"
		},
		zh_tw: {
			errorTip: "不是有效的顏色值"
		},
		en: {
			errorTip: "Not a valid color value"
		}
	};

	// The ColorPicker modal class
	var ColorPicker = function(element, options) {
		this.name = name;
		this.$ = $(element);

		this.getOptions(options);
		this.init();
	};

	// default options
	ColorPicker.DEFAULTS = {
		colors: ['#00BCD4', '#388E3C', '#3280fc', '#3F51B5', '#9C27B0', '#795548', '#F57C00', '#F44336', '#E91E63'],
		pullMenuRight: true,
		wrapper: 'btn-wrapper',
		tileSize: 30,
		lineCount: 5,
		optional: true,
		tooltip: 'top',
		icon: 'caret-down',
		// btnTip: 'Tool tip in button'
	};

	ColorPicker.prototype.init = function() {
		var options = this.options,
		that = this;

		this.$picker = $(TEAMPLATE).addClass(options.wrapper);
		this.$picker.find('.cp-title').toggle(options.title !== undefined).text(options.title);
		this.$menu = this.$picker.find('.dropdown-menu').toggleClass('pull-right', options.pullMenuRight);
		this.$btn = this.$picker.find('.btn.dropdown-toggle');
		this.$btn.find('.ic').addClass('icon-' + options.icon);
		if (options.btnTip) {
			this.$picker.attr('data-toggle', 'tooltip').tooltip({
				title: options.btnTip,
				placement: options.tooltip,
				container: 'body'
			});
		}
		this.$.attr('data-provide', null).after(this.$picker);

		// init colors
		this.colors = {};
		$.each(this.options.colors,
		function(idx, rawColor) {
			if ($.zui.Color.isColor(rawColor)) {
				var color = new $.zui.Color(rawColor);
				that.colors[color.toCssStr()] = color;
			}
		});

		this.updateColors();
		var that = this;
		this.$picker.on('click', '.cp-tile',
		function() {
			that.setValue($(this).data('color'));
		});
		var $input = this.$;
		var setInputColor = function() {
			var val = $input.val();
			var isColor = $.zui.Color.isColor(val);
			$input.parent().toggleClass('has-error', !isColor && !(options.optional && val === ''));
			if (isColor) {
				that.setValue(val, true);
			} else {
				if (options.optional && val === '') {
					$input.tooltip('hide');
				} else if (!$input.is(':focus')) {
					$input.tooltip('show', options.errorTip);
				}
			}
		}
		if ($input.is('input:not([type=hidden])')) {
			if (options.tooltip) {
				$input.attr('data-toggle', 'tooltip').tooltip({
					trigger: 'manual',
					placement: options.tooltip,
					tipClass: 'tooltip-danger',
					container: 'body'
				});
			}
			$input.on('keyup paste input change', setInputColor);
		} else {
			$input.appendTo(this.$picker);
		}
		setInputColor();
	};

	ColorPicker.prototype.addColor = function(color) {
		var hex = color.toCssStr(),
		options = this.options;

		if (!this.colors[hex]) {
			this.colors[hex] = color;
		}

		var $a = $('<a href="###" class="cp-tile"></a>', {
			titile: color
		}).data('color', color).css({
			'color': color.contrast().toCssStr(),
			'background': hex,
			'border-color': color.luma() > 0.43 ? '#ccc': 'transparent'
		}).attr('data-color', hex);
		this.$menu.append($('<li/>').css({
			width: options.tileSize,
			height: options.tileSize
		}).append($a));
		if (options.optional) {
			this.$menu.find('.cp-tile.empty').parent().detach().appendTo(this.$menu);
		}
	};

	ColorPicker.prototype.updateColors = function(colors) {
		var $picker = this.$picker,
		$menu = this.$menu.empty(),
		options = this.options,
		colors = colors || this.colors,
		that = this;
		var bestLineCount = 0;
		$.each(colors,
		function(idx, color) {
			that.addColor(color);
			bestLineCount++;
		});
		if (options.optional) {
			var $li = $('<li><a class="cp-tile empty" href="###"></a></li>').css({
				width: options.tileSize,
				height: options.tileSize
			});
			this.$menu.append($li);
			bestLineCount++;
		}
		$menu.css('width', Math.min(bestLineCount, options.lineCount) * options.tileSize + 6);
	};

	ColorPicker.prototype.setValue = function(color, notSetInput) {
		var options = this.options;
		this.$menu.find('.cp-tile.active').removeClass('active');
		var hex = '';
		if (color) {
			var c = new $.zui.Color(color);
			hex = c.toCssStr().toLowerCase();
			this.$btn.css({
				background: hex,
				color: c.contrast().toCssStr(),
				borderColor: c.luma() > 0.43 ? '#ccc': hex
			});
			if (!this.colors[hex]) {
				this.addColor(c);
			}
			if (!notSetInput && this.$.val().toLowerCase() !== hex) {
				this.$.val(hex).trigger('change');
			}
			this.$menu.find('.cp-tile[data-color=' + hex + ']').addClass('active');
			this.$.tooltip('hide');
			this.$.trigger('colorchange', c);
		} else {
			this.$btn.attr('style', null);
			if (!notSetInput && this.$.val() !== '') {
				this.$.val(hex).trigger('change');
			}
			if (options.optional) {
				this.$.tooltip('hide');
			}
			this.$menu.find('.cp-tile.empty').addClass('active');
			this.$.trigger('colorchange', null);
		}

		if (options.updateBorder) {
			$(options.updateBorder).css('border-color', hex);
		}
		if (options.updateBackground) {
			$(options.updateBackground).css('background-color', hex);
		}
		if (options.updateColor) {
			$(options.updateText).css('color', hex);
		}
		if (options.updateText) {
			$(options.updateText).text(hex);
		}
	};

	// Get and init options
	ColorPicker.prototype.getOptions = function(options) {
		var thisOptions = $.extend({},
		ColorPicker.DEFAULTS, this.$.data(), options);
		if (typeof thisOptions.colors === 'string') thisOptions.colors = thisOptions.colors.split(',');
		var lang = (thisOptions.lang || $.zui.clientLang()).toLowerCase();
		if (!thisOptions.errorTip) {
			thisOptions.errorTip = LANG[lang].errorTip;
		}
		if (!$.fn.tooltip) thisOptions.btnTip = false;
		this.options = thisOptions;
	};

	// Extense jquery element
	$.fn.colorPicker = function(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data(name);
			var options = typeof option == 'object' && option;

			if (!data) $this.data(name, (data = new ColorPicker(this, options)));

			if (typeof option == 'string') data[option]();
		});
	};

	$.fn.colorPicker.Constructor = ColorPicker;

	// Auto call colorPicker after document load complete
	$(function() {
		$('[data-provide="colorpicker"]').colorPicker();
	});
}(jQuery));

/* =======================================================================
 * jquery.HuiaddFavorite.js 添加收藏
 * <a title="收藏本站" href="javascript:;" onClick="addFavoritepage('H-ui前端框架','http://www.h-ui.net/');">收藏本站</a>
 * function shoucang(name,site){
	$.addFavorite({
		name:name,
		site:site,
	});
 * ========================================================================*/
function HuiaddFavorite(obj) {
	obj.site = obj.site || window.location.href;
	obj.name = obj.name || document.title;
	try {
		window.external.addFavorite(obj.site, obj.name);
	} catch(e) {
		try {
			window.sidebar.addPanel(name, site, "");
		} catch(e) {
      $("body").Huimodalalert({
        content: '加入收藏失败，请使用Ctrl+D进行添加',
        speed: 2000,
      });
		}
	}
}

/* ========================================================================
 * jQuery.Huisethome.js 设为首页
 * ======================================================================== */
function Huisethome(obj){
	try{
		obj.style.behavior="url(#default#homepage)";
		obj.setHomePage(webSite);
	}
	catch(e){
		if(window.netscape){
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				}
			catch(e){
        $("body").Huimodalalert({
          content: "此操作被浏览器拒绝！\n请在浏览器地址栏输入\"about:config\"并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。",
          speed: 2000,
        });
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			prefs.setCharPref('browser.startup.homepage',url);
		}
	}
}

/* =======================================================================
 * jQuery.Huisidenav.js 左侧菜单-隐藏显示
 * ======================================================================== */
function displaynavbar(obj){
	if($(obj).hasClass("open")){
		$(obj).removeClass("open");
		$("body").removeClass("big-page");
	} else {
		$(obj).addClass("open");
		$("body").addClass("big-page");
	}
}

/* =======================================================================
 * jQuery.Huihover.js v2.0 Huihover
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.05.05
 *
 * Copyright 2017 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huihover = function(options){
		var defaults = {
			className:"hover",
		}
		var options = $.extend(defaults, options);
		this.each(function(){
			var that = $(this);
			that.hover(function() {
				that.addClass(options.className);
			},
			function() {
				that.removeClass(options.className);
			});
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huifocusblur.js v2.0 得到失去焦点
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.05.09
 *
 * Copyright 2017 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huifocusblur = function(options){
		var defaults = {
			className:"focus",
		}
		var options = $.extend(defaults, options);
		this.each(function(){
			var that = $(this);
			that.focus(function() {
				that.addClass(options.className).removeClass("inputError");
			});
			that.blur(function() {
				that.removeClass(options.className);
			});
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huiselect.js 选择
 * ========================================================================*/
!function($) {
	$.Huiselect = function(divselectid, inputselectid) {
		var inputselect = $(inputselectid);
		$(divselectid + " cite").click(function() {
			var ul = $(divselectid + " ul");
			ul.slideToggle();
		});
		$(divselectid + " ul li a").click(function() {
			var txt = $(this).text();
			$(divselectid + " cite").html(txt);
			var value = $(this).attr("selectid");
			inputselect.val(value);
			$(divselectid + " ul").hide();
		});
		$(document).click(function() {
			$(divselectid + " ul").hide();
		});
	};
} (window.jQuery);

/* =======================================================================
 * jQuery.Huitab.js v2.0.1 选项卡
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.10.10
 *
 * Copyright 2017 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function ($) {
	$.fn.Huitab = function(options, callback){
		var defaults = {
			tabBar:'.tabBar span',
			tabCon:".tabCon",
			className:"current",
			tabEvent:"click",
			index:0,
		}
		var options = $.extend(defaults, options);
		this.each(function(){
			var that = $(this);
			that.find(options.tabBar).removeClass(options.className);
			that.find(options.tabBar).eq(options.index).addClass(options.className);
			that.find(options.tabCon).hide();
			that.find(options.tabCon).eq(options.index).show();

			that.find(options.tabBar).on(options.tabEvent,function(){
				that.find(options.tabBar).removeClass(options.className);
				$(this).addClass(options.className);
				var index = that.find(options.tabBar).index(this);
				that.find(options.tabCon).hide();
				that.find(options.tabCon).eq(index).show();
				if (callback) {
					callback(index);
				}
			});
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huifold.js v2.0 折叠
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.05.05
 *
 * Copyright 2017 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huifold = function(options){
		var defaults = {
			titCell:'.item .Huifold-header',
			mainCell:'.item .Huifold-body',
			type: 1, //1	只打开一个，可以全部关闭;2	必须有一个打开;3	可打开多个
			trigger:'click',
			className:"selected",
			speed:'first',
		}
		var options = $.extend(defaults, options);
		this.each(function(){
			var that = $(this);
			that.find(options.titCell).on(options.trigger,function(){
				if ($(this).next().is(":visible")) {
					if (options.type == 2) {
						return false;
					} else {
						$(this).next().slideUp(options.speed).end().removeClass(options.className);
						if ($(this).find("b")) {
							$(this).find("b").html("+");
						}
					}
				}else {
					if (options.type == 3) {
						$(this).next().slideDown(options.speed).end().addClass(options.className);
						if ($(this).find("b")) {
							$(this).find("b").html("-");
						}
					} else {
						that.find(options.mainCell).slideUp(options.speed);
						that.find(options.titCell).removeClass(options.className);
						if (that.find(options.titCell).find("b")) {
							that.find(options.titCell).find("b").html("+");
						}
						$(this).next().slideDown(options.speed).end().addClass(options.className);
						if ($(this).find("b")) {
							$(this).find("b").html("-");
						}
					}
				}
			});

		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huitags.js v2.0 标签
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.05.10
 *
 * Copyright 2017 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huitags = function(options) {
		var defaults = {
			value:'Hui前端框架,H-ui,辉哥',
			maxlength : 20,
			number : 5,
			tagsDefault : ["Html","CSS","JS"],
		}
		var options = $.extend(defaults, options);
		var keyCodes = {
			Enter : 13,
			Enter2 : 108,
			Spacebar:32
		}
		this.each(function(){
			var that = $(this);
			var str =
			'<div class="Huitags-wraper">'+
				'<div class="Huitags-editor cl"></div>'+
				'<div class="Huitags-input-wraper">'+
					'<input type="text" class="input-text Huitags-input" maxlength="'+options.maxlength+'" value="">'+
				'</div>'+
				'<div class="Huitags-list">'+
					'<div class="Huitags-notag" style="display:none">暂无常用标签</div>'+
					'<div class="Huitags-has"></div>'+
				'</div>'+
				'<input type="hidden" class="Huitags-val" name="" value="'+options.value+'">'+
			'</div>';
			that.append(str);
			var wraper = that.find(".Huitags-wraper");
			var editor = that.find(".Huitags-editor");
			var input =that.find(".Huitags-input");
			var list = that.find(".Huitags-list");
			var has = that.find(".Huitags-has");
			var val = that.find(".Huitags-val");



			if(options.tagsDefault){
				var tagsDefaultLength = (options.tagsDefault).length;
				for(var i = 0;i< tagsDefaultLength; i++){
					has.append('<span>'+options.tagsDefault[i]+'</span>');
				}
				has.find("span").on('click',function(){
					var taghasV = $(this).text();
					taghasV=taghasV.replace(/(^\s*)|(\s*$)/g,"");
					editor.append('<span class="Huitags-token">'+taghasV+'</span>');
					gettagval(this);
					$(this).remove();
				});
			}

			function gettagval(obj) {
				var str = "";
				var token = that.find(".Huitags-token");
				if (token.length < 1) {
					input.val("");
					return false;
				}
				for (var i = 0; i < token.length; i++) {
					str += token.eq(i).text() + ",";
				}
				str = unique(str, 1);
				str=str.join();
				val.val(str);
			}
			/*将字符串逗号分割成数组并去重*/
			function unique(o, type){
				//去掉前后空格
				o=o.replace(/(^\s*)|(\s*$)/g,"");
				if(type == 1) {
					//把所有的空格和中文逗号替换成英文逗号
					o=o.replace(/(\s)|(，)/g, ",");
				} else {
					//把所有的中文逗号替换成英文逗号
					o=o.replace(/(，)/g, ",");
				}
				//去掉前后英文逗号
				o=o.replace(/^,|,$/g, "");
				//去重连续的英文逗号
				o=o.replace(/,+/g,',');
				o=o.split(",");
				var n = [o[0]]; //结果数组
				for(var i = 1; i < o.length; i++){
					if (o.indexOf(o[i]) == i) {
						if(o[i] == "")
							continue;
						n.push(o[i]);
					}
				}
				return n;
			}

			input.on("keydown",function(e){
				var evt = e || window.event;
				if (evt.keyCode == keyCodes.Enter || evt.keyCode == keyCodes.Enter2 || evt.keyCode == keyCodes.Spacebar) {
					var v = input.val().replace(/\s+/g, "");
					var reg = /^,|,$/gi;
					v = v.replace(reg, "");
					v = $.trim(v);
					if (v != '') {
						input.change();
					}else{
						return false;
					}
				}
			});

			input.on("change",function(){
				var v1 = input.val();
				var v2 = val.val();
				var v = v2+','+v1;
				if(v!=''){
					var str='<i class="Huitags-icon Hui-iconfont">&#xe64b;</i>';
					var result = unique(v, 1);
					if(result.length>0){
						for(var j=0;j<result.length;j++){
							str+='<span class="Huitags-token">'+result[j]+'</span>';
						}
						val.val(result);
						editor.html(str);
						input.val("").blur();
					}
				}
			});

			$(document).on("click",".Huitags-token",function(){
				$(this).remove();
				var str ="";
				if(that.find(".Huitags-token").length<1){
					val.val("");
					return false;
				}else{
					for(var i = 0;i< that.find(".Huitags-token").length;i++){
						str += that.find(".Huitags-token").eq(i).text() + ",";
					}
					str = str.substring(0,str.length-1);
					val.val(str);
				}
			});
			input.change();
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huitagsmixed.js 标签混排效果
 * ========================================================================*/
!function($) {
	$.Huitagsmixed = function(obj) {
		$(obj).each(function() {
			var x = 9;
			var y = 0;
			var rand = parseInt(Math.random() * (x - y + 1) + y);
			$(this).addClass("tags" + rand);
		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huitextarealength.js v2.0 字数限制
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.05.12
 *
 * Copyright 2017 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	$.fn.Huitextarealength = function(options){
		var defaults = {
			minlength:0,
			maxlength:140,
			errorClass:"error",
			exceed:true,
		}
		var options = $.extend(defaults, options);
		this.each(function(){
			var that = $(this);
			var v = that.val();
			var l = v.length;
			var str = '<p class="textarea-numberbar"><em class="textarea-length">'+l+'</em>/'+options.maxlength+'</p>';
			that.parent().append(str);

			that.on("keyup",function(){
				v = that.val();
				l = v.length;
				if (l > options.maxlength) {
					if(options.exceed){
						that.addClass(options.errorClass);
					}else{
						v = v.substring(0, options.maxlength);
						that.val(v);
						that.removeClass(options.errorClass);
					}
				}
				else if(l<options.minlength){
					that.addClass(options.errorClass);
				}else{
					that.removeClass(options.errorClass);
				}
				that.parent().find(".textarea-length").text(v.length);
			});

		});
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huipreview.js v2.1 图片预览
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.11.13
 *
 * Copyright 2017 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function ($) {
	$.fn.Huipreview = function (options) {
		var defaults = {
			className: "active",
			bigImgWidth: 300,
		};
		var options = $.extend(defaults, options);
		this.each(function () {
			var that = $(this);
			var timer;
			that.hover(
				function () {
					clearTimeout(timer);
					timer = setTimeout(function () {
						$("#preview-wraper").remove();
						var smallImg = that.find("img").attr("src");
						var bigImg = that.attr('data-src');
						var bigImgW = that.attr('data-width');
						var bigImgH = that.attr('data-height');
						var winW = $(window).width();
						var winW5 = winW / 2;
						var imgT = that.parent().offset().top;
						var imgL = that.parent().offset().left;
						var imgW = that.parent().width();
						var imgH = that.parent().height();
						var ww = (imgL + imgW / 2);
						var tooltipLeft = "auto", tooltipRight = "auto";
						if (ww < winW5) {
							tooltipLeft = (imgW + imgL) + "px";
						} else {
							tooltipRight = (winW - imgL) + "px";
						}

						that.addClass(options.className);
						if (bigImg == '') {
							return false;
						} else {
							var tooltip_keleyi_com =
								'<div id="preview-wraper" style="position: absolute;z-index:999;width:' + options.bigImgWidth + 'px;height:auto;top:' + imgT + 'px;right:' + tooltipRight + ';left:' + tooltipLeft + '">' +
								'<img src="' + smallImg + '" width="' + options.bigImgWidth + '">' +
								'</div>';
							$("body").append(tooltip_keleyi_com);
							/*图片预加载*/
							var image = new Image();
							image.src = bigImg;
							/*创建一个Image对象*/
							image.onload = function () {
								$('#preview-wraper').find("img").attr("src", bigImg).css("width", options.bigImgWidth);
							};
						}
					}, 500);
				},
				function () {
					clearTimeout(timer);
					that.removeClass(options.className);
					$("#preview-wraper").remove();
				}
			);
		});
	}
}(window.jQuery);

/* =======================================================================
 * jQuery.Huimodalalert.js alert
 * ========================================================================*/
!function ($) {
  $.fn.Huimodalalert = function (options, callback) {
    var defaults = {
      btn: ['确定'],
      content:'弹窗内容',
      speed: "0",
      area: ['400', 'auto'],
    };
    var options = $.extend(defaults, options);
    this.each(function () {
      var that = $(this);
      var w= 0,h=0,t=0,l=0;
      if (options.area[0]=='auto'){
        w ='400px';
        l = -(400 / 2) + 'px';
      }else{
        w = options.area[0] + 'px';
        l = -(options.area[0] / 2) + 'px';
      }
      if (options.area[1] == 'auto') {
        h = 'auto';
      } else {
        h = options.area[1] + 'px';
      }
      var htmlstr =
      '<div id="Huimodalalert" class="modal modal-alert radius" style="width:' + w + ';height:' + h + ';margin-left:' + l +'">' +
        '<div class="modal-alert-info">' + options.content + '</div>' +
        '<div class="modal-footer">'+
          '<button class="btn btn-primary radius">' + options.btn[0]+'</button>'+
        '</div>' +
      '</div>'+
      '<div id="Huimodalmask" class="Huimodalmask"></div>';

      if ($("#Huimodalalert").length > 0) {
        $("#Huimodalalert,#Huimodalmask").remove();
      }
      if (options.speed==0){
        $(document.body).addClass("modal-open").append(htmlstr);
        $("#Huimodalalert").fadeIn();
      }else{
        $(document.body).addClass("modal-open").append(htmlstr);
        $("#Huimodalalert").find(".modal-footer").remove();
        $("#Huimodalalert").fadeIn();
        setTimeout(function(){
          $("#Huimodalalert").fadeOut("normal",function () {
            huimodalhide();
          });
        }, options.speed);
      }

      var button = that.find(".modal-footer .btn");
      button.on("click",function(){
        $("#Huimodalalert").fadeOut("normal", function () {
          huimodalhide();
        });
      });

      function huimodalhide(){
        $("#Huimodalalert,#Huimodalmask").remove();
        $(document.body).removeClass("modal-open");
        if (callback) {
          callback();
        }
      }
    });
  }
}(window.jQuery);

/* =======================================================================
 * jQuery.Huialert.js alert
 * ========================================================================*/
!function($) {
	$.Huialert = function() {
		$('.Huialert i').Huihover();
		$(document).on("click",".Huialert i",function() {
			var Huialert = $(this).parents(".Huialert");
			Huialert.fadeOut("normal",function() {
				Huialert.remove();
			});
		});
	}
	$.Huialert();
} (window.jQuery);

/* =======================================================================
 * jQuery.Huitotop.js v2.0 返回顶部
 * http://www.h-ui.net/
 * Created & Modified by guojunhui
 * Date modified 2017.05.05
 *
 * Copyright 2017 郭俊辉 All rights reserved.
 * Licensed under MIT license.
 * http://opensource.org/licenses/MIT
 * ========================================================================*/
!function($) {
	//bottom 距离底部高度
	$.Huitotop = function(bottom){
		if(!bottom){
			bottom = 60;
		}
		var str ='<a href="javascript:void(0)" class="tools-right toTop Hui-iconfont" title="返回顶部" alt="返回顶部" style="display:none;bottom:'+bottom+'px">&#xe684;</a>';
		$(str).appendTo($('body')).click(function() {
			$("html, body").animate({
				scrollTop: 0
			},
			120);
		});
		var backToTopFun = function(){
			var st = $(document).scrollTop();
			var winh = $(window).height();
			if(st> 0){
				$(".toTop").show();
			}else{
				$(".toTop").hide();
			}
			/*IE6下的定位*/
			if (!window.XMLHttpRequest) {
				$(".toTop").css("top", st + winh - 166);
			}

		}
		$(window).on("scroll",backToTopFun);
	}
} (window.jQuery);

/* =======================================================================
 * jQuery.Huimarquee.js 滚动
 * ========================================================================*/
!function($) {
	$.Huimarquee = function(height, speed, delay) {
		var scrollT;
		var pause = false;
		var ScrollBox = document.getElementById("marquee");
		if (document.getElementById("holder").offsetHeight <= height) return;
		var _tmp = ScrollBox.innerHTML.replace('holder', 'holder2');
		ScrollBox.innerHTML += _tmp;
		ScrollBox.onmouseover = function() {
			pause = true;
		}
		ScrollBox.onmouseout = function() {
			pause = false;
		}
		ScrollBox.scrollTop = 0;
		var start = function() {
			scrollT = setInterval(scrolling, speed);
			if (!pause) ScrollBox.scrollTop += 2;
		}
		var scrolling = function() {
			if (ScrollBox.scrollTop % height != 0) {
				ScrollBox.scrollTop += 2;
				if (ScrollBox.scrollTop >= ScrollBox.scrollHeight / 2) ScrollBox.scrollTop = 0;
			} else {
				clearInterval(scrollT);
				setTimeout(start, delay);
			}
		}
		setTimeout(start, delay);
	}
} (window.jQuery);

$(function() {
	/*上传*/
	$(document).on("change", ".input-file",function() {
		var uploadVal = $(this).val();
		$(this).parent().find(".upload-url").val(uploadVal).focus().blur();
	});
});

/* ========================================================================
 * Bootstrap.button.js v3.3.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
!function($) {
	'use strict';
	// BUTTON PUBLIC CLASS DEFINITION
	// ==============================
	var Button = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({},Button.DEFAULTS, options);
		this.isLoading = false;
	}
	Button.VERSION = '3.3.0'

	Button.DEFAULTS = {
		loadingText: 'loading...'
	}

	Button.prototype.setState = function(state) {
		var d = 'disabled'
		var $el = this.$element
		var val = $el.is('input') ? 'val': 'html'
		var data = $el.data();
		state = state + 'Text';
		if (data.resetText == null) $el.data('resetText', $el[val]());
		// push to event loop to allow forms to submit
		setTimeout($.proxy(function() {
			$el[val](data[state] == null ? this.options[state] : data[state]);
			if (state == 'loadingText') {
				this.isLoading = true;
				$el.addClass(d).attr(d, d);
			} else if (this.isLoading) {
				this.isLoading = false;
				$el.removeClass(d).removeAttr(d);
			}
		},
		this), 0)
	}

	Button.prototype.toggle = function() {
		var changed = true;
		var $parent = this.$element.closest('[data-toggle="buttons"]');

		if ($parent.length) {
			var $input = this.$element.find('input');
			if ($input.prop('type') == 'radio') {
				if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
				else $parent.find('.active').removeClass('active')
			}
			if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
		} else {
			this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
		}

		if (changed) this.$element.toggleClass('active')
	}

	// BUTTON PLUGIN DEFINITION
	// ========================
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.button');
			var options = typeof option == 'object' && option;
			if (!data) $this.data('bs.button', (data = new Button(this, options)))

			if (option == 'toggle') data.toggle()
			else if (option) data.setState(option)
		})
	}

	var old = $.fn.button;

	$.fn.button = Plugin;
	$.fn.button.Constructor = Button;
	// BUTTON NO CONFLICT
	// ==================
	$.fn.button.noConflict = function() {
		$.fn.button = old;
		return this;
	}

	// BUTTON DATA-API
	// ===============
	$(document).on('click.bs.button.data-api', '[data-toggle^="button"]',
	function(e) {
		var $btn = $(e.target);
		if (!$btn.hasClass('btn'));
		$btn = $btn.closest('.btn');
		Plugin.call($btn, 'toggle');
		e.preventDefault();
	}).on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]',
	function(e) {
		$(e.target).closest('.btn').toggleClass('focus', e.type == 'focus');
	})
} (jQuery);

/* =======================================================================
 * jQuery.stickUp.js v0.5.7 BETA  by:LiranCohen
 * https://github.com/LiranCohen/stickUp
 * ======================================================================== */
jQuery(function($) {
	$(document).ready(function(){
		var contentButton = [];
		var contentTop = [];
		var content = [];
		var lastScrollTop = 0;
		var scrollDir = '';
		var itemClass = '';
		var itemHover = '';
		var menuSize = null;
		var stickyHeight = 0;
		var stickyMarginB = 0;
		var currentMarginT = 0;
		var topMargin = 0;
		var vartop = 0;
		$(window).scroll(function(event){
   			var st = $(this).scrollTop();
   			if (st > lastScrollTop){
       			scrollDir = 'down';
   			} else {
      			scrollDir = 'up';
   			}
  			lastScrollTop = st;
		});
		$.fn.stickUp = function( options ) {
			// adding a class to users div
			$(this).addClass('stuckMenu');
        	//getting options
        	var objn = 0;
        	if(options != null) {
	        	for(var o in options.parts) {
	        		if (options.parts.hasOwnProperty(o)){
	        			content[objn] = options.parts[objn];
	        			objn++;
	        		}
	        	}
	  			if(objn == 0) {
	  				console.log('error:needs arguments');
	  			}

	  			itemClass = options.itemClass;
	  			itemHover = options.itemHover;
	  			if(options.topMargin != null) {
	  				if(options.topMargin == 'auto') {
	  					topMargin = parseInt($('.stuckMenu').css('margin-top'));
	  				} else {
	  					if(isNaN(options.topMargin) && options.topMargin.search("px") > 0){
	  						topMargin = parseInt(options.topMargin.replace("px",""));
	  					} else if(!isNaN(parseInt(options.topMargin))) {
	  						topMargin = parseInt(options.topMargin);
	  					} else {
	  						console.log("incorrect argument, ignored.");
	  						topMargin = 0;
	  					}
	  				}
	  			} else {
	  				topMargin = 0;
	  			}
	  			menuSize = $('.'+itemClass).size();
  			}
			stickyHeight = parseInt($(this).height());
			stickyMarginB = parseInt($(this).css('margin-bottom'));
			currentMarginT = parseInt($(this).next().closest('div').css('margin-top'));
			vartop = parseInt($(this).offset().top);
			//$(this).find('*').removeClass(itemHover);
		}
		$(document).on('scroll', function() {
			varscroll = parseInt($(document).scrollTop());
			if(menuSize != null){
				for(var i=0;i < menuSize;i++)
				{
					contentTop[i] = $('#'+content[i]+'').offset().top;
					function bottomView(i) {
						contentView = $('#'+content[i]+'').height()*.4;
						testView = contentTop[i] - contentView;
						if(varscroll > testView){
							$('.'+itemClass).removeClass(itemHover);
							$('.'+itemClass+':eq('+i+')').addClass(itemHover);
						} else if(varscroll < 50){
							$('.'+itemClass).removeClass(itemHover);
							$('.'+itemClass+':eq(0)').addClass(itemHover);
						}
					}
					if(scrollDir == 'down' && varscroll > contentTop[i]-50 && varscroll < contentTop[i]+50) {
						$('.'+itemClass).removeClass(itemHover);
						$('.'+itemClass+':eq('+i+')').addClass(itemHover);
					}
					if(scrollDir == 'up') {
						bottomView(i);
					}
				}
			}
			if(vartop < varscroll + topMargin){
				$('.stuckMenu').addClass('isStuck');
				$('.stuckMenu').next().closest('div').css({
					'margin-top': stickyHeight + stickyMarginB + currentMarginT + 'px'
				}, 10);
				$('.stuckMenu').css("position","fixed");
				$('.isStuck').css({
					top: '0px'
				}, 10, function(){

				});
			};

			if(varscroll + topMargin < vartop){
				$('.stuckMenu').removeClass('isStuck');
				$('.stuckMenu').next().closest('div').css({
					'margin-top': currentMarginT + 'px'
				}, 10);
				$('.stuckMenu').css("position","relative");
			};
		});
	});
});

/* =======================================================================
 * Bootstrap.modal.js v3.3.0
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
!function($) {
	'use strict';
	// MODAL CLASS DEFINITION
	// ======================
	var Modal = function(element, options) {
		this.options = options;
		this.$body = $(document.body);
		this.$element = $(element);
		this.$backdrop =
		this.isShown = null;
		this.scrollbarWidth = 0;

		if (this.options.remote) {
			this.$element.find('.modal-content').load(this.options.remote, $.proxy(function() {
				this.$element.trigger('loaded.bs.modal');
			},
			this))
		}
	}

	Modal.VERSION = '3.3.0';
	Modal.TRANSITION_DURATION = 300;
	Modal.BACKDROP_TRANSITION_DURATION = 150;

	Modal.DEFAULTS = {
		backdrop: true,
		keyboard: true,
		show: true,
	}

	Modal.prototype.toggle = function(_relatedTarget) {
		return this.isShown ? this.hide() : this.show(_relatedTarget)
	}

	Modal.prototype.show = function(_relatedTarget) {
		var that = this;
		var e = $.Event('show.bs.modal', {
			relatedTarget: _relatedTarget
		});

		this.$element.trigger(e);
		if (this.isShown || e.isDefaultPrevented()) return;
		this.isShown = true;
		this.checkScrollbar();
		this.$body.addClass('modal-open');
		this.setScrollbar();
		this.escape();
		this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

		this.backdrop(function() {
			var transition = $.support.transition && that.$element.hasClass('fade');
			if (!that.$element.parent().length) {
				that.$element.appendTo(that.$body); // don't move modals dom position
			}
			that.$element.show().scrollTop(0);
			if (transition) {
				that.$element[0].offsetWidth; // force reflow
			}
			that.$element.addClass('in').attr('aria-hidden', false);

			that.enforceFocus();

			var e = $.Event('shown.bs.modal', {
				relatedTarget: _relatedTarget
			})

			transition ? that.$element.find('.modal-dialog') // wait for modal to slide in
			.one('bsTransitionEnd',
			function() {
				that.$element.trigger('focus').trigger(e)
			}).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e)
		})
	}

	Modal.prototype.hide = function(e) {
		if (e) e.preventDefault();
		e = $.Event('hide.bs.modal');
		this.$element.trigger(e);
		if (!this.isShown || e.isDefaultPrevented()) return;
		this.isShown = false;
		this.escape();
		$(document).off('focusin.bs.modal');
		this.$element.removeClass('in').attr('aria-hidden', true).off('click.dismiss.bs.modal');
		$.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal()
	}

	Modal.prototype.enforceFocus = function() {
		$(document).off('focusin.bs.modal') // guard against infinite focus loop
		.on('focusin.bs.modal', $.proxy(function(e) {
			if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
				this.$element.trigger('focus')
			}
		},
		this))
	}

	Modal.prototype.escape = function() {
		if (this.isShown && this.options.keyboard) {
			this.$element.on('keydown.dismiss.bs.modal', $.proxy(function(e) {
				e.which == 27 && this.hide()
			},
			this))
		} else if (!this.isShown) {
			this.$element.off('keydown.dismiss.bs.modal')
		}
	}

	Modal.prototype.hideModal = function() {
		var that = this;
		this.$element.hide();
		this.backdrop(function() {
			that.$body.removeClass('modal-open');
			that.resetScrollbar();
			that.$element.trigger('hidden.bs.modal');
		})
	}

	Modal.prototype.removeBackdrop = function() {
		this.$backdrop && this.$backdrop.remove();
		this.$backdrop = null;
	}

	Modal.prototype.backdrop = function(callback) {
		var that = this
		var animate = this.$element.hasClass('fade') ? 'fade': ''

		if (this.isShown && this.options.backdrop) {
			var doAnimate = $.support.transition && animate

			this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').prependTo(this.$element).on('click.dismiss.bs.modal', $.proxy(function(e) {
				if (e.target !== e.currentTarget) return this.options.backdrop == 'static' ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this)
			},
			this))

			if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow
			this.$backdrop.addClass('in');
			if (!callback) return;
			doAnimate ? this.$backdrop.one('bsTransitionEnd', callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
		} else if (!this.isShown && this.$backdrop) {
			this.$backdrop.removeClass('in');
			var callbackRemove = function() {
				that.removeBackdrop();
				callback && callback();
			}
			$.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove()

		} else if (callback) {
			callback();
		}
	}

	Modal.prototype.checkScrollbar = function() {
		this.scrollbarWidth = this.measureScrollbar();
	}

	Modal.prototype.setScrollbar = function() {
		var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
		if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
	}

	Modal.prototype.resetScrollbar = function() {
		this.$body.css('padding-right', '')
	}

	Modal.prototype.measureScrollbar = function() { // thx walsh
		if (document.body.clientWidth >= window.innerWidth) return 0
		var scrollDiv = document.createElement('div');
		scrollDiv.className = 'modal-scrollbar-measure';
		this.$body.append(scrollDiv);
		var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
		this.$body[0].removeChild(scrollDiv);
		return scrollbarWidth;
	}

	// MODAL PLUGIN DEFINITION
	// =======================
	function Plugin(option, _relatedTarget) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.modal');
			var options = $.extend({},Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);
			if (!data) $this.data('bs.modal', (data = new Modal(this, options)));
			if (typeof option == 'string') data[option](_relatedTarget);
			else if (options.show) data.show(_relatedTarget);
		})
	}

	var old = $.fn.modal;
	$.fn.modal = Plugin;
	$.fn.modal.Constructor = Modal;

	// MODAL NO CONFLICT
	// =================
	$.fn.modal.noConflict = function() {
		$.fn.modal = old;
		return this;
	}

	// MODAL DATA-API
	// ==============
	$(document).on('click.bs.modal.data-api', '[data-toggle="modal"]',
	function(e) {
		var $this = $(this);
		var href = $this.attr('href');
		var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
		var option = $target.data('bs.modal') ? 'toggle': $.extend({remote: !/#/.test(href) && href},$target.data(), $this.data());

		if ($this.is('a')) e.preventDefault();
		$target.one('show.bs.modal',function(showEvent) {
			if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
			$target.one('hidden.bs.modal',function() {
				$this.is(':visible') && $this.trigger('focus');
			});
		});
		Plugin.call($target, option, this);
	});
} (window.jQuery);

/* =======================================================================
 * Bootstrap.dropdown.js v3.3.0
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
!function($) {
	'use strict';
	var backdrop = '.dropdown-backdrop';
	var toggle = '[data-toggle="dropdown"]';
	var Dropdown = function(element) {
		$(element).on('click.bs.dropdown', this.toggle)
	}
	Dropdown.VERSION = '3.3.5';
	function getParent($this) {
		var selector = $this.attr('data-target');
		if (!selector) {
			selector = $this.attr('href');
			selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
		}
		var $parent = selector && $(selector);
		return $parent && $parent.length ? $parent: $this.parent();
	}
	function clearMenus(e) {
		if (e && e.which === 3) return $(backdrop).remove();
		$(toggle).each(function() {
			var $this = $(this);
			var $parent = getParent($this);
			var relatedTarget = {
				relatedTarget: this
			}
			if (!$parent.hasClass('open')) return;
			if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));
			if (e.isDefaultPrevented()) return;
			$this.attr('aria-expanded', 'false');
			$parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget);
		});
	}
	Dropdown.prototype.toggle = function(e) {
		var $this = $(this);
		if ($this.is('.disabled, :disabled')) return;
		var $parent = getParent($this);
		var isActive = $parent.hasClass('open');
		clearMenus();
		if (!isActive) {
			if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
				// if mobile we use a backdrop because click events don't delegate
				$(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
			}
			var relatedTarget = {
				relatedTarget: this
			}
			$parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));
			if (e.isDefaultPrevented()) return $this.trigger('focus').attr('aria-expanded', 'true');
			$parent.toggleClass('open').trigger('shown.bs.dropdown', relatedTarget);
		}
		return false;
	}
	Dropdown.prototype.keydown = function(e) {
		if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;
		var $this = $(this);
		e.preventDefault();
		e.stopPropagation();
		if ($this.is('.disabled, :disabled')) return;
		var $parent = getParent($this);
		var isActive = $parent.hasClass('open');
		if (!isActive && e.which != 27 || isActive && e.which == 27) {
			if (e.which == 27)
			$parent.find(toggle).trigger('focus');
			return;
			$this.trigger('click');
		}
		var desc = ' li:not(.disabled):visible a';
		var $items = $parent.find('.dropdown-menu' + desc);
		if (!$items.length) return;
		var index = $items.index(e.target);
		if (e.which == 38 && index > 0) index-- // up
		if (e.which == 40 && index < $items.length - 1) index++; // down
		if (!~index) index = 0;
		$items.eq(index).trigger('focus');
	}
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.dropdown');
			if (!data) {
				$this.data('bs.dropdown', (data = new Dropdown(this)));
			}
			if (typeof option == 'string') {
				data[option].call($this);
			}
		});
	}
	var old = $.fn.dropdown;
	$.fn.dropdown = Plugin;
	$.fn.dropdown.Constructor = Dropdown;
	$.fn.dropdown.noConflict = function() {
		$.fn.dropdown = old;
		return this;
	}
	$(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form',
	function(e) {
		e.stopPropagation()
	}).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
} (window.jQuery);
$(function() {
	/*下拉菜单*/
	$(document).on("mouseenter", ".dropDown",
	function() {
		$(this).addClass("hover");
	});
	$(document).on("mouseleave", ".dropDown",
	function() {
		$(this).removeClass("hover");
	});
	$(document).on("mouseenter", ".dropDown_hover",
	function() {
		$(this).addClass("open");
	});
	$(document).on("mouseleave", ".dropDown_hover",
	function() {
		$(this).removeClass("open");
	});
	$(document).on("click", ".dropDown-menu li a",
	function() {
		$(".dropDown").removeClass('open');
	});
	$(document).on("mouseenter", ".menu > li",
	function() {
		$(this).addClass("open");
	});
	$(document).on("mouseleave", ".menu > li",
	function() {
		$(this).removeClass("open");
	});
});

/* =======================================================================
 * Bootstrap.transition.js v3.3.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
!function ($) {
	'use strict';
	function transitionEnd() {
		var el = document.createElement('bootstrap');
		var transEndEventNames = {
			WebkitTransition : 'webkitTransitionEnd',
			MozTransition    : 'transitionend',
			OTransition      : 'oTransitionEnd otransitionend',
			transition       : 'transitionend'
		}
		for (var name in transEndEventNames) {
			if (el.style[name] !== undefined) {
				return { end: transEndEventNames[name] }
			}
		}
		return false // explicit for ie8 (  ._.)
	}
	// http://blog.alexmaccaw.com/css-transitions
	$.fn.emulateTransitionEnd = function (duration) {
		var called = false;
		var $el = this;
		$(this).one('bsTransitionEnd', function () { called = true })
		var callback = function () {
			if (!called) $($el).trigger($.support.transition.end)
		}
		setTimeout(callback, duration);
		return this;
	}
	$(function () {
		$.support.transition = transitionEnd();
		if (!$.support.transition) return;
		$.event.special.bsTransitionEnd = {
			bindType: $.support.transition.end,
			delegateType: $.support.transition.end,
			handle: function (e) {
				if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
			}
		}
	})
}(window.jQuery);

/* =======================================================================
 * Bootstrap.tooltip.js v3.3.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
!function($) {
	'use strict';

	// TOOLTIP PUBLIC CLASS DEFINITION
	// ===============================
	var Tooltip = function(element, options) {
		this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null;
		this.init('tooltip', element, options);
	}

	Tooltip.VERSION = '3.3.0';
	Tooltip.TRANSITION_DURATION = 150;

	Tooltip.DEFAULTS = {
		animation: true,
		placement: 'top',
		selector: false,
		template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
		trigger: 'hover focus',
		title: '',
		delay: 0,
		html: false,
		container: false,
		viewport: {
			selector: 'body',
			padding: 0
		}
	}

	Tooltip.prototype.init = function(type, element, options) {
		this.enabled = true;
		this.type = type;
		this.$element = $(element);
		this.options = this.getOptions(options);
		this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport);

		var triggers = this.options.trigger.split(' ');
		for (var i = triggers.length; i--;) {
			var trigger = triggers[i];
			if (trigger == 'click') {
				this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
			} else if (trigger != 'manual') {
				var eventIn = trigger == 'hover' ? 'mouseenter': 'focusin';
				var eventOut = trigger == 'hover' ? 'mouseleave': 'focusout';
				this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
				this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
			}
		}

		this.options.selector ? (this._options = $.extend({},
		this.options, {
			trigger: 'manual',
			selector: ''
		})) : this.fixTitle()
	}

	Tooltip.prototype.getDefaults = function() {
		return Tooltip.DEFAULTS;
	}

	Tooltip.prototype.getOptions = function(options) {
		options = $.extend({},
		this.getDefaults(), this.$element.data(), options);
		if (options.delay && typeof options.delay == 'number') {
			options.delay = {
				show: options.delay,
				hide: options.delay
			}
		}
		return options;
	}

	Tooltip.prototype.getDelegateOptions = function() {
		var options = {}
		var defaults = this.getDefaults()

		this._options && $.each(this._options,
		function(key, value) {
			if (defaults[key] != value) options[key] = value;
		})

		return options;
	}

	Tooltip.prototype.enter = function(obj) {
		var self = obj instanceof this.constructor ?
		obj: $(obj.currentTarget).data('bs.' + this.type);

		if (self && self.$tip && self.$tip.is(':visible')) {
			self.hoverState = 'in';
			return;
		}

		if (!self) {
			self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
			$(obj.currentTarget).data('bs.' + this.type, self);
		}

		clearTimeout(self.timeout);
		self.hoverState = 'in';
		if (!self.options.delay || !self.options.delay.show) return self.show()

		self.timeout = setTimeout(function() {
			if (self.hoverState == 'in') self.show();
		},
		self.options.delay.show);
	}

	Tooltip.prototype.leave = function(obj) {
		var self = obj instanceof this.constructor ? obj: $(obj.currentTarget).data('bs.' + this.type);

		if (!self) {
			self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
			$(obj.currentTarget).data('bs.' + this.type, self);
		}
		clearTimeout(self.timeout);
		self.hoverState = 'out';

		if (!self.options.delay || !self.options.delay.hide) return self.hide();
		self.timeout = setTimeout(function() {

			if (self.hoverState == 'out') self.hide();
		},
		self.options.delay.hide);
	}

	Tooltip.prototype.show = function() {
		var e = $.Event('show.bs.' + this.type);
		if (this.hasContent() && this.enabled) {
			this.$element.trigger(e);

			var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
			if (e.isDefaultPrevented() || !inDom) return;
			var that = this;
			var $tip = this.tip();
			var tipId = this.getUID(this.type);

			this.setContent();
			$tip.attr('id', tipId);
			this.$element.attr('aria-describedby', tipId);

			if (this.options.animation) $tip.addClass('fade');

			var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

			var autoToken = /\s?auto?\s?/i;
			var autoPlace = autoToken.test(placement);
			if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

			$tip.detach().css({
				top: 0,
				left: 0,
				display: 'block'
			}).addClass(placement).data('bs.' + this.type, this);

			this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
			var pos = this.getPosition();
			var actualWidth = $tip[0].offsetWidth;
			var actualHeight = $tip[0].offsetHeight;

			if (autoPlace) {
				var orgPlacement = placement;
				var $container = this.options.container ? $(this.options.container) : this.$element.parent();
				var containerDim = this.getPosition($container);

				placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top': placement == 'top' && pos.top - actualHeight < containerDim.top ? 'bottom': placement == 'right' && pos.right + actualWidth > containerDim.width ? 'left': placement == 'left' && pos.left - actualWidth < containerDim.left ? 'right': placement
				$tip.removeClass(orgPlacement).addClass(placement);
			}

			var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
			this.applyPlacement(calculatedOffset, placement);
			var complete = function() {
				var prevHoverState = that.hoverState;
				that.$element.trigger('shown.bs.' + that.type);
				that.hoverState = null;
				if (prevHoverState == 'out') that.leave(that);
			}

			$.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete()
		}
	}

	Tooltip.prototype.applyPlacement = function(offset, placement) {
		var $tip = this.tip();
		var width = $tip[0].offsetWidth;
		var height = $tip[0].offsetHeight;

		// manually read margins because getBoundingClientRect includes difference
		var marginTop = parseInt($tip.css('margin-top'), 10);
		var marginLeft = parseInt($tip.css('margin-left'), 10);

		// we must check for NaN for ie 8/9
		if (isNaN(marginTop)) marginTop = 0;
		if (isNaN(marginLeft)) marginLeft = 0;

		offset.top = offset.top + marginTop;
		offset.left = offset.left + marginLeft;

		// $.fn.offset doesn't round pixel values
		// so we use setOffset directly with our own function B-0
		$.offset.setOffset($tip[0], $.extend({
			using: function(props) {
				$tip.css({
					top: Math.round(props.top),
					left: Math.round(props.left)
				})
			}
		},
		offset), 0);

		$tip.addClass('in');

		// check to see if placing tip in new offset caused the tip to resize itself
		var actualWidth = $tip[0].offsetWidth;
		var actualHeight = $tip[0].offsetHeight;

		if (placement == 'top' && actualHeight != height) {
			offset.top = offset.top + height - actualHeight;
		}

		var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

		if (delta.left) offset.left += delta.left;
		else offset.top += delta.top;

		var isVertical = /top|bottom/.test(placement);
		var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth: delta.top * 2 - height + actualHeight;
		var arrowOffsetPosition = isVertical ? 'offsetWidth': 'offsetHeight';

		$tip.offset(offset);
		this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
	}

	Tooltip.prototype.replaceArrow = function(delta, dimension, isHorizontal) {
		this.arrow().css(isHorizontal ? 'left': 'top', 50 * (1 - delta / dimension) + '%').css(isHorizontal ? 'top': 'left', '');
	}

	Tooltip.prototype.setContent = function() {
		var $tip = this.tip();
		var title = this.getTitle();
		$tip.find('.tooltip-inner')[this.options.html ? 'html': 'text'](title);
		$tip.removeClass('fade in top bottom left right');
	}

	Tooltip.prototype.hide = function(callback) {
		var that = this;
		var $tip = this.tip();
		var e = $.Event('hide.bs.' + this.type);
		function complete() {
			if (that.hoverState != 'in') $tip.detach();
			that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type);
			callback && callback();
		}
		this.$element.trigger(e);
		if (e.isDefaultPrevented()) return;
		$tip.removeClass('in');

		$.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
		this.hoverState = null;
		return this;
	}

	Tooltip.prototype.fixTitle = function() {
		var $e = this.$element
		if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
			$e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
		}
	}

	Tooltip.prototype.hasContent = function() {
		return this.getTitle();
	}

	Tooltip.prototype.getPosition = function($element) {
		$element = $element || this.$element;
		var el = $element[0];
		var isBody = el.tagName == 'BODY';
		var elRect = el.getBoundingClientRect();
		if (elRect.width == null) {
			// width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
			elRect = $.extend({},
			elRect, {
				width: elRect.right - elRect.left,
				height: elRect.bottom - elRect.top
			});
		}
		var elOffset = isBody ? {
			top: 0,
			left: 0
		}: $element.offset();
		var scroll = {
			scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop: $element.scrollTop()
		}
		var outerDims = isBody ? {
			width: $(window).width(),
			height: $(window).height()
		}: null
		return $.extend({},
		elRect, scroll, outerDims, elOffset)
	}

	Tooltip.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
		return placement == 'bottom' ? {
			top: pos.top + pos.height,
			left: pos.left + pos.width / 2 - actualWidth / 2
		}: placement == 'top' ? {
			top: pos.top - actualHeight,
			left: pos.left + pos.width / 2 - actualWidth / 2
		}: placement == 'left' ? {
			top: pos.top + pos.height / 2 - actualHeight / 2,
			left: pos.left - actualWidth
		}:
		/* placement == 'right' */
		{
			top: pos.top + pos.height / 2 - actualHeight / 2,
			left: pos.left + pos.width
		}

	}

	Tooltip.prototype.getViewportAdjustedDelta = function(placement, pos, actualWidth, actualHeight) {
		var delta = {
			top: 0,
			left: 0
		}
		if (!this.$viewport) return delta;

		var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
		var viewportDimensions = this.getPosition(this.$viewport);

		if (/right|left/.test(placement)) {
			var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
			var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
			if (topEdgeOffset < viewportDimensions.top) { // top overflow
				delta.top = viewportDimensions.top - topEdgeOffset;
			} else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
				delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
			}
		} else {
			var leftEdgeOffset = pos.left - viewportPadding;
			var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
			if (leftEdgeOffset < viewportDimensions.left) { // left overflow
				delta.left = viewportDimensions.left - leftEdgeOffset;
			} else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
				delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
			}
		}
		return delta
	}

	Tooltip.prototype.getTitle = function() {
		var title;
		var $e = this.$element;
		var o = this.options;
		title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)
		return title;
	}

	Tooltip.prototype.getUID = function(prefix) {
		do prefix += ~~ (Math.random() * 1000000);
		while (document.getElementById(prefix));
		return prefix;
	}

	Tooltip.prototype.tip = function() {
		return (this.$tip = this.$tip || $(this.options.template));
	}

	Tooltip.prototype.arrow = function() {
		return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'));
	}

	Tooltip.prototype.enable = function() {
		this.enabled = true;
	}

	Tooltip.prototype.disable = function() {
		this.enabled = false;
	}

	Tooltip.prototype.toggleEnabled = function() {
		this.enabled = !this.enabled;
	}

	Tooltip.prototype.toggle = function(e) {
		var self = this;
		if (e) {
			self = $(e.currentTarget).data('bs.' + this.type);
			if (!self) {
				self = new this.constructor(e.currentTarget, this.getDelegateOptions());
				$(e.currentTarget).data('bs.' + this.type, self);
			}
		}
		self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
	}

	Tooltip.prototype.destroy = function() {
		var that = this;
		clearTimeout(this.timeout);
		this.hide(function() {
			that.$element.off('.' + that.type).removeData('bs.' + that.type);
		});
	}

	// TOOLTIP PLUGIN DEFINITION
	// =========================
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.tooltip');
			var options = typeof option == 'object' && option;
			var selector = options && options.selector;

			if (!data && option == 'destroy') return;
			if (selector) {
				if (!data) $this.data('bs.tooltip', (data = {}));
				if (!data[selector]) data[selector] = new Tooltip(this, options);
			} else {
				if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)));
			}
			if (typeof option == 'string') data[option]()
		})
	}

	var old = $.fn.tooltip;
	$.fn.tooltip = Plugin;
	$.fn.tooltip.Constructor = Tooltip;
	// TOOLTIP NO CONFLICT
	// ===================
	$.fn.tooltip.noConflict = function() {
		$.fn.tooltip = old;
		return this;
	}
} (window.jQuery);
$(function() {
	$("[data-toggle='tooltip']").tooltip();
});

/* =======================================================================
 * Bootstrap.popover.js v3.3.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
!
function($) {
	'use strict';
	// POPOVER PUBLIC CLASS DEFINITION
	// ===============================
	var Popover = function(element, options) {
		this.init('popover', element, options)
	}

	if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');
	Popover.VERSION = '3.3.0';
	Popover.DEFAULTS = $.extend({},
	$.fn.tooltip.Constructor.DEFAULTS, {
		placement: 'right',
		trigger: 'click',
		content: '',
		template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
	})

	// NOTE: POPOVER EXTENDS tooltip.js
	// ================================
	Popover.prototype = $.extend({},$.fn.tooltip.Constructor.prototype);
	Popover.prototype.constructor = Popover;
	Popover.prototype.getDefaults = function() {
		return Popover.DEFAULTS;
	}

	Popover.prototype.setContent = function() {
		var $tip = this.tip();
		var title = this.getTitle();
		var content = this.getContent();

		$tip.find('.popover-title')[this.options.html ? 'html': 'text'](title);
		$tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
			this.options.html ? (typeof content == 'string' ? 'html': 'append') : 'text'](content)

		$tip.removeClass('fade top bottom left right in');

		// IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
		// this manually by checking the contents.
		if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
	}

	Popover.prototype.hasContent = function() {
		return this.getTitle() || this.getContent()
	}

	Popover.prototype.getContent = function() {
		var $e = this.$element;
		var o = this.options;

		return $e.attr('data-content') || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content)
	}

	Popover.prototype.arrow = function() {
		return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
	}

	Popover.prototype.tip = function() {
		if (!this.$tip) this.$tip = $(this.options.template);
		return this.$tip;
	}

	// POPOVER PLUGIN DEFINITION
	// =========================
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.popover');
			var options = typeof option == 'object' && option;
			var selector = options && options.selector;

			if (!data && option == 'destroy') return;
			if (selector) {
				if (!data) $this.data('bs.popover', (data = {}));
				if (!data[selector]) data[selector] = new Popover(this, options);
			} else {
				if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
			}
			if (typeof option == 'string') data[option]()
		})
	}

	var old = $.fn.popover

	$.fn.popover = Plugin;
	$.fn.popover.Constructor = Popover;

	// POPOVER NO CONFLICT
	// ===================
	$.fn.popover.noConflict = function() {
		$.fn.popover = old;
		return this;
	}
} (window.jQuery);
$(function() {
	$("[data-toggle='popover']").popover();
});

/* =======================================================================
 * Bootstrap.alert.js v3.3.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
!function($) {
	'use strict';
	// ALERT CLASS DEFINITION
	// ======================
	var dismiss = '[data-dismiss="alert"]'
	var Alert = function(el) {
		$(el).on('click', dismiss, this.close)
	}

	Alert.VERSION = '3.3.0'

	Alert.TRANSITION_DURATION = 150

	Alert.prototype.close = function(e) {
		var $this = $(this);
		var selector = $this.attr('data-target');

		if (!selector) {
			selector = $this.attr('href');
			selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
		}

		var $parent = $(selector);
		if (e) e.preventDefault();
		if (!$parent.length) {
			$parent = $this.closest('.alert');
		}

		$parent.trigger(e = $.Event('close.bs.alert'))

		if (e.isDefaultPrevented()) return;

		$parent.removeClass('in');
		function removeElement() {
			// detach from parent, fire event then clean up data
			$parent.detach().trigger('closed.bs.alert').remove();
		}

		$.support.transition && $parent.hasClass('fade') ? $parent.one('bsTransitionEnd', removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement()
	}

	// ALERT PLUGIN DEFINITION
	// =======================
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.alert');
			if (!data) $this.data('bs.alert', (data = new Alert(this)));
			if (typeof option == 'string') data[option].call($this);
		})
	}

	var old = $.fn.alert;
	$.fn.alert = Plugin;
	$.fn.alert.Constructor = Alert;

	// ALERT NO CONFLICT
	// =================
	$.fn.alert.noConflict = function() {
		$.fn.alert = old;
		return this;
	}
	// ALERT DATA-API
	// ==============
	$(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)
} (window.jQuery);

/* ============================================================
 * Bootstrap.Switch v1.3 by Larentis Mattia @spiritualGuru
 * http://www.larentis.eu/switch/
 * ============================================================
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * ============================================================ */
!function($) {
	"use strict";
	$.fn['bootstrapSwitch'] = function(method) {
		var methods = {
			init: function() {
				return this.each(function() {
					var $element = $(this),
					$div,
					$switchLeft,
					$switchRight,
					$label,
					myClasses = "",
					classes = $element.attr('class'),
					color,
					moving,
					onLabel = "ON",
					offLabel = "OFF",
					icon = false;

					$.each(['size-MINI', 'size-S', 'size-L'],
					function(i, el) {
						if (classes.indexOf(el) >= 0) myClasses = el;
					});
					$element.addClass('has-switch');
					if ($element.data('on') !== undefined) color = "switch-" + $element.data('on');
					if ($element.data('on-label') !== undefined) onLabel = $element.data('on-label');
					if ($element.data('off-label') !== undefined) offLabel = $element.data('off-label');
					if ($element.data('icon') !== undefined) icon = $element.data('icon');
					$switchLeft = $('<span>').addClass("switch-left").addClass(myClasses).addClass(color).html(onLabel);
					color = '';
					if ($element.data('off') !== undefined) color = "switch-" + $element.data('off');
					$switchRight = $('<span>').addClass("switch-right").addClass(myClasses).addClass(color).html(offLabel);
					$label = $('<label>').html("&nbsp;").addClass(myClasses).attr('for', $element.find('input').attr('id'));
					if (icon) {
						$label.html('<i class="icon icon-' + icon + '"></i>');
					}

					$div = $element.find(':checkbox').wrap($('<div>')).parent().data('animated', false);
					if ($element.data('animated') !== false) $div.addClass('switch-animate').data('animated', true);
					$div.append($switchLeft).append($label).append($switchRight);
					$element.find('>div').addClass($element.find('input').is(':checked') ? 'switch-on': 'switch-off');
					if ($element.find('input').is(':disabled')) $(this).addClass('deactivate');
					var changeStatus = function($this) {
						$this.siblings('label').trigger('mousedown').trigger('mouseup').trigger('click');
					};
					$element.on('keydown',
					function(e) {
						if (e.keyCode === 32) {
							e.stopImmediatePropagation();
							e.preventDefault();
							changeStatus($(e.target).find('span:first'));
						}
					});
					$switchLeft.on('click',
					function(e) {
						changeStatus($(this));
					});

					$switchRight.on('click',
					function(e) {
						changeStatus($(this));
					});
					$element.find('input').on('change',
					function(e) {
						var $this = $(this),
						$element = $this.parent(),
						thisState = $this.is(':checked'),
						state = $element.is('.switch-off');
						e.preventDefault();
						$element.css('left', '');
						if (state === thisState) {
							if (thisState) $element.removeClass('switch-off').addClass('switch-on');
							else $element.removeClass('switch-on').addClass('switch-off');
							if ($element.data('animated') !== false) $element.addClass("switch-animate");
							$element.parent().trigger('switch-change', {
								'el': $this,
								'value': thisState
							})
						}
					});

					$element.find('label').on('mousedown touchstart',
					function(e) {
						var $this = $(this);
						moving = false;
						e.preventDefault();
						e.stopImmediatePropagation();
						$this.closest('div').removeClass('switch-animate');
						if ($this.closest('.has-switch').is('.deactivate')) $this.unbind('click');
						else {
							$this.on('mousemove touchmove',
							function(e) {
								var $element = $(this).closest('.switch'),
								relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - $element.offset().left,
								percent = (relativeX / $element.width()) * 100,
								left = 25,
								right = 75;
								moving = true;
								if (percent < left) percent = left;
								else if (percent > right) percent = right;
								$element.find('>div').css('left', (percent - right) + "%")
							});

							$this.on('click touchend',
							function(e) {
								var $this = $(this),
								$target = $(e.target),
								$myCheckBox = $target.siblings('input');
								e.stopImmediatePropagation();
								e.preventDefault();
								$this.unbind('mouseleave');
								if (moving) $myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25));
								else $myCheckBox.prop("checked", !$myCheckBox.is(":checked"));
								moving = false;
								$myCheckBox.trigger('change');
							});

							$this.on('mouseleave',
							function(e) {
								var $this = $(this),
								$myCheckBox = $this.siblings('input');
								e.preventDefault();
								e.stopImmediatePropagation();
								$this.unbind('mouseleave');
								$this.trigger('mouseup');
								$myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25)).trigger('change');
							});

							$this.on('mouseup',
							function(e) {
								e.stopImmediatePropagation();
								e.preventDefault();
								$(this).unbind('mousemove');
							});
						}
					});
				});
			},
			toggleActivation: function() {
				$(this).toggleClass('deactivate');
			},
			isActive: function() {
				return ! $(this).hasClass('deactivate');
			},
			setActive: function(active) {
				if (active) $(this).removeClass('deactivate');
				else $(this).addClass('deactivate');
			},
			toggleState: function(skipOnChange) {
				var $input = $(this).find('input:checkbox');
				$input.prop('checked', !$input.is(':checked')).trigger('change', skipOnChange);
			},
			setState: function(value, skipOnChange) {
				$(this).find('input:checkbox').prop('checked', value).trigger('change', skipOnChange);
			},
			status: function() {
				return $(this).find('input:checkbox').is(':checked');
			},
			destroy: function() {
				var $div = $(this).find('div'),
				$checkbox;
				$div.find(':not(input:checkbox)').remove();
				$checkbox = $div.children();
				$checkbox.unwrap().unwrap();
				$checkbox.unbind('change');
				return $checkbox;
			}
		};

		if (methods[method]) return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		else if (typeof method === 'object' || !method) return methods.init.apply(this, arguments);
		else $.error('Method ' + method + ' does not exist!');
	};
} (jQuery);

$(function() {
	$('.switch')['bootstrapSwitch']();
});
