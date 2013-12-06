chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, { file: "app/vault-generator.js", allFrames: true }, function () {
    });
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