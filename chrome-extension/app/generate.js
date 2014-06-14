/* -----------------------------------------------------
 *  start the overlay presentation and vault generation
 * -----------------------------------------------------
 */
'use strict';
// make overlays globally available but keep old on reload
if (!overlays) {
    var overlays = [];
}

chrome.storage.sync.get('settings', function (items) {
    try {
        var password = Helper.getElementFromList(DEFAULT_SETTINGS.pwFieldList),
            passwords = document.querySelectorAll("input[type=password]"),
            settings = (undefined !== items.settings) ? Helper.mergeObject(DEFAULT_SETTINGS, JSON.parse(items.settings)) : DEFAULT_SETTINGS,
            domainService = Object.create(DomainService).init(DEFAULT_SETTINGS.serviceExceptions),
            pwLength = passwords.length, passwordField, generator, i;

        // set chrome specific url getting for close icon
        settings.imgUrl = chrome.extension.getURL('images/close.png');

        if (pwLength > 0) {
            // there are pages using the same id twice...
            Helper.fixDuplicateIds(passwords);

            // deactivate autosend if there are multiple password fields
            settings.autosend = (settings.autosend === true && pwLength === 1);

            for (i = 0; i < pwLength; i++) {
                if (!overlays[i] && !Helper.isOverlay(passwords[i]) && !Helper.hasOverlay(passwords[i])) {
                    passwordField = Object.create(PasswordField).init(passwords[i]);
                    generator = Object.create(Generator).init(settings, passwordField, domainService);
                    overlays[i] = Object.create(Overlay).init(settings, passwordField, generator);
                }
            }
        } else if (pwLength === 0 && password) {
            // field does not have a password type - better use no autosend to prevent misbehaviour
            settings.autosend = false;

            if (!overlays[0] && !Helper.isOverlay(password) && !Helper.hasOverlay(password)) {
                passwordField = Object.create(PasswordField).init(password);
                generator = Object.create(Generator).init(settings, passwordField, domainService);
                overlays[0] = Object.create(Overlay).init(settings, passwordField, generator);
            }
        }

        // show count of existing overlays
        if (0 < overlays.length) {
            chrome.runtime.sendMessage({event: 'countChange', overlayCount: overlays.length});
        }
    } catch (exception) {
        console.error(exception);
    }

});