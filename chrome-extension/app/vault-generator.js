var VaultGenerator = {
    _overlayId: '',
    _vaultSettings: {},
    _generatorSettings: {},
    _overlayClosed: false,
    _pwId: '',
    _pwFieldIdentifier: '',
    _closeImgUrl: '',
    _loginField: {}
};

VaultGenerator._setLoginName = function (defaultSettings) {
    var userFieldList = defaultSettings.userFieldList,
        login = getElementFromList(userFieldList);

    if (login.id) {
        this._loginField = login.id;
    } else if (login.name) {
        this._loginField = login.name;
        login.id = login.name;
    }
};

VaultGenerator.getLoginField = function () {
    'use strict';

    if (this._loginField) {
        return $(this._loginField);
    }

    return null;
};

VaultGenerator.toggleOverlay = function (status) {
    'use strict';

    var display = 'none';

    if (status) {
        display = 'block';
    }

    $(this._overlayId).style.display = display;
};

VaultGenerator.getServicevalue = function () {
    return $('vault-servicename-' + this.getPasswordIdentifier()).value;
};

VaultGenerator.getPhrasevalue = function () {
    return $('vault-passphrase-' + this.getPasswordIdentifier()).value;
};

VaultGenerator.generatePassword = function () {
    'use strict';

    var phraseValue = this.getPhrasevalue(),
        serviceValue = this.getServicevalue(),
        pwValue;

    try {
        if (serviceValue && phraseValue) {
            this._vaultSettings.phrase = phraseValue;
            pwValue = new Vault(this._vaultSettings).generate(serviceValue);
        } else {
            pwValue = '';
        }

        return pwValue;
    } catch (e) {
        return '!! ' + e.message;
    }
};

VaultGenerator._generateId = function (pwField) {
    var pwString = 'random-id-' + Math.floor(Math.random() * 10);

    if ($('vault-generator-overlay-' + pwString)) {
        return this._generateId(pwField);
    }

    return pwString;
};

VaultGenerator._setPasswordIdentifier = function (pwField) {
    'use strict';

    var pwString;

    if (pwField.id) {
        this._pwId = pwField.id;
    } else if (pwField.name) {
        pwString = pwField.name.replace(/\[|\]/g, '-').replace(/-+$/, '');

        if ($('vault-generator-overlay-' + pwString)) {
            pwString += '1';
        }

        this._pwId = pwString;
    } else {
        this._pwId = pwField.id = this._generateId(pwField);
    }
};

VaultGenerator.getPasswordIdentifier = function () {
    'use strict';

    if (this._pwId) {
        return this._pwId;
    }

    return null;
};

VaultGenerator.addOverlayDiv = function (pwField) {
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
        pwId = this.getPasswordIdentifier();

    closeImg.id = 'vault-close-icon-' + pwId;
    closeImg.className = 'vault-close-icon';
    closeImg.src = this._closeImgUrl;
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
    if (this._generatorSettings.autosend) {
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

    on($('vault-passphrase-' + pwId), 'focus', function () {
        if (!this.value) {
            this.value = pwField.value;
        }
    });
};

VaultGenerator.getLoginForm = function (pwField) {
    'use strict';

    for (var i = 0; i < document.forms.length; i++) {
        for (var o = 0; o < document.forms[i].length; o++) {
            if (pwField.id === document.forms[i][o].id) {
                return i;
            }
            if (pwField.name === document.forms[i][o].name) {
                return i;
            }
        }
    }

    return false;
};

VaultGenerator.createVaultButtonSubmit = function (pwField) {
    'use strict';

    var pwId = this.getPasswordIdentifier();

    var passPhrase = $('vault-passphrase-' + pwId),
        newPassword,
        loginFormNumber;

    newPassword = this.generatePassword();
//console.log(newPassword);
    pwField.value = newPassword;

    this.toggleOverlay(false);

    if (this._generatorSettings.autosend) {
        loginFormNumber = this.getLoginForm(pwField);
        if ('number' === typeof loginFormNumber) {
            document.forms[loginFormNumber].submit();
        }
    } else {
        passPhrase.value = '';
    }
};

VaultGenerator.setServicename = function () {
    var domainparts = document.domain.split('.'),
        domainname = document.domain,
        loginField = this.getLoginField(),
        servicename = $('vault-servicename-' + this.getPasswordIdentifier());

    if (2 < domainparts.length) {
        domainname = domainparts[domainparts.length - 2] + '.' + domainparts[domainparts.length - 1];
    }

    if (!servicename || (servicename.value && domainname !== servicename.value)) {
        return false;
    }

    switch (this._generatorSettings.servicename) {
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
            if (this._generatorSettings.defServicename) {
                servicename.value = this._generatorSettings.defServicename + domainname;
            }
            break;

        case 'suffix':
            if (this._generatorSettings.defServicename) {
                servicename.value = domainname + this._generatorSettings.defServicename;
            }
            break;
    }

    return true;
};

VaultGenerator.activateOverlay = function () {
    'use strict';

    var passphrase = $('vault-passphrase-' + this.getPasswordIdentifier()),
        pwField = this.getPwField();

    this.toggleOverlay(true);

    if (passphrase && !passphrase.value) {
        passphrase.value = pwField.value;
    }

    if (!this._overlayClosed) {
        passphrase.focus();
    }

    this._overlayClosed = false;

    this.setServicename();
};

VaultGenerator.closeOverlay = function (pwField) {
    'use strict';

    this.toggleOverlay(false);
    this._overlayClosed = true;
    pwField.focus();
};

VaultGenerator._createOverlay = function () {
    'use strict';

    var pwId = this.getPasswordIdentifier(),
        pwField = this.getPwField(),
        servicename = $('vault-servicename-' + pwId),
        that = this;

    this.addOverlayDiv(pwField);
    this._overlayId = 'vault-generator-overlay-' + pwId;

    on($('vault-generate-' + pwId), 'click', function () {
        that.createVaultButtonSubmit(pwField);
    });

    on($('vault-passphrase-' + pwId), 'keydown', function (e) {
        switch (e.keyCode) {
            case 13:
                that.createVaultButtonSubmit(pwField);
                break;
            case 27:
                that.closeOverlay(pwField);
                break;
        }
    });

    on(servicename, 'keydown', function (e) {
        if (e.keyCode === 27) {
            that.closeOverlay(pwField);
        }
    });

    on($(this._overlayId), 'keydown', function (e) {
        if (e.keyCode === 27) {
            that.closeOverlay(pwField);
        }
    });

    on($('vault-close-' + pwId), 'click', function () {
        that.closeOverlay(pwField);
    });

    this.setServicename();
};

VaultGenerator._setVaultSettings = function (settings, defaultSettings) {
    'use strict';

    var vaultSettings = {};

    vaultSettings.length = undefined !== settings.plength ? settings.plength : defaultSettings.length;
    vaultSettings.repeat = undefined !== settings.repeat ? settings.repeat : defaultSettings.repeat;

    for (var i = 0; i < TYPES.length; i++) {
        vaultSettings[TYPES[i]] = undefined !== settings[TYPES[i]] ? settings[TYPES[i]] : defaultSettings[TYPES[i]];
    }

    this._vaultSettings = vaultSettings;
};

VaultGenerator._setGeneratorSettings = function (settings, defaultSettings) {
    'use strict';

    var generatorSettings = {};

    generatorSettings.autosend = undefined !== settings.autosend ? settings.autosend : defaultSettings.autosend;
    generatorSettings.servicename = undefined !== settings.servicename ? settings.servicename : defaultSettings.servicename;
    generatorSettings.defServicename = undefined !== settings.defServicename ? settings.defServicename : defaultSettings.defServicename;

    this._generatorSettings = generatorSettings;
};

VaultGenerator._setPwFieldIdentifier = function (pwField) {
    'use strict';

    if (pwField.id) {
        this._pwFieldIdentifier = pwField.id;
    } else if (pwField.name) {
        this._pwFieldIdentifier = pwField.name;
        pwField.id = pwField.name;
    }
};

VaultGenerator.getPwField = function () {
    'use strict';

    return $(this._pwFieldIdentifier);
};

VaultGenerator._setImgUrls = function (defaultSettings) {
    'use strict';

    this._closeImgUrl = defaultSettings.imgUrl;
};

VaultGenerator._initProperties = function (pwField, defaultSettings) {
    'use strict';

    this._setPwFieldIdentifier(pwField);
    this._setPasswordIdentifier(pwField);
    this._setImgUrls(defaultSettings);
    this._setLoginName(defaultSettings);
};

VaultGenerator._initSettings = function (settings, defaultSettings) {
    'use strict';

    this._setVaultSettings(settings, defaultSettings);
    this._setGeneratorSettings(settings, defaultSettings);
};

VaultGenerator.init = function (pwField, settings, defaultSettings) {
    'use strict';

    var that = this;

    this._initProperties(pwField, defaultSettings);
    this._initSettings(settings, defaultSettings);
    this._createOverlay();

    on(pwField, 'focus', function () {
        if (!that._overlayClosed) {
            that.activateOverlay();
        } else {
            that._overlayClosed = false;
        }
    });

    // make sure the overlay will be loaded even if the password field is already active
    if (true === this._overlayClosed && pwField === document.activeElement) {
        this.activateOverlay();
    }

    return this;
};