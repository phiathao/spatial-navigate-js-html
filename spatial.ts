// if no option is set, option will be set to default
var defaultOption = {
    focusOption: "firstElement",
    mouseEnabled: false,
};

var _option = {
    focusOption: defaultOption.focusOption,
    mouseEnabled: defaultOption.focusOption
}

// store variable to handle movement
var _lastElement = {};
var _lastHoverElement = undefined;
var _sections = [];
var _mouseEnabled = false;

// reset variable
function cleanup() {
    _lastElement = {}
    _lastHoverElement = undefined;
    _sections = [];
    _mouseEnabled = false;
}

// hover custom event
var hoverEvent = new CustomEvent("hover");
var hoverLeaveEvent = new CustomEvent("hover-leave");

window.addEventListener("hashchange", cleanup);

var Spatial = {

    // start spatial navigation
    init: (options: typeof defaultOption | undefined){
    }
}