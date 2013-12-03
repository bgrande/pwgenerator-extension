/*var activateElement = function () {
    chrome.tabs.executeScript(null, {
        code: "(document.activeElement||{}).id = 'pass'; initGenerator(imgURL, $('pass'), undefined, settings);"
    });
};*/

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, {
        code: "alert('asas');"
    });

    chrome.tabs.executeScript(tab.id, {
        file: "./lib/core.js",
        //file: "./app/vault-generator.js",
        code: "(document.activeElement||{}).id = 'pass'; initGenerator(chrome.extension.getURL(\"./images/close.png\"), $('pass'), undefined, settings);"
    });

});