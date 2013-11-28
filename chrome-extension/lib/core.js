var $ = function (selector) {
    return document.getElementById(selector);
};

var on = function (element, event, listener) {
    if (!element) {
        return;
    }

    if ('string' === typeof event) {
        event = [event];
    }

    for (var i = 0; i < event.length; i++) {
        if (element.addEventListener) {
            element.addEventListener(event[i], listener, false);
        } else {
            element.attachEvent('on' + event[i], listener);
        }
    }
};
