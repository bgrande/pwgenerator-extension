var DEFAULT_SETTINGS = {
        length: 20,
        repeat: 0,
        autosend: false,
        servicename: 'login',
        defServicename: undefined,
        lower: undefined,
        upper: undefined,
        number: undefined,
        dash: undefined,
        space: undefined,
        symbol: undefined,
        prefix: false,
        suffix: false
    },
    TYPES = 'lower upper number dash space symbol'.split(' ');

var $ = function (selector) {
    'use strict';

    return document.getElementById(selector);
};

var on = function (element, event, listener) {
    'use strict';
    
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