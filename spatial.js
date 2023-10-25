var defaultOption = {
	focusOption: "firstEl",
	mouseEnabled: false,
};
var _options = {
	focusOption: "firstEl",
	mouseEnabled: false,
};
var _lastEl = {};
var _lastHoverEl;
var _sections = [];
var _mouseEnabled = false;

var hoverEvent = new CustomEvent("hover");
var hoverLeaveEvent = new CustomEvent("hoverleave");
var nextFocus;

function cleanup() {
	_lastEl = {};
	_lastHoverEl = undefined;
	_sections = [];
	_mouseEnabled = true;
}
window.addEventListener("hashchange", cleanup);
export var Spatial = {
	init: (options) => {
		if (_options.focusOption === "lastEl") {
			_lastEl = {};
		}
		// find all elements section
		if (options) {
			_options = { ...defaultOption };
		}
		if (options && typeof options === "object") {
			Object.keys(options).map((key, index) => {
				if (_options[key]) {
					_options[key] = options[key];
				}
			});
		}
		let els = document.querySelectorAll('[focusable-section="true"]');
		_sections = els;
		els.forEach((element, index) => {
			// assign key to element section
			// if (element.hasAttribute("focus-id")) {
			// 	let elId = element.getAttribute("focus-id");
			// 	element.setAttribute("id", elId);
			// }
			element.setAttribute("section-number", index);

			// make children tabable
			let childrens = element.children;
			let childrensArray = Array.from(childrens);
			childrensArray.forEach((childElement, index2) => {
				childElement.setAttribute("tabindex", "-1");
				childElement.classList.add(`focus-item`);
				childElement.addEventListener(
					"keydown",
					Spatial.navigate,
					true
				);
			});
		});
		if (options.mouseEnabled) {
			document.addEventListener("keydown", Spatial.mouseDisabled, true);
			document.addEventListener("wheel", Spatial.mouseEnabled, true);
		}
	},
	mouseDisabled: (event) => {
		if (_mouseEnabled) {
			if (
				[
					"Space",
					"ArrowUp",
					"ArrowDown",
					"ArrowLeft",
					"ArrowRight",
				].indexOf(event.code) > -1
			) {
				event.preventDefault();
				_mouseEnabled = false;
				// clean up eventlistener
				let _itm = Array.from(
					document.getElementsByClassName("focus-item")
				);
				_itm.forEach((element, index) => {
					element.removeEventListener(
						"mouseover",
						Spatial.mouseNavigate
					);
					element.removeEventListener(
						"mouseout",
						Spatial.mouseNavigate
					);
				});

				if (_lastHoverEl) {
					_lastHoverEl.focus();
				} else {
					document.querySelector(".focus-item").focus();
				}
			}
		} else {
		}
	},
	mouseEnabled: (event) => {
		if (!_mouseEnabled) {
			_mouseEnabled = true;
			document.activeElement.blur();
			// add event listener to item
			let _itm = Array.from(
				document.getElementsByClassName("focus-item")
			);
			_itm.forEach((element, index) => {
				element.addEventListener("mouseover", Spatial.mouseNavigate);
				element.addEventListener("mouseout", Spatial.mouseNavigate);
			});
		}
	},
	mouseNavigate: (event) => {
		let focusableEl, closestSection;
		if (event.type === "mouseout") {
			focusableEl = event.target.closest(".focus-item");
			if (focusableEl !== document.activeElement) {
				focusableEl.dispatchEvent(hoverLeaveEvent);
			}
		} else {
			focusableEl = event.target.closest(".focus-item");
			if (focusableEl !== document.activeElement) {
				focusableEl.dispatchEvent(hoverEvent);
				closestSection = event.target.closest(
					'[focusable-section="true"]'
				);
				// _lastEl[
				// 	parseInt(closestSection.getAttribute("section-number"))
				// ] = focusableEl;
				_lastHoverEl = focusableEl;
			}
		}
	},
	navigate: (event) => {
		if (
			[
				"Space",
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight",
			].indexOf(event.code) > -1
		) {
			event.preventDefault();
		}
		let nextEl;
		let closestSection;
		let nextParentEl;
		let nextParentElId;
		// if(event.target.)
		switch (event.keyCode) {
			case 37: // left
				if (event.target.hasAttribute("focus-left")) {
					nextFocus = new CustomEvent("next-focus", {
						detail: { direction: "left" },
					});
					event.target.dispatchEvent(nextFocus);
				} else {
					closestSection = event.target.closest(
						'[focusable-section="true"]'
					);
					nextEl = event.target.previousSibling;
					if (closestSection) {
						if (nextEl) {
							_lastEl[
								parseInt(
									closestSection.getAttribute(
										"section-number"
									)
								)
							] = nextEl;
						}
					}
					if (nextEl) {
						nextEl.focus();
					}
				}
				break;
			case 39: // right
				closestSection = event.target.closest(
					'[focusable-section="true"]'
				);
				nextEl = event.target.nextSibling;
				if (closestSection) {
					if (nextEl) {
						_lastEl[
							parseInt(
								closestSection.getAttribute("section-number")
							)
						] = nextEl;
					}
				}
				if (nextEl) {
					nextEl.focus();
				}
				break;
			case 38: // up
				closestSection = event.target.closest(
					'[focusable-section="true"]'
				);
				if (closestSection) {
					_lastEl[
						parseInt(closestSection.getAttribute("section-number"))
					] = event.target;
				}
				nextParentEl = document.querySelector(
					`[section-number="${
						parseInt(
							closestSection.getAttribute("section-number")
						) - 1
					}"]`
				);
				if (
					nextParentEl &&
					nextParentEl.hasAttribute("focusable-section")
				) {
					if (_options.focusOption === "lastEl") {
						nextParentElId =
							nextParentEl.getAttribute("section-number");
						if (_lastEl[nextParentElId]) {
							_lastEl[nextParentElId].focus();
						} else {
							nextParentEl.children[0].focus();
							_lastEl[nextParentElId] = nextParentEl.children[0];
							_lastEl[
								closestSection.getAttribute("section-number")
							] = event.target;
						}
					} else {
						nextParentEl.children[0].focus();
					}
				}
				break;
			case 40: //down
				closestSection = event.target.closest(
					'[focusable-section="true"]'
				);
				if (closestSection) {
					_lastEl[
						parseInt(closestSection.getAttribute("section-number"))
					] = event.target;
				}
				nextParentEl = document.querySelector(
					`[section-number="${
						parseInt(
							closestSection.getAttribute("section-number")
						) + 1
					}"]`
				);
				if (
					nextParentEl &&
					nextParentEl.hasAttribute("focusable-section")
				) {
					if (_options.focusOption === "lastEl") {
						nextParentElId =
							nextParentEl.getAttribute("section-number");
						if (_lastEl[nextParentElId]) {
							_lastEl[nextParentElId].focus();
						} else {
							nextParentEl.children[0].focus();
							_lastEl[nextParentElId] = nextParentEl.children[0];
							_lastEl[
								closestSection.getAttribute("section-number")
							] = event.target;
						}
						// if(!_lastEl[closestSection])
					} else {
						nextParentEl.children[0].focus();
					}
				}
				break;
			default:
		}
	},
};
