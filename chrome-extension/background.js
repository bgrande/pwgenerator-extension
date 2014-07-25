'use strict';

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, { file: "lib/crypto-js-3.1.2.js", allFrames: true }, function () {});
    chrome.tabs.executeScript(tab.id, { file: "lib/vault.js", allFrames: true }, function () {});
    chrome.tabs.executeScript(tab.id, { file: "lib/core.js", allFrames: true }, function () {});
    chrome.tabs.executeScript(tab.id, { file: "lib/generator.js", allFrames: true }, function () {});
    chrome.tabs.executeScript(tab.id, { file: "app/overlay.js", allFrames: true }, function () {});
    chrome.tabs.executeScript(tab.id, { file: "app/generate.js", allFrames: true }, function () {});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!request || (request.event !== 'countChange' && request.event !== 'saveOverwrite')) {
        return false;
    }

    switch (request.event) {
        case 'countChange':
            if (request.overlayCount && request.overlayCount !== 0) {
                chrome.browserAction.setBadgeText({
                    text: '' + request.overlayCount,
                    tabId: sender.tab.id
                });
            } else {
                chrome.browserAction.setBadgeText({
                    text: '',
                    tabId: sender.tab.id
                });
            }
            break;

        case 'saveOverwrite':
            if (request.settings && typeof(request.settings) === 'object') {
                var newSettings = request.settings;

                chrome.storage.sync.get('settings', function (items) {
                    var settings = JSON.parse(items.settings);
                    settings['serviceExceptions'] = Helper.mergeObject(settings['serviceExceptions'], newSettings);
                    setChromeSettings(settings);
                });
            }
            break;
    }

    return false;
});

chrome.runtime.onInstalled.addListener(function (details) {
    DEFAULT_SETTINGS.defServicename = Helper.getRandomServicename();

    chrome.storage.sync.get('settings', function (items) {
        if (items.settings === undefined) {
            chrome.storage.local.get('settings', function (items) {
                chrome.storage.sync.set({
                    settings: items.settings
                });
            });
        }
    });

    if (details.reason === 'chrome_update' || details.reason === 'update') {
        chrome.storage.sync.get('settings', function (items) {
            var settings = JSON.parse(items.settings), key, serviceKey, isNew = false;

            for (key in DEFAULT_SETTINGS) {
                if (DEFAULT_SETTINGS.hasOwnProperty(key) && !settings.hasOwnProperty(key)) {
                    settings[key] = DEFAULT_SETTINGS[key];
                    isNew = true;
                } else if (key === 'serviceExceptions') {
                    for (serviceKey in DEFAULT_SETTINGS[key]) {
                        if (DEFAULT_SETTINGS[key].hasOwnProperty(serviceKey) && !settings[key].hasOwnProperty(serviceKey)) {
                            settings[key][serviceKey] = DEFAULT_SETTINGS[key][serviceKey];
                            isNew = true;
                        }
                        // @todo for else we might compare every single element and contribute new user settings?
                    }
                }
            }

            // migrate plength to length -> @todo can be deleted with 2.0
            if (settings.plength) {
                if (!settings.length) {
                    settings.length = settings.plength;
                }

                delete settings.plength;
                isNew = true;
            }

            if (isNew === true) {
                setChromeSettings(settings);
            }
        });
    } else {
        setChromeSettings(DEFAULT_SETTINGS);
    }
});

var setChromeSettings = function (settings) {
    chrome.storage.sync.set({
        settings: JSON.stringify(settings)
    });
};