'use strict';

var required    = $('required'),
    length      = $('vlength'),
    repeat      = $('repeat'),
    iteration   = $('iteration'),
    compatible  = $('compatible'),
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
var getOptionSettings = function (settings) {
    var i, n;

    for (i = 0, n = TYPES.length; i < n; i++) {
        setRadio(TYPES[i], settings[TYPES[i]]);
    }

    if (settings.repeat) {
        repeat.value = settings.repeat;
    }

    if (settings.iteration) {
        iteration.value = settings.iteration;
    }

    if (settings.plength) {
        length.value = settings.plength;
    }

    if (settings.requiredLength) {
        required.value = settings.requiredLength;
    }

    if (settings.autosend !== undefined) {
        autosend.checked = settings.autosend;
    }

    if (settings.isVaultCompatible !== undefined) {
        compatible.checked = settings.isVaultCompatible;
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
};

var saveOptions = function (length, repeat, iteration, required, compatible, autosend, defServicename, servicename, prefix, suffix) {
    var passLength        = parseInt(length.value, 10),
        requiredLength    = parseInt(required.value, 10),
        compatibleChecked = compatible.checked,
        autosendChecked   = autosend.checked,
        defServicenameVal = defServicename.value,
        servicenameType   = undefined,
        passRepeat, genIteration, value, settings = {}, i, n;

    passRepeat = !repeat.value ? 0: parseInt(repeat.value, 10);
    genIteration = !iteration.value ? 0: parseInt(iteration.value, 10);

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
        servicenameType = servicename.value;
    } else if (prefix.checked) {
        servicenameType = prefix.value;
    } else if (suffix.checked) {
        servicenameType = suffix.value;
    }

    settings.plength = passLength;
    settings.repeat = passRepeat;
    settings.iteration = genIteration;
    settings.isVaultCompatible = compatibleChecked;
    settings.autosend = autosendChecked;
    settings.servicename = servicenameType;
    settings.requiredLength = requiredLength;
    settings.defServicename = defServicenameVal;

    saveSettings(settings);
};

on($('save-options'), 'click', function () {
    var status = $('option-status');

    saveOptions(length, repeat, iteration, required, compatible, autosend, defServicename, servicename, prefix, suffix);

    // let user know it's saved
    status.style.display = 'block';
    setTimeout(function () {
        status.style.display = 'none';
    }, 1600);
});

on($('cancel-options'), 'click', function () {
    cancelOptions();
});