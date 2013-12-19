/* -----------------------------------------------------
 *  start the overlay presentation and vault generation
 * -----------------------------------------------------
 */
// make generators globally available but keep old on reload
if (!generators) {
    var generators = [];
}

// set chrome specific url getting for close icon
SETTINGS.imgUrl = chrome.extension.getURL('images/close.png');

chrome.storage.local.get('settings', function (items) {
    var password = getElementFromList(SETTINGS.pwFieldList, $),
        passwords = document.querySelectorAll("input[type=password]"),
        vaultSettings = (undefined !== items.settings) ? JSON.parse(items.settings) : DEFAULT_SETTINGS;

    if (passwords.length > 0) {
        // deactivate autosend if there are multiple password fields
        vaultSettings.autosend = passwords.length === 1;

        for (var i = 0; i < passwords.length; i++) {
            if (!generators[i] && !isOverlay(passwords[i]) && !hasOverlay(passwords[i])) {
                generators[i] = Object.create(VaultGenerator).init(SETTINGS, passwords[i], vaultSettings, DEFAULT_SETTINGS);
            }
        }
    } else if (passwords.length === 0 && password) {
        // field does not have a password type - better use no autosend to prevent misbehaviour
        vaultSettings.autosend = false;

        if (!generators[0] && !isOverlay(password) && !hasOverlay(password)) {
            generators[0] = Object.create(VaultGenerator).init(SETTINGS, password, vaultSettings, DEFAULT_SETTINGS);
        }
    }

    // show count of existing overlays
    chrome.runtime.sendMessage({event: 'countChange', overlayCount: generators.length});
});