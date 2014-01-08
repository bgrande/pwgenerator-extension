/* -----------------------------------------------------
 *  start the overlay presentation and vault generation
 * -----------------------------------------------------
 */
// make generators globally available but keep old on reload
if (!generators) {
    var generators = [];
}

// set chrome specific url getting for close icon
DEFAULT_SETTINGS.imgUrl = chrome.extension.getURL('images/close.png');

chrome.storage.local.get('settings', function (items) {
    var password = getElementFromList(DEFAULT_SETTINGS.pwFieldList),
        passwords = document.querySelectorAll("input[type=password]"),
        settings = (undefined !== items.settings) ? JSON.parse(items.settings) : DEFAULT_SETTINGS;

    if (passwords.length > 0) {
        // deactivate autosend if there are multiple password fields
        settings.autosend = passwords.length === 1;

        for (var i = 0; i < passwords.length; i++) {
            if (!generators[i] && !isOverlay(passwords[i]) && !hasOverlay(passwords[i])) {
                generators[i] = Object.create(VaultGenerator).init(passwords[i], settings, DEFAULT_SETTINGS);
            }
        }
    } else if (passwords.length === 0 && password) {
        // field does not have a password type - better use no autosend to prevent misbehaviour
        settings.autosend = false;

        if (!generators[0] && !isOverlay(password) && !hasOverlay(password)) {
            generators[0] = Object.create(VaultGenerator).init(passwords[i], settings, DEFAULT_SETTINGS);
        }
    }

    // show count of existing overlays
    if (0 < generators.length) {
        chrome.runtime.sendMessage({event: 'countChange', overlayCount: generators.length});
    }
});