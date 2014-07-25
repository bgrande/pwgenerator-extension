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

/**
 * retrieve already stored options
 * @param {Object} settings
 */
var getOptionSettings = function (settings) {
    Helper.setTypeSettings(settings);

    if (settings.repeat) {
        repeat.value = settings.repeat;
    }

    if (settings.iteration) {
        iteration.value = settings.iteration;
    }

    if (settings.length) {
        length.value = settings.length;
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

/**
 * Save given options into store
 *
 * @param {HTMLInputElement} length
 * @param {HTMLInputElement} repeat
 * @param {HTMLInputElement} iteration
 * @param {HTMLInputElement} required
 * @param {HTMLInputElement} compatible
 * @param {HTMLInputElement} autosend
 * @param {HTMLInputElement} defServicename
 * @param {HTMLInputElement} servicename
 * @param {HTMLInputElement} prefix
 * @param {HTMLInputElement} suffix
 */
var saveOptions = function (length, repeat, iteration, required, compatible, autosend, defServicename, servicename, prefix, suffix) {
    var passLength        = parseInt(length.value, 10),
        requiredLength    = parseInt(required.value, 10),
        compatibleChecked = compatible.checked,
        autosendChecked   = autosend.checked,
        defServicenameVal = defServicename.value,
        servicenameType   = undefined,
        passRepeat, genIteration, settings = {};

    passRepeat = !repeat.value ? 0: parseInt(repeat.value, 10);
    genIteration = !iteration.value ? 0: parseInt(iteration.value, 10);

    settings = Helper.getTypeSettings(settings, requiredLength);

    if (servicename.checked) {
        servicenameType = servicename.value;
    } else if (prefix.checked) {
        servicenameType = prefix.value;
    } else if (suffix.checked) {
        servicenameType = suffix.value;
    }

    settings.length = passLength;
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