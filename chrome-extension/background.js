'use strict';

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, { file: "lib/crypto-js-3.1.2.js", allFrames: true }, function () {});
    chrome.tabs.executeScript(tab.id, { file: "lib/vault.js", allFrames: true }, function () {});
    chrome.tabs.executeScript(tab.id, { file: "lib/core.js", allFrames: true }, function () {});
    chrome.tabs.executeScript(tab.id, { file: "app/vault-generator.js", allFrames: true }, function () {});
    chrome.tabs.executeScript(tab.id, { file: "app/generate.js", allFrames: true }, function () {});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!request || request.event !== 'countChange') {
        return;
    }

    if (request.overlayCount && 0 !== request.overlayCount) {
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
});

chrome.runtime.onInstalled.addListener(function (details) {
    DEFAULT_SETTINGS.defServicename = Math.random().toString(36).substring(7) + '@';

    if (details.reason === 'chrome_update' || details.reason === 'update') {
        chrome.storage.local.get('settings', function (items) {
            var settings = JSON.parse(items.settings), key, isNew = false;

            for (key in DEFAULT_SETTINGS) {
                if (DEFAULT_SETTINGS.hasOwnProperty(key) && !settings.hasOwnProperty(key) ) {
                    settings[key] = DEFAULT_SETTINGS[key];
                    isNew = true;
                }
            }

            if (isNew === true) {
                chrome.storage.local.set({
                    settings: JSON.stringify(settings)
                });
            }
        });
    } else {
        chrome.storage.local.set({
            settings: JSON.stringify(DEFAULT_SETTINGS)
        });
    }
});