var required    = $('required'),
    length      = $('vlength'),
    repeat      = $('repeat'),
    autosend    = $('autosend'),
    servicename = $('servicename'),
    prefix      = $('prefix'),
    suffix      = $('suffix'),
    defServicename = $('def-servicename');

var getRadio = function (name) {
    'use strict';
    var inputs = document.getElementsByTagName('input'), input;

    for (var i = 0, n = inputs.length; i < n; i++) {
        input = inputs[i];
        if (input.type === 'radio' && input.name === name && input.checked) {
            return input.value;
        }
    }

    return null;
};

var setRadio = function (name, value) {
    'use strict';

    var inputs = document.getElementsByTagName('input'), input, i;
    
    for (i = 0; i < inputs.length; i++) {
        input = inputs[i];
        if (input.type === 'radio' && input.name === name) {
            switch (input.value) {
                case 'required':
                    input.checked = (value && value > 0);
                    break;
                case 'allowed':
                    input.checked = (value === undefined);
                    break;
                case 'forbidden':
                    input.checked = (value === 0);
                    break;
            }
        }
    }
};

// retrieve already stored
chrome.storage.local.get('settings', function (items) {
    var settings = JSON.parse(items.settings), i;

    for (i = 0; i < TYPES.length; i++) {
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

    if (settings.autosend) {
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

function saveOptions() {
    'use strict';

    var passLength        = parseInt(length.value, 10),
        requiredLength    = parseInt(required.value, 10),
        autosendChecked   = autosend.checked,
        defServicenameVal = defServicename.value,
        status            = $('option-status'),
        servicenameVal    = undefined,
        passRepeat,
        value,
        settings = {},
        i;

    passRepeat = !repeat.value ? 0: parseInt(repeat.value, 10);

    for (i = 0; i < TYPES.length; i++) {
        value = getRadio(TYPES[i]);

        if (value === 'forbidden') {
            settings[TYPES[i]] = 0;
        } else if (value === 'required') {
            settings[TYPES[i]] = requiredLength;
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

    // let user know it's saved
    status.style.display = 'block';
    setTimeout(function () {
        status.style.display = 'none';
    }, 1600);
}

on($('save-options'), 'click', function () {
    saveOptions();
});