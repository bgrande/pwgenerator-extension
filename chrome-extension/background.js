chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, { file: "app/vault-generator.js", allFrames: true }, function () {
    });
});