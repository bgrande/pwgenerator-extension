'use strict';

var closeWindow = function () {
    window.close();
};

$('close-window-img').src = chrome.extension.getURL('images/close.png');

on($('close-window'), 'click', function (e) {
    closeWindow();
});

chrome.storage.sync.get('settings', function (items) {
    var settings = (undefined !== items.settings) ? Helper.mergeObject(DEFAULT_SETTINGS, JSON.parse(items.settings)) : DEFAULT_SETTINGS;

    if (settings.isPopUpOnly === false) {
        on($('reload-overlay'), 'click', function (e) {
            chrome.runtime.sendMessage({event: 'reload', tab: chrome.tabs.getSelected});
            closeWindow();
        });

        on($('disable-overlay'), 'click', function (e) {
            chrome.runtime.sendMessage({event: 'disable', tab:  chrome.tabs.getSelected});
            closeWindow();
        });

        var reloadTitle  = chrome.i18n.getMessage("reloadTitle"),
            disableTitle = chrome.i18n.getMessage("disableTitle");

        $('reload-title').innerText = reloadTitle;
        $('disable-title').innerText = disableTitle;
    }

    if (settings.isPopUpOnly === true) {
//  @todo images via chrome.extension.getUrl('path/to/image')!? -> shouldn't it work via html?

        var closeButtonTitle = chrome.i18n.getMessage("close"),
            serviceNameLabel = chrome.i18n.getMessage("serviceNameLabel"),
            passphraseLabel = chrome.i18n.getMessage("passphraseLabel");

        $('easy-password-close').title = closeButtonTitle;
        $('easy-password-close-icon').alt = closeButtonTitle;
        $('easy-password-service-label').innerText = serviceNameLabel;
        $('easy-password-servicename-pass').placeholder = generator.getDomainname();
        $('easy-password-passphrase-label').innerText = passphraseLabel;
    }
});



