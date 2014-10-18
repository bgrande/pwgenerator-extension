'use strict';

var closeWindow = function () {
    window.close();
};

$('close-window-img').src = chrome.extension.getURL('images/close.png');

on($('reload-overlay'), 'click', function (e) {
    chrome.runtime.sendMessage({event: 'reload', tab: chrome.tabs.getSelected});
    closeWindow();
});

on($('disable-overlay'), 'click', function (e) {
    chrome.runtime.sendMessage({event: 'disable', tab:  chrome.tabs.getSelected});
    closeWindow();
});

on($('close-window'), 'click', function (e) {
    closeWindow();
});


var reloadTitle  = chrome.i18n.getMessage("reloadTitle"),
    disableTitle = chrome.i18n.getMessage("disableTitle");

$('reload-title').innerText = reloadTitle;
$('disable-title').innerText = disableTitle;