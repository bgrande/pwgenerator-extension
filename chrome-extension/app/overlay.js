'use strict';

var BASE_NAME = 'easy-password-';

/**
 * handle service specific password field
 */
var PasswordField = {
    _id: '',
    showPw: false
};

PasswordField._generateId = function () {
    var pwString = 'random-id-' + Math.floor(Math.random() * 10);

    if ($(BASE_NAME + 'generator-overlay-' + pwString)) {
        return this._generateId();
    }

    return pwString;
};

PasswordField.getFieldIdentifier = function () {
    if (this._id) {
        return this._id;
    }

    return null;
};

PasswordField.getField = function () {
    return $(this._id);
};

PasswordField.init = function (pwField) {
console.log(pwField);
    var pwString;

    if (pwField.id) {
        this._id = pwField.id;
    } else if (pwField.name) {
        pwString = pwField.name.replace(/\[|\]|:|[ ]/g, '-').replace(/-+$/, '');

        if ($(BASE_NAME + 'generator-overlay-' + pwString)) {
            pwString += '1';
        }

        this._id = pwField.id = pwString;
    } else {
        this._id = pwField.id = this._generateId();
    }

    return this;
};

var LoginField = {
    _id: null
};

LoginField.init = function (userFieldList) {
    var login = Helper.getElementFromList(userFieldList);

    if (!login) {
        this._id = null;
        return false;
    }

    if (login.id) {
        this._id = login.id;
    } else if (login.name) {
        this._id = login.name;
        login.id = login.name;
    }

    return this;
};

LoginField.getField = function () {
    if (this._id) {
        return $(this._id);
    }

    return null;
};

var Overlay = {
    _generator: null,
    _passwordField: null,
    _id: '',
    _isClosed: false,
    _closeImgUrl: ''
};

Overlay._setImgUrls = function (settings) {
    this._closeImgUrl = settings.imgUrl;
};

Overlay._getPasswordFieldId = function () {
    return this._passwordField.getFieldIdentifier();
};

Overlay._getPassphraseField = function () {
    return $(BASE_NAME + 'passphrase-' + this._getPasswordFieldId());
};

Overlay._getServicenameField = function () {
    return $(BASE_NAME + 'servicename-' + this._getPasswordFieldId());
};

Overlay._generateButtonSubmit = function (pwField) {
    var passPhrase = this._getPassphraseField(),
        serviceSalt = this._getServicenameField(),
        newPassword,
        loginFormNumber;

    newPassword = this._generator.generatePassword(passPhrase.value, serviceSalt.value);
    pwField.type = (this._passwordField.showPw) ? 'text' : 'password';
    pwField.value = newPassword;

    this.close();

    if (this._generator.generatorSettings.autosend && !this._passwordField.showPw) {
        loginFormNumber = Helper .getLoginForm(pwField);
        if ('number' === typeof loginFormNumber) {
            document.forms[loginFormNumber].submit();
        }
    }

    passPhrase.value = '';
};

Overlay._createDiv = function (pwField, pwId) {
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
        showPasswordLabel = document.createElement('label');

    closeImg.id = BASE_NAME + 'close-icon-' + pwId;
    closeImg.className = BASE_NAME + 'close-icon';
    closeImg.src = this._closeImgUrl;
    closeImg.alt = chrome.i18n.getMessage("close");

    closeDiv.id = BASE_NAME + 'close-' + pwId;
    closeDiv.className = 'vault-close';
    closeDiv.title = chrome.i18n.getMessage("close");
    closeDiv.appendChild(closeImg);

    var serviceId = BASE_NAME + 'servicename-' + pwId;
    serviceElementLabel.innerText = chrome.i18n.getMessage("serviceNameLabel");
    serviceElementLabel.htmlFor = serviceId;
    serviceElement.id = serviceId;
    serviceElement.className = 'vault-servicename';
    serviceElement.type = 'text';
    serviceElement.placeholder = this._generator.getDomainname();

    var passphraseId = BASE_NAME + 'passphrase-' + pwId;
    pwElementLabel.innerText = chrome.i18n.getMessage("passphraseLabel");
    pwElementLabel.htmlFor = passphraseId;
    pwElement.id = passphraseId;
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

    submitButton.id = BASE_NAME + 'generate-' + pwId;
    submitButton.className = 'vault-generate';
    submitButton.type = 'button';
    submitButton.value = chrome.i18n.getMessage("submitButtonText");
    if (this._generator.generatorSettings.autosend) {
        submitButton.value = chrome.i18n.getMessage("submitButtonTextAlt");
    }

    var showPasswordId = BASE_NAME + 'show-password-' + pwId;
    showPassword.id = showPasswordId;
    showPassword.type = 'checkbox';
    showPasswordLabel.innerText = chrome.i18n.getMessage("showPasswordLabel");
    showPasswordLabel.htmlFor = showPasswordId;
    showPasswordLabel.className = 'description-label';
    showPasswordContainer.className = "vault-show-pw-container";
    showPasswordContainer.title = chrome.i18n.getMessage("showPasswordTitle");
    showPasswordContainer.appendChild(showPassword);
    showPasswordContainer.appendChild(showPasswordLabel);
    passDiv.appendChild(showPasswordContainer);

    generateDiv.className = 'vault-button-container';
    generateDiv.appendChild(submitButton);

    overlayDiv.id = BASE_NAME + 'generator-overlay-' + pwId;
    overlayDiv.className = 'vault-generator-overlay';

    dialogDiv.className = 'vault-generator-dialog';
    dialogDiv.appendChild(serviceDiv);
    dialogDiv.appendChild(passDiv);
    dialogDiv.appendChild(generateDiv);

    overlayDiv.appendChild(closeDiv);
    overlayDiv.appendChild(dialogDiv);

    pwField.parentNode.appendChild(overlayDiv);
};

Overlay._setServicename = function () {
    var servicename = this._getServicenameField(),
        loginField = (this._loginField) ? this._loginField.getField() : null,
        result = this._generator.getServicename(servicename.value, loginField);

    if (result) {
        servicename.value = result;
    }
};

Overlay._create = function (pwField, pwFieldId) {
    var that = this;

    this._createDiv(pwField, pwFieldId);

    on($(BASE_NAME + 'generate-' + pwFieldId), 'click', function () {
        that._generateButtonSubmit(pwField);
    });

    on($(BASE_NAME + 'show-password-' + pwFieldId), 'change', function () {
        that._passwordField.showPw = this.checked;

        // immediately hide password again!
        if (!that._passwordField.showPw) {
            pwField.type = 'password';
        }

        that._getPassphraseField().focus();
    });

    on(this._getPassphraseField(), 'keydown', function (e) {
        Helper.cancelEventPropagation(e);

        switch (e.keyCode) {
            case 13:
                e.preventDefault();
                that._generateButtonSubmit(pwField);
                break;
            case 27:
                that.close();
                break;
        }
    });

    /** try preventing another events from bubbling or catching */
    on(this._getPassphraseField(), ['blur', 'click', 'keyup', 'keypress', 'change'], function (e) {
        Helper.cancelEventPropagation(e);
    });
    on(pwField, ['click', 'keyup', 'keypress', 'change'], function (e) {
        Helper.cancelEventPropagation(e);
    });

    on(this._getServicenameField(), 'keydown', function (e) {
        Helper.cancelEventPropagation(e);
        switch (e.keyCode) {
            case 13:
                e.preventDefault();
                that._getPassphraseField().focus();
                break;
            case 27:
                e.preventDefault();
                that.close();
                break;
        }
    });

    on($(this._id), 'keydown', function (e) {
        if (e.keyCode === 27) {
            e.preventDefault();
            that.close();
        }
    });

    on($('vault-close-' + pwFieldId), 'click', function () {
        that.close();
    });

    this._setServicename();
};

Overlay.activate = function () {
    var passphrase = this._getPassphraseField();

    this.toggle(true);

    if (!this._isClosed) {
        passphrase.focus();
    }

    this._isClosed = false;

    this._setServicename();
};

Overlay.close = function () {
    this.toggle(false);
    this._isClosed = true;
    this._passwordField.getField().focus();
};

Overlay.toggle = function (status) {
    var display = 'none';

    if (status) {
        display = 'block';
    }

    $(this._id).style.display = display;
};

Overlay.init = function (settings, passwordField, loginField, generator) {
    this._passwordField = passwordField;
    this._loginField = loginField;
    this._generator = generator;
    this._setImgUrls(settings);

    var pwFieldId = this._getPasswordFieldId(),
        that = this;

    on(this._passwordField.getField(), 'focus', function () {
        if (!that._isClosed) {
            that.activate();
        } else {
            that._isClosed = false;
        }
    });

    // make sure the overlay will be loaded even if the password field is already active
    if (true === this._isClosed && passwordField === document.activeElement) {
        this.activate();
    }

    this._id = BASE_NAME + 'generator-overlay-' + pwFieldId;
    this._create(this._passwordField.getField(), pwFieldId);

    return this;
};