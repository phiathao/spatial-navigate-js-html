// if no option is set, option will be set to default
var defaultOption = {
    focusOption: "firstElement",
    mouseEnabled: false
};
var _option = {
    focusOption: defaultOption.focusOption,
    mouseEnabled: defaultOption.focusOption
};
// store variable to handle movement
var _lastElement = {};
var _lastHoverElement = undefined;
var _sections = undefined;
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
    init: function (inputOption) {
        if (inputOption && typeof inputOption === "object") {
            //define spatial option
            Object.keys(inputOption).map(function (k, i) {
                if (_option[k]) {
                    _option[k] = inputOption[k];
                }
            });
        }
        // define selectable section base off html
        var selectableElement = document.querySelector('[focusable-section="true"]');
        _sections = selectableElement;
    }
};
console.log("spatial script added");
