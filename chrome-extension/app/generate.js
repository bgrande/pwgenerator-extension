/* -----------------------------------------------------
 *  start the overlay presentation and vault generation
 * -----------------------------------------------------
 */
'use strict';
// make generators globally available but keep old on reload
if (!generators) {
    var generators = [];
}

// set chrome specific url getting for close icon
DEFAULT_SETTINGS.imgUrl = chrome.extension.getURL('images/close.png');

chrome.storage.local.get('settings', function (items) {
    var password = Helper.getElementFromList(DEFAULT_SETTINGS.pwFieldList),
        passwords = document.querySelectorAll("input[type=password]"),
        settings = (undefined !== items.settings) ? JSON.parse(items.settings) : DEFAULT_SETTINGS,
        pwLength = passwords.length, i;

    if (pwLength > 0) {
        // there are pages using the same id twice...
        Helper.fixDuplicateIds(passwords);

        // deactivate autosend if there are multiple password fields
        settings.autosend = (settings.autosend === true && pwLength === 1);

        for (i = 0; i < pwLength; i++) {
            if (!generators[i] && !Helper.isOverlay(passwords[i]) && !Helper.hasOverlay(passwords[i])) {
                generators[i] = Object.create(VaultGenerator).init(passwords[i], settings, DEFAULT_SETTINGS);
            }
        }
    } else if (pwLength === 0 && password) {
        // field does not have a password type - better use no autosend to prevent misbehaviour
        settings.autosend = false;

        if (!generators[0] && !Helper.isOverlay(password) && !Helper.hasOverlay(password)) {
            generators[0] = Object.create(VaultGenerator).init(password, settings, DEFAULT_SETTINGS);
        }
    }

    // show count of existing overlays
    if (0 < generators.length) {
        chrome.runtime.sendMessage({event: 'countChange', overlayCount: generators.length});
    }
});