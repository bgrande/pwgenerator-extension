chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.method == "getLocalStorage") {
        sendResponse({data: localStorage.getItem(message.key)});
    } else {
        sendResponse({});
    }
});

var activateElement = function () {
    chrome.tabs.executeScript(null, {
        code: "(document.activeElement||{}).id = 'pass'; initGenerator(imgURL, $('pass'), undefined, settings);"
    });
};
