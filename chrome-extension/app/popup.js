'use strict';

(function () {
    var closeWindow = function () {
        window.close();
    };

    $('close-window-img').src = chrome.extension.getURL('images/close.png');

    on($('close-window'), 'click', function (e) {
        closeWindow();
    });

    chrome.storage.sync.get('settings', function (items) {
        var settings = (undefined !== items.settings) ? Helper.mergeObject(DEFAULT_SETTINGS, JSON.parse(items.settings)) : DEFAULT_SETTINGS;

        if (settings.useBrowserPopup == false) {
            $('popup-on-overlay').style.display = 'block';
            $('easy-password-generator-overlay-pass').style.display = 'none';
            $('easy-password-browser-popup').classList = 'popup-without-overlay';

            on($('reload-overlay'), 'click', function (e) {
                chrome.runtime.sendMessage({event: 'reload', tab: chrome.tabs.getSelected});
                closeWindow();
            });

            on($('disable-overlay'), 'click', function (e) {
                chrome.runtime.sendMessage({event: 'disable', tab: chrome.tabs.getSelected});
                closeWindow();
            });

            var reloadTitle = chrome.i18n.getMessage("reloadTitle"),
                disableTitle = chrome.i18n.getMessage("disableTitle");

            $('reload-title').innerText = reloadTitle;
            $('disable-title').innerText = disableTitle;
        }

        if (settings.useBrowserPopup == true) {
//  @todo images via chrome.extension.getUrl('path/to/image')!? -> shouldn't it work via html?

            $('popup-on-overlay').style.display = 'none';
            $('easy-password-generator-overlay-pass').style.display = 'block';
            $('easy-password-browser-popup').classList = 'popup-with-overlay';

            // @todo we need to get the currently active (if any: else dummy!) password field! via messages
            var domainService = Object.create(DomainService).init(settings.serviceExceptions),
                //loginField = Object.create(LoginField).init(settings.userFieldList),
                //passwordField = Object.create(PasswordField).init($('easy-password-servicename-pass')),
                generator = Object.create(Generator).init(settings, domainService);


            var closeButtonTitle = chrome.i18n.getMessage("close"),
                serviceNameLabel = chrome.i18n.getMessage("serviceNameLabel"),
                passphraseLabel = chrome.i18n.getMessage("passphraseLabel");

            /*
            $('easy-password-close-pass').setAttribute('title', closeButtonTitle);
            $('easy-password-close-icon').setAttribute('alt', closeButtonTitle);
            $('easy-password-service-label').innerText = serviceNameLabel;
            $('easy-password-servicename-pass').setAttribute('placeholder', generator.getDomainname());
            $('easy-password-passphrase-label').innerText = passphraseLabel;
            */
        }
    });
})();



