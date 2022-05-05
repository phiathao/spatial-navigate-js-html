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
                )
			});
		});
        
        // Mouse navigation
        if(inputOption.mouseEnabled) {
            document.addEventListener("keydown", Spatial.mouseDisabled, true);
            document.addEventListener("wheel", Spatial.mouseEnabled, true);
        }
	},
    mouseDisabled: (event) => {},
    mouseEnabled: (event) => {},
    navigate: (event) => {

    }
};
console.log("spatial script added");
