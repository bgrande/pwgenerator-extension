'use strict';

var DomainService = {
    _serviceName: '',
    _rules: null
};

DomainService._setDomainname = function () {
    var domainname = document.domain,
        domainparts = domainname.split('.');

    if (2 < domainparts.length) {
        domainname = domainparts[domainparts.length - 2] + '.' + domainparts[domainparts.length - 1];

        if (Helper.isCcTld(domainparts[domainparts.length - 2])) {
            domainname = domainparts[domainparts.length - 3] + '.' + domainname;
        }
    }

    this._serviceName = domainname;
};

DomainService.getDomainname = function () {
    return this._serviceName;
};

DomainService._setPasswordRules = function (settings) {
    if (settings && settings[this._serviceName]) {
        this._rules = settings[this._serviceName];
    }
};

DomainService.getPasswordRules = function () {
    return this._rules;
};

DomainService.init = function (ruleSettings) {
    this._setDomainname();
    this._setPasswordRules(ruleSettings);

    return this;
};

var VaultGenerator = {
    _overlayId: '',
    _vaultSettings: {},
    _generatorSettings: {},
    _overlayClosed: false,
    _vaultGeneratorOverlayIdentifier: 'vault-generator-overlay-',
    _vaultGeneratorDialogIdentifier: 'vault-generator-dialog-',
    _pwId: '',
    _showPw: false,
    _pwFieldIdentifier: '',
    _closeImgUrl: '',
    _loginField: {},
    _domainService: null
};

VaultGenerator._setLoginName = function (defaultSettings) {
    var userFieldList = defaultSettings.userFieldList,
        login = Helper.getElementFromList(userFieldList);

    if (!login) {
        this._loginField = null;
        return;
    }

    if (login.id) {
        this._loginField = login.id;
    } else if (login.name) {
        this._loginField = login.name;
        login.id = login.name;
    }
};

VaultGenerator._getLoginField = function () {
    if (this._loginField) {
        return $(this._loginField);
    }

    return null;
};

VaultGenerator.toggleOverlay = function (status) {
    var display = 'none';

    if (status) {
        display = 'block';
    }

    $(this._overlayId).style.display = display;
};

VaultGenerator.getServicevalue = function () {
    return this._getServicenameField().value;
};

VaultGenerator.getPhrasevalue = function () {
    return this._getPassphraseField().value;
};

VaultGenerator.generatePassword = function () {
    var phraseValue = this.getPhrasevalue(),
        serviceValue = this.getServicevalue(),
        pwValue,
        vaultSettings;

    try {
        if (serviceValue && phraseValue) {
            vaultSettings = Helper.mergeObject(this._vaultSettings, this._domainService.getPasswordRules());
            vaultSettings.phrase = phraseValue;
            pwValue = new Vault(vaultSettings).generate(serviceValue);
        } else {
            pwValue = '';
        }

        return pwValue;
    } catch (e) {
        return '!! ' + e.message;
    }
};

VaultGenerator._generateId = function () {
    var pwString = 'random-id-' + Math.floor(Math.random() * 10);

    if ($('vault-generator-overlay-' + pwString)) {
        return this._generateId();
    }

    return pwString;
};

VaultGenerator._setPasswordIdentifier = function (pwField) {
    var pwString;

    if (pwField.id) {
        this._pwId = pwField.id;
    } else if (pwField.name) {
        pwString = pwField.name.replace(/\[|\]|:|[ ]/g, '-').replace(/-+$/, '');

        if ($('vault-generator-overlay-' + pwString)) {
            pwString += '1';
        }

        this._pwId = pwString;
    } else {
        this._pwId = pwField.id = this._generateId();
    }
};

VaultGenerator.getPasswordIdentifier = function () {
    if (this._pwId) {
        return this._pwId;
    }

    return null;
};

VaultGenerator._addOverlayDiv = function (pwField) {
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
        showPasswordContainer = document.createElement('div'),
        showPassword = document.createElement('input'),
        showPasswordLabel = document.createElement('label'),
        pwId = this.getPasswordIdentifier();

    closeImg.id = 'vault-close-icon-' + pwId;
    closeImg.className = 'vault-close-icon';
    closeImg.src = this._closeImgUrl;
    closeImg.alt = chrome.i18n.getMessage("closeOverlay");

    closeDiv.id = 'vault-close-' + pwId;
    closeDiv.className = 'vault-close';
    closeDiv.title = chrome.i18n.getMessage("closeOverlay");
    closeDiv.appendChild(closeImg);

    serviceElementLabel.innerText = chrome.i18n.getMessage("serviceNameLabel");
    serviceElementLabel.htmlFor = 'vault-servicename-' + pwId;
    serviceElement.id = 'vault-servicename-' + pwId;
    serviceElement.className = 'vault-servicename';
    serviceElement.type = 'text';
    serviceElement.placeholder = this._getDomainname();

    pwElementLabel.innerText = chrome.i18n.getMessage("passphraseLabel");
    pwElementLabel.htmlFor = 'vault-passphrase-' + pwId;
    pwElement.id = 'vault-passphrase-' + pwId;
    pwElement.className = 'vault-passphrase';
    pwElement.type = 'password';
    pwElement.value = '';
    pwElement.placeholder = chrome.i18n.getMessage("passphrasePlaceholder");

    passDiv.className = 'vault-pass-container';
    passDiv.appendChild(pwElementLabel);
    passDiv.appendChild(pwElement);

    serviceDiv.className = 'vault-service-container';
    serviceDiv.appendChild(serviceElementLabel);
    serviceDiv.appendChild(serviceElement);

    submitButton.id = 'vault-generate-' + pwId;
    submitButton.className = 'vault-generate';
    submitButton.type = 'button';
    submitButton.value = chrome.i18n.getMessage("submitButtonText");
    if (this._generatorSettings.autosend) {
        submitButton.value = chrome.i18n.getMessage("submitButtonTextAlt");
    }

    showPassword.id = 'vault-show-password-' + pwId;
    showPassword.type = 'checkbox';
    showPasswordLabel.innerText = chrome.i18n.getMessage("showPasswordLabel");
    showPasswordLabel.htmlFor = 'vault-show-password-' + pwId;
    showPasswordLabel.className = 'description-label';
    showPasswordContainer.className = "vault-show-pw-container";
    showPasswordContainer.title = chrome.i18n.getMessage("showPasswordTitle");
    showPasswordContainer.appendChild(showPassword);
    showPasswordContainer.appendChild(showPasswordLabel);
    passDiv.appendChild(showPasswordContainer);

    generateDiv.className = 'vault-button-container';
    generateDiv.appendChild(submitButton);

    overlayDiv.id = 'vault-generator-overlay-' + pwId;
    overlayDiv.className = 'vault-generator-overlay';

    dialogDiv.className = 'vault-generator-dialog';
    dialogDiv.appendChild(serviceDiv);
    dialogDiv.appendChild(passDiv);
    dialogDiv.appendChild(generateDiv);

    overlayDiv.appendChild(closeDiv);
    overlayDiv.appendChild(dialogDiv);

    pwField.parentNode.appendChild(overlayDiv);
};

VaultGenerator.getLoginForm = function (pwField) {
    for (var i = 0, n = document.forms.length; i < n; i++) {
        for (var o = 0, m = document.forms[i].length; o < m; o++) {
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

VaultGenerator._getPassphraseField = function () {
    return $('vault-passphrase-' + this.getPasswordIdentifier());
};

VaultGenerator._getServicenameField = function () {
    return $('vault-servicename-' + this.getPasswordIdentifier());
};

VaultGenerator._vaultButtonSubmit = function (pwField) {
    var passPhrase = this._getPassphraseField(),
        newPassword,
        loginFormNumber;

    newPassword = this.generatePassword();
    pwField.type = (this._showPw) ? 'text' : 'password';
    pwField.value = newPassword;

    this.closeOverlay(pwField);

    if (this._generatorSettings.autosend && !this._showPw) {
        loginFormNumber = this.getLoginForm(pwField);
        if ('number' === typeof loginFormNumber) {
            document.forms[loginFormNumber].submit();
        }
    } else {
        passPhrase.value = '';
    }
};

VaultGenerator._getDomainname = function () {
    return this._domainService.getDomainname();
};

VaultGenerator.setServicename = function () {
    var domainname = this._getDomainname(),
        loginField = this._getLoginField(),
        servicename = this._getServicenameField();

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
    var passphrase = this._getPassphraseField(),
        pwField = this.getPwField();

    this.toggleOverlay(true);

    if (!this._overlayClosed) {
        passphrase.focus();
    }

    this._overlayClosed = false;

    this.setServicename();
};

VaultGenerator.closeOverlay = function (pwField) {
    this.toggleOverlay(false);
    this._overlayClosed = true;
    pwField.focus();
};

VaultGenerator._createOverlay = function () {
    var pwId = this.getPasswordIdentifier(),
        pwField = this.getPwField(),
        that = this;

    this._addOverlayDiv(pwField);
    this._overlayId = 'vault-generator-overlay-' + pwId;

    on($('vault-generate-' + pwId), 'click', function () {
        that._vaultButtonSubmit(pwField);
    });


    on($('vault-show-password-' + pwId), 'change', function () {
        that._showPw = this.checked;

        // immediately hide password again!
        if (!that._showPw) {
            pwField.type = 'password';
        }
    });

    on(this._getPassphraseField(), 'keydown', function (e) {
        // @todo   add logic to simulate random char-keypress(es) at a random position
        // @todo   which will be stored internally and be removed before the password is generated
        Helper.cancelEventBubbling(e);

        switch (e.keyCode) {
            case 13:
                e.preventDefault();
                that._vaultButtonSubmit(pwField);
                break;
            case 27:
                that.closeOverlay(pwField);
                break;
        }
    });

    /**
     * try preventing another events from bubbling or catching
     */
    on(this._getPassphraseField(), ['keyup', 'keypress', 'change'], function (e) {
        Helper.cancelEventBubbling(e);
    });

    on(this._getServicenameField(), 'keydown', function (e) {
        Helper.cancelEventBubbling(e);
        switch (e.keyCode) {
            case 13:
                e.preventDefault();
                that._getPassphraseField().focus();
                break;
            case 27:
                e.preventDefault();
                that.closeOverlay(pwField);
                break;
        }
    });

    on($(this._overlayId), 'keydown', function (e) {
        if (e.keyCode === 27) {
            e.preventDefault();
            that.closeOverlay(pwField);
        }
    });

    on($('vault-close-' + pwId), 'click', function () {
        that.closeOverlay(pwField);
    });

    this.setServicename();
};

VaultGenerator._setVaultSettings = function (settings, defaultSettings) {
    var vaultSettings = {}, i, n;

    vaultSettings.length = undefined !== settings.plength ? settings.plength : defaultSettings.length;
    vaultSettings.repeat = undefined !== settings.repeat ? settings.repeat : defaultSettings.repeat;
    vaultSettings.iteration = undefined !== settings.iteration ? settings.iteration : defaultSettings.iteration;

    for (i = 0, n = TYPES.length; i < n; i++) {
        vaultSettings[TYPES[i]] = undefined !== settings[TYPES[i]] ? settings[TYPES[i]] : defaultSettings[TYPES[i]];
    }

    this._vaultSettings = vaultSettings;
};

VaultGenerator._setGeneratorSettings = function (settings, defaultSettings) {
    var generatorSettings = {};

    generatorSettings.autosend = undefined !== settings.autosend ? settings.autosend : defaultSettings.autosend;
    generatorSettings.servicename = undefined !== settings.servicename ? settings.servicename : defaultSettings.servicename;
    generatorSettings.defServicename = undefined !== settings.defServicename ? settings.defServicename : defaultSettings.defServicename;

    this._generatorSettings = generatorSettings;
};

VaultGenerator._setPwFieldIdentifier = function (pwField) {
    if (pwField.id) {
        this._pwFieldIdentifier = pwField.id;
    } else if (pwField.name) {
        this._pwFieldIdentifier = pwField.name;
        pwField.id = pwField.name;
    }
};

VaultGenerator.getPwField = function () {
    return $(this._pwFieldIdentifier);
};

VaultGenerator._setImgUrls = function (defaultSettings) {
    this._closeImgUrl = defaultSettings.imgUrl;
};

VaultGenerator._setDomainService = function (serviceExceptions) {
    this._domainService = Object.create(DomainService).init(serviceExceptions)
};

VaultGenerator._initProperties = function (pwField, defaultSettings) {
    this._setPwFieldIdentifier(pwField);
    this._setPasswordIdentifier(pwField);
    this._setImgUrls(defaultSettings);
    this._setLoginName(defaultSettings);
};

VaultGenerator._initSettings = function (settings, defaultSettings) {
    this._setVaultSettings(settings, defaultSettings);
    this._setGeneratorSettings(settings, defaultSettings);
};

VaultGenerator.init = function (pwField, settings, defaultSettings) {
    if (!pwField) {
        return false;
    }

    this._setDomainService(defaultSettings.serviceExceptions);
    this._initProperties(pwField, defaultSettings);
    this._initSettings(settings, defaultSettings);
    this._createOverlay();

    var that = this;

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