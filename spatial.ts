type spatialOption = {
	focusOption: "firstElement" | "lastElement";
	mouseEnabled: boolean;
};

// if no option is set, option will be set to default
var defaultOption = {
	focusOption: "firstElement",
	mouseEnabled: false,
};

var _option = {
	focusOption: defaultOption.focusOption,
	mouseEnabled: defaultOption.focusOption,
};

// store variable to handle movement
var _lastElement = {};
var _lastHoverElement = undefined;
var _sections: Element[] = undefined;
var _mouseEnabled = false;

// reset variable
function cleanup() {
	_lastElement = {};
	_lastHoverElement = undefined;
	_sections = undefined;
	_mouseEnabled = false;
}

// hover custom event
var hoverEvent = new CustomEvent("hover");
var hoverLeaveEvent = new CustomEvent("hover-leave");
var nextFocus;

window.addEventListener("hashchange", cleanup);

var Spatial = {
	// start spatial navigation
	init: (inputOption: spatialOption | undefined) => {
		if (inputOption && typeof inputOption === "object") {
			//define spatial option
			Object.keys(inputOption).map((k, i) => {
				if (_option[k]) {
					_option[k] = inputOption[k];
				}
			});
		}

		// define selectable section base off html
		let selectableElement = document.querySelector<Element>(
			'[focusable-section="true"]'
		);
		for (let i in selectableElement)
			_sections.push(selectableElement[i] as Element);

		_sections.forEach((element, index) => {
			// assign key to element section
			element.setAttribute("section-number", index.toString());

			// make children tabable
			let childrens = element.children;
			let childrensArray = Array.from(childrens);

			childrensArray.forEach((childElement, childIndex) => {
				childElement.setAttribute("tabindex", "-1");
				childElement.classList.add("focus-item");

				// attach event listener to item
				childElement.addEventListener(
					"keydown",
					Spatial.navigate,
					true
				);
			});
		});

		// Mouse navigation
		if (inputOption.mouseEnabled) {
			document.addEventListener("keydown", Spatial.mouseDisabled, true);
			document.addEventListener("wheel", Spatial.mouseEnabled, true);
		}
	},
	mouseDisabled: (event) => {},
	mouseEnabled: (event) => {},
	navigate: (event) => {
		// define acceptable input
		if (
			[
				"Space",
				"ArrowUp",
				"ArrowDown",
				"ArrowRight",
				"ArrowLeft",
			].indexOf(event.code) > -1
		) {
			event.preventDefault();
		}

		// action and variable
		let nextElement, closestSection, nextParentElement, nextParentElementId;
		switch (event) {
			// Left button keyCode and Code
			case event.keyCode === 37:
			case event.code === "ArrowLeft":
				// Have a target selectable item
				if (event.target.hasAttribute("focus-left")) {
					let targetElement = event.target.getAttribute("focus-left");
					nextElement = document.querySelector(
						`[focus-name="${targetElement}"]`
					);
					if (nextElement.hasAttribute("focusable-section")) {
						nextElement.children[0].focus();
					} else {
						nextElement.focus();
					}
				} else {
					// No Target selectable item
					closestSection = event.target.cloest(
						'[focusable-section="true"]'
					);
					// If sibling exist it will be target for next focus
					nextElement = event.target.previousSibling;

					// Remember location for section
					if (
						_option.focusOption === "lastElement" &&
						closestSection &&
						nextElement
					) {
						_lastElement[
							parseInt(
								closestSection.getAttribute("section-number")
							)
						] = nextElement;
					}
					if (nextElement) {
						nextElement.focus();
					}
				}
				break;
			// Right button keyCode and Code
			case event.keyCode === 39:
			case event.code === "ArrowRight":
				if (event.target.hasAttribute("focus-right")) {
					let targetElement =
						event.target.getAttribute("focus-right");
					nextElement = document.querySelector(
						`[focus-name="${targetElement}"]`
					);
					if (nextElement.hasAttribute("focusable-section")) {
						nextElement.children[0].focus();
					} else {
						nextElement.focus();
					}
				} else {
					closestSection = event.target.cloest(
						'[focusable-section="true"]'
					);
					nextElement = event.target.nextSibling;
					if (
						_option.focusOption === "lastElement" &&
						closestSection &&
						nextElement
					) {
						_lastElement[
							parseInt(
								closestSection.getAttribute("section-number")
							)
						] = nextElement;
					}
					if (nextElement) {
						nextElement.focus();
					}
				}
				break;
			// Arrow Up and Down is use to navigate between different section such as the different row
			// in some case it can go to the header or footer
			case event.keyCode === 38:
			case event.code === "ArrowUp":
				if (event.target.hasAttribute("focus-up")) {
					let targetElement = event.target.getAttribute("focus-up");
					nextElement = document.querySelector(
						`[focus-name="${targetElement}"]`
					);
					if (nextElement.hasAttribute("focusable-section")) {
						nextElement.children[0].focus();
					} else {
						nextElement.focus();
					}
				} else {
					// get section
					closestSection = event.target.cloest(
						'[focusable-section="true"]'
					);
					let closestSectionNumber = parseInt(
						closestSection.getAttribute("section-number")
					);

					// store current element to variable
					if (closestSectionNumber) {
						_lastElement[closestSectionNumber] = event.target;
					}
					// Get next section element
                    // If next parent element have a store element and option is to remember it
                    // focus the remembered element or else focus first child of it if it doesn't
                    // If no option just go to first child of next section
					nextParentElement = document.querySelector(
						`[section-number="${closestSectionNumber - 1}]`
					);
					if (
						nextParentElement &&
						nextParentElement.hasAttribute("focusable-section")
					) {
						if (_option.focusOption === "lastElement") {
							// Find out if previous section save an element to focus on
							nextParentElementId =
								nextParentElement.getAttribute(
									"section-number"
								);
							if (_lastElement[nextParentElementId]) {
								_lastElement[nextParentElementId].focus();
							} else {
								nextParentElement.children[0].focus();
							}
						} else {
							nextParentElement.children[0].focus();
						}
					}
				}
				break;
			case event.keyCode === 40:
			case event.code === "ArrowDown":
				break;
			default:
		}
	},
};
console.log("spatial script added");
