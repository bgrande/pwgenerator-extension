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
    _closeImgUrl: '',
    _arrowUpImgUrl: '',
    _arrowDownImgUrl: '',
    _settingsOverwrite: false
};

Overlay._setImgUrls = function (settings) {
    this._closeImgUrl = settings.imgUrl;
    this._arrowDownImgUrl = settings.arrowDown;
    this._arrowUpImgUrl = settings.arrowUp;
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

Overlay._getOverwriteSettings = function () {
    var length = parseInt($('vlength').value, 10),
        repeat = parseInt($('repeat').value, 10),
        required = parseInt($('required').value, 10),
        save = $('save').checked,
        serviceRules = {};

    if (length) {
        serviceRules['length'] = length;
    }

    if (repeat) {
        serviceRules['repeat'] = repeat;
    }

    if (required) {
        serviceRules['requiredLength'] = required;
    }

    serviceRules = Helper.getTypeSettings(serviceRules, required);

    if (save) {
        var serviceExceptions = {};

        serviceExceptions[this._generator.getDomainname()] = serviceRules;
        chrome.runtime.sendMessage({event: 'saveOverwrite', settings: serviceExceptions});
        // @todo we might want to ask the user to contribute the new settings
        // @todo we need an overview with all exceptions and corresponding (c)rud
    }

    return serviceRules;
};

Overlay._setOverwriteSettings = function (settings) {
    if (settings.hasOwnProperty('length') && settings.length) {
        $('vlength').value = settings.length;
    }

    if (settings.hasOwnProperty('repeat') && settings.repeat) {
        $('repeat').value = settings.repeat;
    }

    if (settings.hasOwnProperty('requiredLength') && settings.requiredLength) {
        $('required').value = settings.requiredLength;
    }
};

Overlay._generateButtonSubmit = function (pwField) {
    var passPhrase = this._getPassphraseField(),
        serviceSalt = this._getServicenameField(),
        newPassword,
        loginFormNumber,
        overwriteSettings;

    if (this._settingsOverwrite) {
        overwriteSettings = this._getOverwriteSettings();
    }

    newPassword = this._generator.generatePassword(passPhrase.value, serviceSalt.value, overwriteSettings);
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
        settingsDiv = document.createElement('div'),
        closeDiv = document.createElement('div'),
        closeImg = document.createElement('img'),
        extendImg = document.createElement('img'),
        extendDiv = document.createElement('div'),
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
    closeDiv.className = 'close';
    closeDiv.title = chrome.i18n.getMessage("close");
    closeDiv.appendChild(closeImg);

    var serviceId = BASE_NAME + 'servicename-' + pwId;
    serviceElementLabel.innerText = chrome.i18n.getMessage("serviceNameLabel");
    serviceElementLabel.htmlFor = serviceId;
    serviceElement.id = serviceId;
    serviceElement.className = 'servicename';
    serviceElement.type = 'text';
    serviceElement.placeholder = this._generator.getDomainname();

    var passphraseId = BASE_NAME + 'passphrase-' + pwId;
    pwElementLabel.innerText = chrome.i18n.getMessage("passphraseLabel");
    pwElementLabel.htmlFor = passphraseId;
    pwElement.id = passphraseId;
    pwElement.className = 'passphrase';
    pwElement.type = 'password';
    pwElement.value = '';
    pwElement.placeholder = chrome.i18n.getMessage("passphrasePlaceholder");

    passDiv.className = 'pass-container';
    passDiv.appendChild(pwElementLabel);
    passDiv.appendChild(pwElement);

    serviceDiv.className = 'service-container';
    serviceDiv.appendChild(serviceElementLabel);
    serviceDiv.appendChild(serviceElement);

    submitButton.id = BASE_NAME + 'generate-' + pwId;
    submitButton.className = 'generate';
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
    showPasswordContainer.className = "show-pw-container";
    showPasswordContainer.title = chrome.i18n.getMessage("showPasswordTitle");
    showPasswordContainer.appendChild(showPassword);
    showPasswordContainer.appendChild(showPasswordLabel);
    passDiv.appendChild(showPasswordContainer);

    extendDiv.id = BASE_NAME + 'extend-' + pwId;
    extendDiv.className = 'extend';
    extendDiv.title = chrome.i18n.getMessage("extendSettings");
    extendImg.src = this._arrowDownImgUrl;
    extendDiv.appendChild(extendImg);

    generateDiv.className = 'button-container';
    generateDiv.appendChild(submitButton);

    overlayDiv.id = BASE_NAME + 'generator-overlay-' + pwId;
    overlayDiv.className = 'generator-overlay';

    dialogDiv.className = 'generator-dialog';
    dialogDiv.appendChild(serviceDiv);
    dialogDiv.appendChild(passDiv);
    dialogDiv.appendChild(generateDiv);

    settingsDiv.className = 'overlay-settings';
    settingsDiv.id = BASE_NAME + 'overlay-settings' + pwId;
    settingsDiv.style.display = 'none';
    settingsDiv.innerHTML = '<div class="sub">' +
        '   <div class="length">' +
        '       <label for="vlength" id="length-label">' + chrome.i18n.getMessage("lengthLabel") + '</label>' +
        '       <input maxlength="4" type="text" min="0" class="text" name="vlength" id="vlength" value="20" autocomplete="on">' +
        '   </div>' +
        '   <div class="repeat">' +
        '       <label for="repeat" id="repeat-label">' + chrome.i18n.getMessage("repeatLabel") + '</label>' +
        '       <input maxlength="2" type="text" class="text" name="repeat" id="repeat" value="" autocomplete="on">' +
        '   </div>' +
        '   <div class="save">' +
        '       <input maxlength="2" type="checkbox" class="text" name="save" id="save" value="" autocomplete="on">' +
        '       <label for="save" id="repeat-label">' + chrome.i18n.getMessage("saveLabel") + '</label>' +
        '   </div>' +
        '</div>' +
        '<div class="field">' +
        '   <table>' +
        '     <thead>' +
        '       <tr>' +
        '           <td></td>' +
        '           <th scope="col">a&ndash;z</th>' +
        '           <th scope="col">A&ndash;Z</th>' +
        '           <th scope="col">0&ndash;9</th>' +
        '           <th scope="col">- / _</th>' +
        '           <th scope="col" id="space-head">SPACE</th>' +
        '           <th scope="col" id="symbol-description">!@#$%</th>' +
        '       </tr>' +
        '     </thead>' +
        '     <tbody>' +
        '       <tr>' +
        '           <th scope="row">' +
        '               <label for="required" id="required-label">' + chrome.i18n.getMessage("requiredLabel") + '</label>' +
        '               (<input maxlength="1" type="text" class="text" name="required" id="required" value="2" autocomplete="off">)' +
        '           </th>' +
        '           <td><input type="radio" name="lower" value="required"></td>' +
        '           <td><input type="radio" name="upper" value="required"></td>' +
        '           <td><input type="radio" name="number" value="required"></td>' +
        '           <td><input type="radio" name="dash" value="required"></td>' +
        '           <td><input type="radio" name="space" value="required"></td>' +
        '           <td><input type="radio" name="symbol" value="required"></td>' +
        '       </tr>' +
        '       <tr>' +
        '           <th scope="row" id="allowed-label">Allowed</th>' +
        '           <td><input type="radio" name="lower" value="allowed" checked="checked"></td>' +
        '           <td><input type="radio" name="upper" value="allowed" checked="checked"></td>' +
        '           <td><input type="radio" name="number" value="allowed" checked="checked"></td>' +
        '           <td><input type="radio" name="dash" value="allowed" checked="checked"></td>' +
        '           <td><input type="radio" name="space" value="allowed" checked="checked"></td>' +
        '           <td><input type="radio" name="symbol" value="allowed" checked="checked"></td>' +
        '       </tr>' +
        '       <tr>' +
        '           <th scope="row" id="forbidden-label">Forbidden</th>' +
        '           <td><input type="radio" name="lower" value="forbidden"></td>' +
        '           <td><input type="radio" name="upper" value="forbidden"></td>' +
        '           <td><input type="radio" name="number" value="forbidden"></td>' +
        '           <td><input type="radio" name="dash" value="forbidden"></td>' +
        '           <td><input type="radio" name="space" value="forbidden"></td>' +
        '           <td><input type="radio" name="symbol" value="forbidden"></td>' +
        '       </tr>' +
        '     </tbody>' +
        '   </table>' +
        '</div>';

    overlayDiv.appendChild(closeDiv);
    overlayDiv.appendChild(dialogDiv);
    overlayDiv.appendChild(extendDiv);
    overlayDiv.appendChild(settingsDiv);

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

    on($(BASE_NAME + 'close-' + pwFieldId), 'click', function () {
        that.close();
    });

    on($(BASE_NAME + 'extend-' + pwFieldId), 'click', function () {
        var extension = $(BASE_NAME + 'overlay-settings' + pwFieldId);

        if (extension.style.display === 'none') {
            // @todo build a getter for passwordRules
            var vaultSettings = Helper.mergeObject(
                that._generator._vaultSettings,
                that._generator._domainService.getPasswordRules()
            );

            extension.style.display = 'table';
            this.firstChild.src = that._arrowUpImgUrl;
            that._settingsOverwrite = true;
            Helper.setTypeSettings(vaultSettings);
            that._setOverwriteSettings(vaultSettings);
        } else {
            extension.style.display = 'none';
            this.firstChild.src = that._arrowDownImgUrl;
        }
    });

    this._setServicename();
};

Overlay.activate = function () {
    var passphrase = this._getPassphraseField(),
        servicename = this._getServicenameField().value;

    this.toggle(true);

    passphrase.focus();

    this._isClosed = false;

    if (!servicename || this._generator.getDomainname() === servicename) {
        this._setServicename();
    }
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
        }

        // make sure the overlay does not pop up again after closing
        setTimeout(function () {
            that._isClosed = false;
        }, 300);
    });

    // make sure the overlay will be loaded even if the password field is already active
    if (true === this._isClosed && passwordField === document.activeElement) {
        this.activate();
    }

    this._id = BASE_NAME + 'generator-overlay-' + pwFieldId;
    this._create(this._passwordField.getField(), pwFieldId);

    return this;
};