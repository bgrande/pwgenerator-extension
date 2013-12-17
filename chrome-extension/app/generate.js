/* -----------------------------------------------------
 *  start the overlay presentation and vault generation
 * -----------------------------------------------------
 */
var password = getElementFromList(SETTINGS.pwFieldList, $),
    passwords = document.querySelectorAll("input[type=password]");

chrome.storage.local.get('settings', function (items) {
    var vaultSettings = (undefined !== items.settings) ? JSON.parse(items.settings) : DEFAULT_SETTINGS,
        generators = [];

    if (passwords.length > 0) {
        // deactivate autosend if there are multiple password fields
        vaultSettings.autosend = passwords.length === 1;

        for (var i = 0; i < passwords.length; i++) {
            generators[i] = Object.create(VaultGenerator).init(SETTINGS, passwords[i], vaultSettings, DEFAULT_SETTINGS);
        }
    } else if (passwords.length === 0 && password) {
        // field does not have a password type - better use no autosend to prevent misbehaviour
        vaultSettings.autosend = false;

        generators[0] = Object.create(VaultGenerator).init(SETTINGS, password, vaultSettings, DEFAULT_SETTINGS);
    }
});