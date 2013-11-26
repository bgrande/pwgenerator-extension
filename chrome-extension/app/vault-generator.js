var pwFieldList = [ 'pass', 'Pass', 'passwd', 'Passwd', 'password', 'Password', 'PASSWORD', 'pw', 'PW', 'passwort', 'Passwort', 'ap_password', 'login_password', 'user_password', 'user_pass', 'pwd', 'rpass' ],
    userFieldList = [ 'mail', 'Mail', 'email', 'Email', 'EMail', 'e-mail', 'E-Mail', 'eMail', 'login', 'Login', 'user', 'User', 'username', 'Username', 'ap_email', 'userid', 'Userid', 'userId', 'UserId', 'login_email', 'user_login' ],
    imgURL = chrome.extension.getURL("./images/close.png"),
    settings = getVaultSettings(),
    overlayClosed = false;

var getElementFromList = function (list) {
    var i, element;

    for (i = 0; i < list.length; i++) {
        element = $(list[i]);

        if (element) {
            return element;
        }
    }

    return false;
};

var toggleOverlay = function (overlay, status) {
    var display = 'none';

    if (status) {
        display = 'block';
    }

    overlay.style.display = display;
};

var generatePassword = function(serviceValue, phraseValue, settings) {
    var pwValue;

    try {
        if (serviceValue && phraseValue) {
            settings.phrase = phraseValue;
            pwValue = new Vault(settings).generate(serviceValue);
        } else {
            pwValue = '';
        }

        return pwValue;
    } catch (e) {
        return '!! ' + e.message;
    }
};

var addOverlayDiv = function (imgUrl, password, login, settings) {
    // @todo separate into element generation methods?
    var overlayDiv = document.createElement('div'),
        dialogDiv = document.createElement('div'),
        serviceDiv = document.createElement('div'),
        passDiv = document.createElement('div'),
        closeSpan = document.createElement('span'),
        closeImg = document.createElement('img'),
        serviceElementLabel = document.createElement('label'),
        serviceElement = document.createElement('input'),
        pwElementLabel = document.createElement('label'),
        pwElement = document.createElement('input'),
        submitButton = document.createElement('input');

    closeImg.id = 'vault-close-icon-' + password.id;
    closeImg.className = 'vault-close-icon';
    closeImg.src = imgUrl;
    closeImg.alt = 'Close Overlay';

    closeSpan.id = 'vault-close-' + password.id;
    closeSpan.className = 'vault-close';
    closeSpan.title = 'Close Overlay';
    closeSpan.appendChild(closeImg);

    serviceElementLabel.innerText = 'Service name';
    serviceElement.id = 'vault-servicename-' + password.id;
    serviceElement.className = 'vault-servicename';
    serviceElement.type = 'text';
    if (undefined !== login) {
        serviceElement.value = login.value;
    }
    serviceElement.placeholder = 'twitter';

    pwElementLabel.innerText = 'Passphrase';
    pwElement.id = 'vault-passphrase-' + password.id;
    pwElement.className = 'vault-passphrase';
    pwElement.type = 'password';
    pwElement.value = password.value;
    pwElement.placeholder = 'best pass ever';

    passDiv.className = 'vault-pass-container';
    passDiv.appendChild(pwElementLabel);
    passDiv.appendChild(pwElement);

    serviceDiv.className = 'vault-service-container';
    serviceDiv.appendChild(serviceElementLabel);
    serviceDiv.appendChild(serviceElement);

    submitButton.id = 'vault-generate-' + password.id;
    submitButton.className = 'vault-generate';
    submitButton.type = 'button';
    submitButton.value = 'Generate';
    if (settings.autosend) {
        submitButton.value = 'Generate\n& Login';
    }

    overlayDiv.id = 'vault-generator-overlay-' + password.id;
    overlayDiv.className = 'vault-generator-overlay';

    dialogDiv.className = 'vault-generator-dialog';
    dialogDiv.appendChild(serviceDiv);
    dialogDiv.appendChild(passDiv);
    dialogDiv.appendChild(submitButton);

    overlayDiv.appendChild(dialogDiv);
    overlayDiv.appendChild(closeSpan);

    password.parentNode.appendChild(overlayDiv);

    on($('vault-passphrase-' + password.id), 'focus', function (e) {
        if (!this.value) {
            this.value = password.value;
        }
    });

};

var getLoginForm = function (password) {
    for (var i = 0; i < document.forms.length; i++) {
        for (var o = 0; o < document.forms[i].length; o++) {
            if (password.id === document.forms[i][o].id) {
                return i;
            }
        }
    }

    return false;
};

var vaultButtonSubmit = function (settings, password) {
    var passPhrase = $('vault-passphrase-' + password.id),
        phraseValue  = passPhrase.value,
        serviceValue = $('vault-servicename-' + password.id).value,
        newPassword,
        loginFormNumber;

    newPassword = generatePassword(serviceValue, phraseValue, settings);

    password.value = newPassword;

    toggleOverlay($('vault-generator-overlay-' + password.id), false);

    if (settings.autosend) {
        loginFormNumber = getLoginForm(password);
        if ('number' === typeof loginFormNumber) {
            document.forms[loginFormNumber].submit();
        }
    } else {
        passPhrase.value = '';
    }
};

var activateOverlay = function (password, login) {
    var passphrase = $('vault-passphrase-' + password.id),
        servicename = $('vault-servicename-' + password.id);

    toggleOverlay($('vault-generator-overlay-' + password.id), true);

    if (servicename && !servicename.value && undefined !== login) {
        servicename.value = login.value;
    }

    if (passphrase && !passphrase.value) {
        passphrase.value = password.value;
    }

    if (!overlayClosed) {
        passphrase.focus();
    }
};

var createOverlay = function (imgUrl, password, login, settings) {
    if (!$('vault-generator-overlay-' + password.id)) {
        addOverlayDiv(imgUrl, password, login, settings);

        on($('vault-generate-' + password.id), 'click', function (e) {
            vaultButtonSubmit(settings, password);
        });

        on($('vault-passphrase-' + password.id), 'keydown', function (e) {
            if (e.keyCode === 13) {
                vaultButtonSubmit(settings, password);
            }
        });

        on($('vault-close-' + password.id), 'click', function (e) {
            toggleOverlay($('vault-generator-overlay-' + password.id), false);
            overlayClosed = true;
        });
    } else {
        activateOverlay(password, login);
    }
};

var initGenerator = function (imgUrl, password, login, settings) {
    createOverlay(imgUrl, password, login, settings);

    on(password, 'focus', function (e) {
        activateOverlay(password, login);
    });

    // make sure the overlay will be loaded even if the password field is already active
    if (password === document.activeElement) {
        activateOverlay(password, login);
    }
};


/** start the overlay presentation and vault generation */
var login = getElementFromList(userFieldList),
    password = getElementFromList(pwFieldList);

var passwords = document.querySelectorAll("input[type=password]");

if (passwords.length > 0) {
    // deactivate autosend for multiple password fields
    settings.autosend = passwords.length === 1;

    for (var i = 0; i < passwords.length; i++) {
        initGenerator(imgURL, passwords[i], login, settings);
    }
} else if (passwords.length === 0 && password) {
    initGenerator(imgURL, password, login, settings);
}

// @todo is there a better way to get the servicename/login?