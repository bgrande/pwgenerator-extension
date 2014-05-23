'use strict';

var saveSettings = function (settings) {
    chrome.storage.sync.set({
        settings: JSON.stringify(settings)
    });
};

chrome.storage.sync.get('settings', function (items) {
    getOptionSettings(JSON.parse(items.settings));
});

(function () {
    /** translations */
    var optionsTitle = chrome.i18n.getMessage("optionsTitle"),
        lengthLabel = chrome.i18n.getMessage("lengthLabel"),
        repeatLabel = chrome.i18n.getMessage("repeatLabel"),
        iterationLabel = chrome.i18n.getMessage("iterationLabel"),
        autosendLabel = chrome.i18n.getMessage("autosendLabel"),
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
        linkText = chrome.i18n.getMessage("linkText"),
        linkText1 = chrome.i18n.getMessage("linkText1"),
        linkText2 = chrome.i18n.getMessage("linkText2");

    document.title = optionsTitle;
    $('length-label').innerText = lengthLabel;
    $('repeat-label').innerText = repeatLabel;
    $('iteration-label').innerText = iterationLabel;
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
    $('link-text').innerText = linkText;
    $('link-to-vault-1').innerText = linkText1;
    $('link-to-vault-2').innerText = linkText2;

    // set symbol description
    $('symbol-description').title = '!"#$%&\'()*+,./:;<=>?@[\\]^{|}~';
})();