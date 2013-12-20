chrome.browserAction.onClicked.addListener(function (tab) {
    'use strict';

    chrome.tabs.executeScript(tab.id, { file: "app/generate.js", allFrames: true }, function () {});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    'use strict';

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
    'use strict';

    if ('update' === details.reason) {
        chrome.storage.local.get('settings', function (items) {
            var settings = JSON.parse(items.settings), key, isNew = false;

            for (key in DEFAULT_SETTINGS) {
                if (DEFAULT_SETTINGS.hasOwnProperty(key) && !settings.hasOwnProperty(key)) {
                    settings[key] = DEFAULT_SETTINGS[key];
                    isNew = true;
                }
            }

            if (true === isNew) {
                alert('new settings!');
                chrome.storage.local.set({
                    settings: settings
                });
            }
        });
    } else {
        chrome.storage.local.set({
            settings: JSON.stringify(DEFAULT_SETTINGS)
        });
    }
});