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

var DEFAULT_SETTINGS = {
        length: 20,
        repeat: 0,
        autosend: false,
        servicename: true
    },
    settings = {};

// @todo use promises to retrieve options?
var getLocalStorageByKey = function (key) {
    return chrome.storage.local.get(key, function (items) {
        settings[key] = items[key];
    });
};

function getVaultSettings() {
    var settings     = {},
        charSettings = [];

    setTimeout(function() {
        console.log(settings);
    }, 300);

    console.log(getLocalStorageByKey('plength'));
    console.log(getLocalStorageByKey('repeat'));
    console.log(getLocalStorageByKey('autosend'));
    console.log(getLocalStorageByKey('servicename'));


    settings.length      = undefined !== settings.plength ? settings.plength : DEFAULT_SETTINGS.length;
    settings.repeat      = undefined !== settings.repeat ? settings.repeat : DEFAULT_SETTINGS.repeat;
    settings.autosend    = undefined !== settings.autosend ? settings.autosend: DEFAULT_SETTINGS.autosend;
    settings.servicename = undefined !== settings.servicename ? settings.servicename: DEFAULT_SETTINGS.servicename;

    for (var x in charSettings) {
        if (charSettings.hasOwnProperty(x)) {
            settings[x] = charSettings[x];
        }
    }

    return settings;
}