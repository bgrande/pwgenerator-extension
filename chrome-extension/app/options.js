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
        value;

    passRepeat = !repeat.value ? 0: parseInt(repeat.value, 10);

    for (var i = 0, n = TYPES.length; i < n; i++) {
        value = getRadio(TYPES[i]);

        if (value === 'forbidden') {
            localStorage[TYPES[i]] = 0;
        } else if (value === 'required') {
            localStorage[TYPES[i]] = requiredLength;
        }

        console.log(localStorage[TYPES[i]]);
    }

    // save to local chrome storage
    localStorage['plength']     = passLength;
    localStorage['repeat']      = passRepeat;
    localStorage['autosend']    = autosendChecked;
    localStorage['servicename'] = servicenameChecked;

console.log(localStorage.getItem('length'), localStorage.getItem('repeat'), localStorage.getItem('autosend'), localStorage.getItem('servicename'));

    // let user know it's saved
    status.style.display = 'block';
    setTimeout(function () {
        status.style.display = 'none';
    }, 1600);
}

on($('save-options'), 'click', function (e) {
    saveOptions();
});