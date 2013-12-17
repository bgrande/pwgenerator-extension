var SETTINGS = {},
    VaultGenerator = {
        _overlay: {},
        _serviceValue: '',
        _phraseValue: '',
        _vaultSettings: {},
        _overlayClosed: false,
        _pwId: '',
        _imgUrl: '',
        _pwField: {},
        _loginField: {}
    };

SETTINGS.pwFieldList = [
    'pass', 'pass1', 'pass2', 'Pass', 'passwd', 'Passwd', 'password', 'Password', 'PASSWORD',
    'pw', 'PW', 'passwort', 'Passwort', 'ap_password', 'login_password', 'user_password',
    'user_pass', 'pwd', 'rpass'
];

SETTINGS.userFieldList = [
    'mail', 'Mail', 'email', 'Email', 'EMail', 'e-mail', 'E-Mail', 'eMail', 'login', 'Login',
    'user', 'User', 'username', 'Username', 'ap_email', 'userid', 'Userid', 'userId', 'UserId',
    'login_email', 'user_login', 'signin-email', 'j_username', 'session[username_or_email]'
];

SETTINGS.imgUrl = chrome.extension.getURL("./images/close.png");

VaultGenerator.setLoginName = function (userFieldList) {
    var login = getElementFromList(userFieldList, $);

    if (!login) {
        // @todo make this work right
        var callback = function (name) {
            return document.getElementsByName(name);
        };
        login = getElementFromList(userFieldList, callback);
    }

    this._loginField = login;
};

VaultGenerator.toggleOverlay = function (status) {
    'use strict';

    var display = 'none';

    if (status) {
        display = 'block';
    }

    this._overlay.style.display = display;
};

VaultGenerator.generatePassword = function () {
    'use strict';

    var pwValue;

    try {
        if (this._serviceValue && this._phraseValue) {
            this._vaultSettings.phrase = this._phraseValue;
            pwValue = new Vault(this._vaultSettings).generate(this._serviceValue);
        } else {
            pwValue = '';
        }

        return pwValue;
    } catch (e) {
        return '!! ' + e.message;
    }
};

VaultGenerator.getPasswordIdentifier = function (password) {
    'use strict';

    var pwString, pwId;

    if (password.id && password.id.match(/^vault-passphrase-/)) {
        pwId = password.id;
        return pwId.replace(/^vault-passphrase-/, '');
    } else if (password.id) {
        return password.id;
    }

    if (password.name) {
        pwString = password.name.replace(/\[|\]/g, '-').replace(/-+$/, '');

        if ($('vault-generator-overlay-' + pwString)) {
            pwString += '1';
        }

        return pwString;
    }

    return null;
};

/*VaultGenerator.getPasswordIdentifier = function () {
    'use strict';

    return this._pwId;
};*/

VaultGenerator.addOverlayDiv = function () {
    'use strict';

    var overlayDiv = document.createElement('div'),
        dialogDiv = document.createElement('div'),
        serviceDiv = document.createElement('div'),
        passDiv = document.createElement('div'),
        generateDiv = document.createElement('div'),
        closeDiv = document.createElement('div'),
        closeImg = document.createElement('img'),
        serviceElementLabel = document.createElement('label'),
        serviceElement = document.createElement('input'),
        pwElementLabel = document.createElement('label'),
        pwElement = document.createElement('input'),
        submitButton = document.createElement('input'),
        pwId = this.getPasswordIdentifier(),
        pwField = this._pwField;

    closeImg.id = 'vault-close-icon-' + pwId;
    closeImg.className = 'vault-close-icon';
    closeImg.src = this._imgUrl;
    closeImg.alt = 'Close Overlay';

    closeDiv.id = 'vault-close-' + pwId;
    closeDiv.className = 'vault-close';
    closeDiv.title = 'Close Overlay';
    closeDiv.appendChild(closeImg);

    serviceElementLabel.innerText = 'Service name';
    serviceElement.id = 'vault-servicename-' + pwId;
    serviceElement.className = 'vault-servicename';
    serviceElement.type = 'text';
    serviceElement.placeholder = 'twitter';

    pwElementLabel.innerText = 'Passphrase';
    pwElement.id = 'vault-passphrase-' + pwId;
    pwElement.className = 'vault-passphrase';
    pwElement.type = 'password';
    pwElement.value = pwField.value;
    pwElement.placeholder = 'best pass ever';

    passDiv.className = 'vault-pass-container';
    passDiv.appendChild(pwElementLabel);
    passDiv.appendChild(pwElement);

    serviceDiv.className = 'vault-service-container';
    serviceDiv.appendChild(serviceElementLabel);
    serviceDiv.appendChild(serviceElement);

    submitButton.id = 'vault-generate-' + pwId;
    submitButton.className = 'vault-generate';
    submitButton.type = 'button';
    submitButton.value = 'Generate';
    if (this._vaultSettings.autosend) {
        submitButton.value = 'Generate\n& Login';
    }

    generateDiv.className = 'vault-button-container';
    generateDiv.appendChild(submitButton);

    overlayDiv.id = 'vault-generator-overlay-' + pwId;
    overlayDiv.className = 'vault-generator-overlay';
    overlayDiv.style = 'display: none';

    dialogDiv.className = 'vault-generator-dialog';
    dialogDiv.appendChild(serviceDiv);
    dialogDiv.appendChild(passDiv);
    dialogDiv.appendChild(generateDiv);

    overlayDiv.appendChild(closeDiv);
    overlayDiv.appendChild(dialogDiv);

    pwField.parentNode.appendChild(overlayDiv);

    this._overlay = $('vault-generator-dialog' + pwId);

    on($('vault-passphrase-' + pwId), 'focus', function () {
        if (!this.value) {
            this.value = pwField.value;
        }
    });
};

VaultGenerator.getLoginForm = function () {
    'use strict';

    for (var i = 0; i < document.forms.length; i++) {
        for (var o = 0; o < document.forms[i].length; o++) {
            if (this._pwField.id === document.forms[i][o].id) {
                return i;
            }
            if (this._pwField.name === document.forms[i][o].name) {
                return i;
            }
        }
    }

    return false;
};

VaultGenerator.createVaultButtonSubmit = function () {
    'use strict';

    var pwId = this.getPasswordIdentifier();

    var passPhrase = $('vault-passphrase-' + pwId),
        newPassword,
        loginFormNumber;

    newPassword = this.generatePassword();
//console.log(newPassword);
    this._pwField.value = newPassword;

    this.toggleOverlay(false);

    if (this._vaultSettings.autosend) {
        loginFormNumber = this.getLoginForm();
        if ('number' === typeof loginFormNumber) {
            document.forms[loginFormNumber].submit();
        }
    } else {
        passPhrase.value = '';
    }
};

VaultGenerator.setServicename = function (servicename) {
    var domainparts = document.domain.split('.'),
        domainname = document.domain,
        loginField = this._loginField;

    if (2 < domainparts.length) {
        domainname = domainparts[domainparts.length - 2] + '.' + domainparts[domainparts.length - 1];
    }

    if (!servicename || servicename.value) {
        return false;
    }

    switch (this._vaultSettings.servicename) {
        case 'login':
            if (undefined === loginField) {
                return null;
            }

            if (loginField.value) {
                servicename.value = loginField.value;
            } else if (loginField.textContent && loginField.textContent.length <= 30) {
                servicename.value = loginField.textContent;
            } else {
                servicename.value = domainname;
            }
            break;

        case 'prefix':
            if (this._vaultSettings.servicename.defServicename) {
                servicename.value = this._vaultSettings.servicename.defServicename + domainname;
            }
            break;

        case 'suffix':
            if (this._vaultSettings.servicename.defServicename) {
                servicename.value = domainname + this._vaultSettings.servicename.defServicename;
            }
            break;
    }

    return true;
};

VaultGenerator.activateOverlay = function () {
    'use strict';

    var pwId = this.getPasswordIdentifier(),
        passphrase = $('vault-passphrase-' + pwId),
        servicename = $('vault-servicename-' + pwId);

    this.toggleOverlay(true);

    if (passphrase && !passphrase.value) {
        passphrase.value = this._pwField.value;
    }

    if (!this._overlayClosed) {
        passphrase.focus();
    }

    this._overlayClosed = false;

    this.setServicename(servicename);
};

VaultGenerator.closeOverlay = function () {
    'use strict';

    this.toggleOverlay(false);
    this._overlayClosed = true;
    this._pwField.focus();
};

VaultGenerator.createOverlay = function () {
    'use strict';

    var pwId = this.getPasswordIdentifier(),
        servicename = $('vault-servicename-' + pwId),
        that = this;

    this.addOverlayDiv();

    on($('vault-generate-' + pwId), 'click', function () {
        that.createVaultButtonSubmit();
    });

    on($('vault-passphrase-' + pwId), 'keydown', function (e) {
        switch (e.keyCode) {
            case 13:
                that.createVaultButtonSubmit();
                break;
            case 27:
                that.closeOverlay();
                break;
        }
    });

    on(servicename, 'keydown', function (e) {
        if (e.keyCode === 27) {
            that.closeOverlay();
        }
    });

    on($('vault-generator-overlay' + pwId), 'keydown', function (e) {
        if (e.keyCode === 27) {
            that.closeOverlay();
        }
    });

    on($('vault-close-' + pwId), 'click', function () {
        that.closeOverlay();
    });

    this.setServicename(servicename);
};

VaultGenerator.setSettings = function (settings, defaultSettings) {
    'use strict';

    settings.length = undefined !== settings.plength ? settings.plength : defaultSettings.length;
    settings.repeat = undefined !== settings.repeat ? settings.repeat : defaultSettings.repeat;
    settings.autosend = undefined !== settings.autosend ? settings.autosend : defaultSettings.autosend;
    settings.servicename = undefined !== settings.servicename ? settings.servicename : defaultSettings.servicename;
    settings.defServicename = undefined !== settings.defServicename ? settings.defServicename : defaultSettings.defServicename;

    for (var i = 0; i < TYPES.length; i++) {
        settings[TYPES[i]] = undefined !== settings[TYPES[i]] ? settings[TYPES[i]] : defaultSettings[TYPES[i]];
    }

    this._vaultSettings = settings;
};

VaultGenerator.init = function (settings, pwField, vaultSettings, defaultSettings) {
    'use strict';

    var that = this;

    this._pwField = pwField;
    this._imgUrl = settings.imgUrl;
    this.setLoginName(SETTINGS.userFieldList);
    this.setSettings(vaultSettings, defaultSettings);

    if (!$('vault-generator-overlay-' + this.getPasswordIdentifier($(pwField)))) {
        this.createOverlay();

        on($(pwField), 'focus', function () {
            if (!that._overlayClosed) {
                that.activateOverlay();
            } else {
                that._overlayClosed = false;
            }
        });
    } else {
        this.activateOverlay();
    }

    // make sure the overlay will be loaded even if the password field is already active
    if (true === this._overlayClosed && pwField === document.activeElement) {
        this.activateOverlay();
    }
};