'use strict';

var saveSettings = function (settings) {
    chrome.storage.sync.set({
        settings: JSON.stringify(settings)
    });
};

var cancelOptions = function () {
    window.close();
};

chrome.storage.sync.get('settings', function (items) {
    var settings = JSON.parse(items.settings), service, serviceList = '', definition;

    getOptionSettings(settings);

    // @todo extend and move into own object/method as well as in general options.js
    for (service in settings.serviceExceptions)
    {
        if (settings.serviceExceptions.hasOwnProperty(service)) {
            serviceList += '<div><span>' + service + ': </span>';
                for (definition in settings.serviceExceptions[service]) {
                    if (settings.serviceExceptions[service].hasOwnProperty(definition)) {
                        serviceList += '<span>' + definition + ': '+ settings.serviceExceptions[service][definition] + ' - </span>';
                    }
                }
            serviceList += '</div>';
        }
    }

    $('show-saved-options').innerHTML = serviceList;
});

(function () {
    /** translations */
    var optionsTitle = chrome.i18n.getMessage("optionsTitle"),
        lengthLabel = chrome.i18n.getMessage("lengthLabel"),
        repeatLabel = chrome.i18n.getMessage("repeatLabel"),
        iterationLabel = chrome.i18n.getMessage("iterationLabel"),
        autosendLabel = chrome.i18n.getMessage("autosendLabel"),
        compatibleLabel = chrome.i18n.getMessage("compatibleLabel"),
        browserActionLabel = chrome.i18n.getMessage("browserActionLabel"),
        servicenameLabel = chrome.i18n.getMessage("servicenameOptionLabel"),
        defservicenameLabel = chrome.i18n.getMessage("defservicenameLabel"),
        defservicenamePrefixLabel = chrome.i18n.getMessage("defservicenamePrefixLabel"),
        defservicenameSuffixLabel = chrome.i18n.getMessage("defservicenameSuffixLabel"),
        spaceHead = chrome.i18n.getMessage("spaceHead"),
        requiredLabel = chrome.i18n.getMessage("requiredLabel"),
        allowedLabel = chrome.i18n.getMessage("allowedLabel"),
        forbiddenLabel = chrome.i18n.getMessage("forbiddenLabel"),
        optionStatus = chrome.i18n.getMessage("optionStatus"),
        saveOptionsText = chrome.i18n.getMessage("saveOptions"),
        cancelOptionsText = chrome.i18n.getMessage("cancelOptions"),
        linkText = chrome.i18n.getMessage("linkText"),
        linkText1 = chrome.i18n.getMessage("linkText1"),
        linkText2 = chrome.i18n.getMessage("linkText2");

    document.title = optionsTitle;
    $('length-label').innerText = lengthLabel;
    $('repeat-label').innerText = repeatLabel;
    $('iteration-label').innerText = iterationLabel;
    $('compatible-label').innerText = compatibleLabel;
    $('use-browser-action-label').innerText = browserActionLabel;
    $('autosend-label').innerText = autosendLabel;
    $('servicename-label').innerText = servicenameLabel;
    $('defservicename-label').innerText = defservicenameLabel;
    $('defservicename-prefix-label').innerText = defservicenamePrefixLabel;
    $('defservicename-suffix-label').innerText = defservicenameSuffixLabel;
    $('space-head').innerText = spaceHead;
    $('required-label').innerText = requiredLabel;
    $('allowed-label').innerText = allowedLabel;
    $('forbidden-label').innerText = forbiddenLabel;
    $('option-status').innerText = optionStatus;
    $('save-options').innerText = saveOptionsText;
    $('cancel-options').innerText = cancelOptionsText;
    $('link-text').innerText = linkText;
    $('link-to-vault-1').innerText = linkText1;
    $('link-to-vault-2').innerText = linkText2;

    // set symbol description
    $('symbol-description').title = '!"#$%&\'()*+,./:;<=>?@[\\]^{|}~';
})();