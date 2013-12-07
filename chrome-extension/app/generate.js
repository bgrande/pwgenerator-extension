/* -----------------------------------------------------
 *  start the overlay presentation and vault generation
 * -----------------------------------------------------
 */
var login = getLoginName(userFieldList),
    password = getElementFromList(pwFieldList, $);

var passwords = document.querySelectorAll("input[type=password]");

chrome.storage.local.get('settings', function (items) {
    var settings = (undefined !== items.settings) ? getSettings(JSON.parse(items.settings)) : DEFAULT_SETTINGS;

    if (passwords.length > 0) {

        // deactivate autosend if there are multiple password fields
        settings.autosend = passwords.length === 1;

        for (var i = 0; i < passwords.length; i++) {
            initGenerator(imgURL, passwords[i], login, settings);
        }
    } else if (passwords.length === 0 && password) {
        // field has not password type - better use no autosend to prevent misbehaviour
        settings.autosend = false;

        initGenerator(imgURL, password, login, settings);
    }
});