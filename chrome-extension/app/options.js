'use strict';

var required    = $('required'),
    length      = $('vlength'),
    repeat      = $('repeat'),
    autosend    = $('autosend'),
    servicename = $('servicename'),
    prefix      = $('prefix'),
    suffix      = $('suffix'),
    defServicename = $('def-servicename');

var getRadio = function (name) {
    var inputs = document.getElementsByTagName('input'), input, i, n;

    for (i = 0, n = inputs.length; i < n; i++) {
        input = inputs[i];
        if (input.type === 'radio' && input.name === name && input.checked) {
            return input.value;
        }
    }

    return null;
};

var setRadio = function (name, value) {
    var inputs = document.getElementsByTagName('input'), input, i, n;

    for (i = 0, n = inputs.length; i < n; i++) {
        input = inputs[i];
        if (input.type === 'radio' && input.name === name) {
            switch (input.value) {
                case 'required':
                    input.checked = (value && value > 0);
                    break;
                case 'allowed':
                    input.checked = (value === null);
                    break;
                case 'forbidden':
                    input.checked = (value === 0);
                    break;
            }
        }
    }
};

// retrieve already stored options
chrome.storage.local.get('settings', function (items) {
    var settings = JSON.parse(items.settings), i, n;

    for (i = 0, n = TYPES.length; i < n; i++) {
        setRadio(TYPES[i], settings[TYPES[i]]);
    }

    if (settings.repeat) {
        repeat.value = settings.repeat;
    }

    if (settings.plength) {
        length.value = settings.plength;
    }

    if (settings.requiredLength) {
        required.value = settings.requiredLength;
    }

    if (undefined !== settings.autosend) {
        autosend.checked = settings.autosend;
    }

    switch (settings.servicename) {
        case 'login':
            servicename.checked = true;
            break;
        case 'prefix':
            prefix.checked = true;
            break;
        case 'suffix':
            suffix.checked = true;
            break;
    }

    if (settings.defServicename) {
        defServicename.value = settings.defServicename;
    }
});

var saveOptions = function (length, required, autosend, defServicename, servicename, prefix, suffix) {
    var passLength        = parseInt(length.value, 10),
        requiredLength    = parseInt(required.value, 10),
        autosendChecked   = autosend.checked,
        defServicenameVal = defServicename.value,
        servicenameVal    = undefined,
        passRepeat, value, settings = {}, i, n;

    passRepeat = !repeat.value ? 0: parseInt(repeat.value, 10);

    for (i = 0, n = TYPES.length; i < n; i++) {
        value = getRadio(TYPES[i]);

        if (value === 'forbidden') {
            settings[TYPES[i]] = 0;
        } else if (value === 'required') {
            settings[TYPES[i]] = requiredLength;
        } else {
            settings[TYPES[i]] = null;
        }
    }

    if (servicename.checked) {
        servicenameVal = servicename.value;
    } else if (prefix.checked) {
        servicenameVal = prefix.value;
    } else if (suffix.checked) {
        servicenameVal = suffix.value;
    }

    settings.plength = passLength;
    settings.repeat = passRepeat;
    settings.autosend = autosendChecked;
    settings.servicename = servicenameVal;
    settings.requiredLength = requiredLength;
    settings.defServicename = defServicenameVal;

    chrome.storage.local.set({
        settings: JSON.stringify(settings)
    });
};

on($('save-options'), 'click', function () {
    var status = $('option-status');

    saveOptions(length, required, autosend, defServicename, servicename, prefix, suffix);

    // let user know it's saved
    status.style.display = 'block';
    setTimeout(function () {
        status.style.display = 'none';
    }, 1600);
});

/** translations */
(function () {
    var optionsTitle = chrome.i18n.getMessage("optionsTitle"),
        lengthLabel = chrome.i18n.getMessage("lengthLabel"),
        repeatLabel = chrome.i18n.getMessage("repeatLabel"),
        autosendLabel = chrome.i18n.getMessage("autosendLabel"),
        servicenameLabel = chrome.i18n.getMessage("servicenameLabel"),
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
})();