/* -----------------------------------------------------
 *  start the overlay presentation and vault generation
 * -----------------------------------------------------
 */
'use strict';

// make overlays globally available but keep old on possible file reload
if (!generatorOverlays) {
    var generatorOverlays = [];
}

chrome.storage.sync.get('settings', function (items) {
    try {
        var password = Helper.getElementFromList(DEFAULT_SETTINGS.pwFieldList),
            passwords = document.querySelectorAll("input[type=password]"),
            settings = (undefined !== items.settings) ? Helper.mergeObject(DEFAULT_SETTINGS, JSON.parse(items.settings)) : DEFAULT_SETTINGS,
            pwLength = passwords.length, i;

        // set chrome specific url getting for close and extend icons
        settings.imgUrl = chrome.extension.getURL('images/close.png');
        settings.arrowUp = chrome.extension.getURL('images/arrow-up.png');
        settings.arrowDown = chrome.extension.getURL('images/arrow-down.png');

        if (pwLength > 0) {
            // there are pages using the same id twice...
            passwords = Helper.fixDuplicateIds(passwords);
            // deactivate autosend if there are multiple password fields
            settings.autosend = (settings.autosend === true && pwLength === 1);
        }

        if (pwLength === 0 && password && password.tagName === 'INPUT') {
            passwords.push(password);
            // field does not have a password type - better use no autosend to prevent misbehaviour
            settings.autosend = false;
        }

        for (i = 0; i < pwLength; i++) {
            if (!generatorOverlays[i] && !Helper.isOverlay(passwords[i]) && !Helper.hasOverlay(passwords[i])) {
                // if we're not on popup: create object; else: just count the fields
                if (settings.useBrowserPopup == false) {
                    generatorOverlays[i] = overlayFactory(settings, passwords[i]);
                } else {
                    let fieldId = '';
                    if (passwords[i].hasAttribute('id')) {
                        fieldId = passwords[i].getAttribute('id');
                    }
                    on(passwords[i], 'click', function (e) {
                        chrome.runtime.sendMessage({event: 'activePasswordField', fieldId: fieldId});
                    });

                    generatorOverlays[i] = passwords[i];
                }
            }
        }

        // show count of existing overlays
        if (0 < generatorOverlays.length) {
            chrome.runtime.sendMessage({event: 'countChange', overlayCount: generatorOverlays.length});
            chrome.runtime.sendMessage({event: 'passwordFields', fields: generatorOverlays});
        }
    } catch (exception) {
        console.error(exception);
    }
});

/*
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request) {
        case "setPassword":
            // retrieve document HTML and send to popup.js
            let fieldId = request.data.fieldId,
                password = request.data.password;

            break;
        default:
            sendResponse(null);
    }
});
*/
