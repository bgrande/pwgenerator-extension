var required    = $('required'),
    length      = $('vlength'),
    repeat      = $('repeat'),
    autosend    = $('autosend'),
    servicename = $('servicename'),
    TYPES       = 'lower upper number dash space symbol'.split(' ');

var getRadio = function (name) {
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
    var inputs = document.getElementsByTagName('input'), input;
    for (var i = 0, n = inputs.length; i < n; i++) {
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
    var settings = JSON.parse(items.settings),
        i;

    for (i = 0; i < TYPES.length; i++) {
        setRadio(TYPES[i], settings[TYPES[i]]);
    }

    repeat.value = settings.repeat;
    length.value = settings.length;
    required.value = settings.requiredLength;
    autosend.checked = settings.autosend;
    servicename.checked = settings.autosend;
});

function saveOptions() {
    var passLength         = parseInt(length.value, 10),
        requiredLength     = parseInt(required.value, 10),
        autosendChecked    = autosend.checked,
        servicenameChecked = servicename.checked,
        status             = $('option-status'),
        passRepeat,
        value,
        settings = {};

    passRepeat = !repeat.value ? 0: parseInt(repeat.value, 10);

    for (var i = 0, n = TYPES.length; i < n; i++) {
        value = getRadio(TYPES[i]);

        if (value === 'forbidden') {
            settings[TYPES[i]] = 0;
        } else if (value === 'required') {
            settings[TYPES[i]] = requiredLength;
        }
    }

    settings.length = passLength;
    settings.repeat = passRepeat;
    settings.autosend = autosendChecked;
    settings.servicename = servicenameChecked;
    settings.requiredLength = requiredLength;

    chrome.storage.local.set({
        settings: JSON.stringify(settings)
    });

    // let user know it's saved
    status.style.display = 'block';
    setTimeout(function () {
        status.style.display = 'none';
    }, 1600);
}

on($('save-options'), 'click', function (e) {
    saveOptions();
});