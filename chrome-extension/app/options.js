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

var required    = $('required'),
    length      = $('vlength'),
    repeat      = $('repeat'),
    autosend    = $('autosend'),
    servicename = $('servicename'),
    TYPES       = 'lower upper number dash space symbol'.split(' ');


function saveOptions() {
    var passLength         = parseInt(length.value, 10),
        requiredLength     = parseInt(required.value, 10),
        autosendChecked    = autosend.checked,
        servicenameChecked = servicename.checked,
        status             = $('option-status'),
        passRepeat,
        value,
        type;

    passRepeat = !repeat.value ? 0: parseInt(repeat.value, 10);

    for (var i = 0, n = TYPES.length; i < n; i++) {
        value = getRadio(TYPES[i]),
        type = {};

        if (value === 'forbidden') {
            type[TYPES[i]] = 0;
        } else if (value === 'required') {
            type[TYPES[i]] = requiredLength;
        }

        chrome.storage.local.set(type);

        chrome.storage.local.get(TYPES[i], function(items) {
            console.log(items);
        });

    }

    chrome.storage.local.set({
        'plength': passLength,
        'repeat': passRepeat,
        'autosend': autosendChecked,
        'servicename': servicenameChecked
    });
    // save to local chrome storage
    localStorage['plength']     = passLength;
    localStorage['repeat']      = passRepeat;
    localStorage['autosend']    = autosendChecked;
    localStorage['servicename'] = servicenameChecked;

console.log(chrome.storage.local.get('plength', function(items) {
    console.log(items);
}), chrome.storage.local.get('repeat', function(items) {
    console.log(items);
}), chrome.storage.local.get('autosend', function(items) {
    console.log(items);
}), chrome.storage.local.get('servicename', function(items) {
    console.log(items);
}));

    // let user know it's saved
    status.style.display = 'block';
    setTimeout(function () {
        status.style.display = 'none';
    }, 1600);
}

on($('save-options'), 'click', function (e) {
    saveOptions();
});