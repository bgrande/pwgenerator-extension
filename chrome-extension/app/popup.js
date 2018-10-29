'use strict';

var BASE_NAME_POPUP = 'eph-popup-';

(function () {
    var closeWindow = function () {
        window.close();
    };

    $(BASE_NAME_POPUP + 'close-window-img').src = chrome.extension.getURL('images/close.png');

    on($('close-window'), 'click', function (e) {
        closeWindow();
    });

    chrome.storage.sync.get('settings', function (items) {
        var settings = (undefined !== items.settings) ? Helper.mergeObject(DEFAULT_SETTINGS, JSON.parse(items.settings)) : DEFAULT_SETTINGS;

        if (settings.useBrowserPopup == false) {
            $(BASE_NAME_POPUP + 'on-overlay').style.display = 'block';
            $(BASE_NAME_POPUP + 'generator-overlay-pass').style.display = 'none';
            $(BASE_NAME_POPUP + 'browser-popup').classList = 'popup-without-overlay';

            on($(BASE_NAME_POPUP + 'reload-overlay'), 'click', function (e) {
                chrome.runtime.sendMessage({event: 'reload', tab: chrome.tabs.getSelected});
                closeWindow();
            });

            on($(BASE_NAME_POPUP + 'disable-overlay'), 'click', function (e) {
                chrome.runtime.sendMessage({event: 'disable', tab: chrome.tabs.getSelected});
                closeWindow();
            });

            var reloadTitle = chrome.i18n.getMessage("reloadTitle"),
                disableTitle = chrome.i18n.getMessage("disableTitle");

            $(BASE_NAME_POPUP + 'reload-title').innerText = reloadTitle;
            $(BASE_NAME_POPUP + 'disable-title').innerText = disableTitle;
        }

        if (settings.useBrowserPopup == true) {
//  @todo images via chrome.extension.getUrl('path/to/image')!? -> shouldn't it work via html?

            $(BASE_NAME_POPUP + 'on-overlay').style.display = 'none';
            $(BASE_NAME_POPUP + 'generator-overlay-pass').style.display = 'block';
            $(BASE_NAME_POPUP + 'browser-popup').classList = 'popup-with-overlay';

            // @todo we need to get the currently active (if any: else dummy!) password field! via messages
            var domainService = Object.create(DomainService).init(settings.serviceExceptions),
                //loginField = Object.create(LoginField).init(settings.userFieldList),
                //passwordField = Object.create(PasswordField).init($(BASE_NAME_POPUP + 'servicename-pass')),
                generator = Object.create(Generator).init(settings, domainService);


            var closeButtonTitle = chrome.i18n.getMessage("close"),
                serviceNameLabel = chrome.i18n.getMessage("serviceNameLabel"),
                passphraseLabel = chrome.i18n.getMessage("passphraseLabel");

            /*
            $(BASE_NAME_POPUP + 'close-pass').setAttribute('title', closeButtonTitle);
            $(BASE_NAME_POPUP + 'close-icon').setAttribute('alt', closeButtonTitle);
            $(BASE_NAME_POPUP + 'service-label').innerText = serviceNameLabel;
            $(BASE_NAME_POPUP + 'servicename-pass').setAttribute('placeholder', generator.getDomainname());
            $(BASE_NAME_POPUP + 'passphrase-label').innerText = passphraseLabel;
            */
        }
    });
})();



