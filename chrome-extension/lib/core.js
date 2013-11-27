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
        length: 14,
        repeat: 0,
        autosend: true,
        servicename: true
    },
    settings = {};

// @todo it works asynchronously... so we need to access the data when it's there later on or use the chrome storage api
var getLocalStorageByKey = function (key) {
    chrome.extension.sendMessage({method: "getLocalStorage", key: key}, function (response) {
        settings[key] = response.data;
    });
};

var getVaultSettings = function () {
    var settings     = {},
        charSettings = [];

    getLocalStorageByKey('plength');
    getLocalStorageByKey('repeat');
    getLocalStorageByKey('autosend');
    getLocalStorageByKey('servicename');

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
};