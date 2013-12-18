chrome.browserAction.onClicked.addListener(function (tab) {
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
    if ('update' === details.reason) {
        // someday we are going to update the options
    } else {
        chrome.storage.local.set({
            settings: JSON.stringify(DEFAULT_SETTINGS)
        });
    }
});