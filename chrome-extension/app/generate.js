/* -----------------------------------------------------
 *  start the overlay presentation and vault generation
 * -----------------------------------------------------
 */
'use strict';
// make overlays globally available but keep old on possible file reload
if (!generatorOverlays) {
    var generatorOverlays = [];
}

var overlayFactory = function (settings, passwordElement, domainname) {
    var domainService = Object.create(DomainService).init(settings.serviceExceptions, domainname),
        loginField = Object.create(LoginField).init(settings.userFieldList),
        passwordField = Object.create(PasswordField).init(passwordElement),
        generator = Object.create(Generator).init(settings, domainService);

    return Object.create(Overlay).init(settings, passwordField, loginField, generator);
};

chrome.storage.sync.get('settings', function (items) {
    try {
        var password = Helper.getElementFromList(DEFAULT_SETTINGS.pwFieldList),
            passwords = document.querySelectorAll("input[type=password]"),
            settings = (undefined !== items.settings) ? Helper.mergeObject(DEFAULT_SETTINGS, JSON.parse(items.settings)) : DEFAULT_SETTINGS,
            pwLength = passwords.length, i;

        if (settings.useBrowserAction) {
            // @todo if any passwords, use browser popup with password generation input fields
            // it has to be
            // -> 1. is there a way to use the logic within the popup as well? -> just inject into popup
            // -> 2. make popup more beautiful
            // -> 3. increase UX
            // chrome.browserAction.openPopup();
        }

        // set chrome specific url getting for close and extend icons
        settings.imgUrl = chrome.extension.getURL('images/close.png');
        settings.arrowUp = chrome.extension.getURL('images/arrow-up.png');
        settings.arrowDown = chrome.extension.getURL('images/arrow-down.png');

        if (pwLength > 0) {
            // there are pages using the same id twice...
            Helper.fixDuplicateIds(passwords);

            // deactivate autosend if there are multiple password fields
            settings.autosend = (settings.autosend === true && pwLength === 1);

            for (i = 0; i < pwLength; i++) {
                if (!generatorOverlays[i] && !Helper.isOverlay(passwords[i]) && !Helper.hasOverlay(passwords[i])) {
                    generatorOverlays[i] = overlayFactory(settings, passwords[i]);
                }
            }
        } else if (pwLength === 0 && password && password.tagName === 'INPUT') {
            // field does not have a password type - better use no autosend to prevent misbehaviour
            settings.autosend = false;

            if (!generatorOverlays[0] && !Helper.isOverlay(password) && !Helper.hasOverlay(password)) {
                generatorOverlays[0] = overlayFactory(settings, password);
            }
        }

        // show count of existing overlays
        if (0 < generatorOverlays.length) {
            chrome.runtime.sendMessage({event: 'countChange', overlayCount: generatorOverlays.length});
        }
    } catch (exception) {
        console.error(exception);
    }

});
