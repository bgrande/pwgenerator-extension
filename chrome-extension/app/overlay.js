'use strict';

var Overlay = {
    _generator: null,
    _passwordField: null,
    _id: '',
    _isOpened: false,
    _closeImgUrl: '',
    _arrowUpImgUrl: '',
    _arrowDownImgUrl: '',
    _settingsOverwrite: false,
    _pwFieldListeners: {
        focus: function () {
            if (!this._isOpened) {
                this.activate();
            }

            // make sure the overlay does not pop up again after closing
            setTimeout(function () {
                this._isOpened = true;
            }.bind(this), 300);
        },
        click: function (e) {
            Helper.cancelEventPropagation(e);
        }
    }
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
    var length = parseInt($(BASE_NAME + 'vlength').value, 10),
        repeat = parseInt($(BASE_NAME + 'repeat').value, 10),
        required = parseInt($(BASE_NAME + 'required').value, 10),
        save = $(BASE_NAME + 'save').checked,
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
        // @todo we need an overview (located in options) with all exceptions and corresponding (cr)ud
    }

    return serviceRules;
};

Overlay._setOverwriteSettings = function (settings) {
    if (settings.hasOwnProperty('length') && settings.length) {
        $(BASE_NAME + 'vlength').value = settings.length;
    }

    if (settings.hasOwnProperty('repeat') && settings.repeat) {
        $(BASE_NAME + 'repeat').value = settings.repeat;
    }

    if (settings.hasOwnProperty('requiredLength') && settings.requiredLength) {
        $(BASE_NAME + 'required').value = settings.requiredLength;
    }
};

Overlay._buttonSubmit = function (pwField) {
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
        loginFormNumber = Helper.getLoginForm(pwField);
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
    closeDiv.className = BASE_NAME + 'close';
    closeDiv.title = chrome.i18n.getMessage("close");
    closeDiv.appendChild(closeImg);

    var serviceId = BASE_NAME + 'servicename-' + pwId;
    serviceElementLabel.innerText = chrome.i18n.getMessage("serviceNameLabel");
    serviceElementLabel.htmlFor = serviceId;
    serviceElement.id = serviceId;
    serviceElement.className = BASE_NAME + 'servicename';
    serviceElement.type = 'text';
    serviceElement.placeholder = this._generator.getDomainname();

    var passphraseId = BASE_NAME + 'passphrase-' + pwId;
    pwElementLabel.innerText = chrome.i18n.getMessage("passphraseLabel");
    pwElementLabel.htmlFor = passphraseId;
    pwElement.id = passphraseId;
    pwElement.className = BASE_NAME + 'passphrase';
    pwElement.type = 'password';
    pwElement.value = '';
    pwElement.placeholder = chrome.i18n.getMessage("passphrasePlaceholder");

    passDiv.className = BASE_NAME + 'pass-container';
    passDiv.appendChild(pwElementLabel);
    passDiv.appendChild(pwElement);

    serviceDiv.className = BASE_NAME + 'service-container';
    serviceDiv.appendChild(serviceElementLabel);
    serviceDiv.appendChild(serviceElement);

    submitButton.id = BASE_NAME + 'generate-' + pwId;
    submitButton.className = BASE_NAME + 'generate';
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
    showPasswordLabel.className = BASE_NAME + 'description-label';
    showPasswordContainer.className = BASE_NAME + "show-pw-container";
    showPasswordContainer.title = chrome.i18n.getMessage("showPasswordTitle");
    showPasswordContainer.appendChild(showPassword);
    showPasswordContainer.appendChild(showPasswordLabel);
    passDiv.appendChild(showPasswordContainer);

    extendDiv.id = BASE_NAME + 'extend-' + pwId;
    extendDiv.className = BASE_NAME + 'extend';
    extendDiv.title = chrome.i18n.getMessage("extendSettings");
    extendImg.src = this._arrowDownImgUrl;
    extendDiv.appendChild(extendImg);

    generateDiv.className = BASE_NAME + 'button-container';
    generateDiv.appendChild(submitButton);

    overlayDiv.id = BASE_NAME + 'generator-overlay-' + pwId;
    overlayDiv.className = BASE_NAME + 'generator-overlay';

    dialogDiv.className = BASE_NAME + 'generator-dialog';
    dialogDiv.appendChild(serviceDiv);
    dialogDiv.appendChild(passDiv);
    dialogDiv.appendChild(generateDiv);

    settingsDiv.className = BASE_NAME + 'overlay-settings';
    settingsDiv.id = BASE_NAME + 'overlay-settings' + pwId;
    settingsDiv.style.display = 'none';
    settingsDiv.innerHTML = '<div class="' + BASE_NAME + 'sub">' +
        '   <div class="' + BASE_NAME + 'length">' +
        '       <label for="' + BASE_NAME + 'vlength" id="' + BASE_NAME + 'length-label">' + chrome.i18n.getMessage("lengthLabel") + '</label>' +
        '       <input maxlength="4" type="text" min="0" class="' + BASE_NAME + 'text" name="vlength" id="' + BASE_NAME + 'vlength" value="20" autocomplete="on">' +
        '   </div>' +
        '   <div class="' + BASE_NAME + 'repeat">' +
        '       <label for="' + BASE_NAME + 'repeat" id="' + BASE_NAME + 'repeat-label">' + chrome.i18n.getMessage("repeatLabel") + '</label>' +
        '       <input maxlength="2" type="text" class="' + BASE_NAME + 'text" name="repeat" id="' + BASE_NAME + 'repeat" value="" autocomplete="on">' +
        '   </div>' +
        '   <div class="' + BASE_NAME + 'savebox">' +
        '       <input maxlength="2" type="checkbox" class="' + BASE_NAME + 'text" name="save" id="' + BASE_NAME + 'save" value="" autocomplete="on">' +
        '       <label for="' + BASE_NAME + 'save" id="' + BASE_NAME + 'save-label">' + chrome.i18n.getMessage("saveLabel") + '</label>' +
        '   </div>' +
        '</div>' +
        '<div class="' + BASE_NAME + 'field">' +
        '   <table>' +
        '     <thead>' +
        '       <tr>' +
        '           <td></td>' +
        '           <th scope="col">a&ndash;z</th>' +
        '           <th scope="col">A&ndash;Z</th>' +
        '           <th scope="col">0&ndash;9</th>' +
        '           <th scope="col">- / _</th>' +
        '           <th scope="col" id="' + BASE_NAME + 'space-head">SPACE</th>' +
        '           <th scope="col" id="' + BASE_NAME + 'symbol-description">!@#$%</th>' +
        '       </tr>' +
        '     </thead>' +
        '     <tbody>' +
        '       <tr>' +
        '           <th scope="row" class="' + BASE_NAME + 'requiredbox">' +
        '               <label for="' + BASE_NAME + 'required" id="' + BASE_NAME + 'required-label">' + chrome.i18n.getMessage("requiredLabel") + '</label>' +
        '               (<input maxlength="1" type="text" class="' + BASE_NAME + 'text" name="required" id="' + BASE_NAME + 'required" value="2" autocomplete="off">)' +
        '           </th>' +
        '           <td><input type="radio" name="lower" value="required"></td>' +
        '           <td><input type="radio" name="upper" value="required"></td>' +
        '           <td><input type="radio" name="number" value="required"></td>' +
        '           <td><input type="radio" name="dash" value="required"></td>' +
        '           <td><input type="radio" name="space" value="required"></td>' +
        '           <td><input type="radio" name="symbol" value="required"></td>' +
        '       </tr>' +
        '       <tr>' +
        '           <th scope="row" id="' + BASE_NAME + 'allowed-label">' + chrome.i18n.getMessage("allowedLabel") + '</th>' +
        '           <td><input type="radio" name="lower" value="allowed" checked="checked"></td>' +
        '           <td><input type="radio" name="upper" value="allowed" checked="checked"></td>' +
        '           <td><input type="radio" name="number" value="allowed" checked="checked"></td>' +
        '           <td><input type="radio" name="dash" value="allowed" checked="checked"></td>' +
        '           <td><input type="radio" name="space" value="allowed" checked="checked"></td>' +
        '           <td><input type="radio" name="symbol" value="allowed" checked="checked"></td>' +
        '       </tr>' +
        '       <tr>' +
        '           <th scope="row" id="' + BASE_NAME + 'forbidden-label">' + chrome.i18n.getMessage("forbiddenLabel") + '</th>' +
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
    let servicename = this._getServicenameField(),
        result;

    if (servicename) {
        result = this._generator.getServicename();
    }

    if (result) {
        servicename.value = result;
    }
};

Overlay._create = function (pwField, pwFieldId) {
    var that = this;

    this._createDiv(pwField, pwFieldId);

    on($(BASE_NAME + 'generate-' + pwFieldId), 'click', function () {
        that._buttonSubmit(pwField);
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
                that._buttonSubmit(pwField);
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
    on(pwField, ['click', 'keyup', 'keypress', 'change'], this._pwFieldListeners['click']);

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
        var extension = $(BASE_NAME + 'settings' + pwFieldId);

        if (extension.style.display === 'none') {
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
        servicename = this._getServicenameField(),
        servicenameValue = (servicename) ? servicename.value : null;

    this.toggle(true);

    if (passphrase) {
        passphrase.focus();
    }

    this._isOpened = true;

    if (!servicenameValue || this._generator.getDomainname() === servicenameValue) {
        this._setServicename();
    }
};

Overlay.close = function () {
    this.toggle(false);

    // make sure the overlay does not pop up again after closing
    setTimeout(function () {
        this._isOpened = false;
    }.bind(this), 300);

    this._passwordField.getField().focus();
};

Overlay.detach = function () {
    this.close();

    /*
     * @todo listener event detaching should be part of the pwField Object
     * @todo doesn't seem to work with multiple password fields per page (only last element really seems to be detached)
     */
    this._passwordField.getField().removeEventListener('focus', this._pwFieldListeners['focus'], true);
    this._passwordField.getField().removeEventListener('click', this._pwFieldListeners['click'], true);
    this._passwordField.getField().removeEventListener('keyup', this._pwFieldListeners['click'], true);
    this._passwordField.getField().removeEventListener('keypress', this._pwFieldListeners['click'], true);
    this._passwordField.getField().removeEventListener('change', this._pwFieldListeners['click'], true);

    $(this._id).remove();
};

Overlay.toggle = function (status) {
    var display = 'none';

    if (status) {
        display = 'block';
    }

    if ($(this._id)) {
        $(this._id).style.display = display;
    }
};

Overlay.init = function (settings, passwordField, loginField, generator) {
    this._passwordField = passwordField;
    this._loginField = loginField;
    this._generator = generator;
    this._setImgUrls(settings);

    var pwFieldId = this._getPasswordFieldId();

    // @todo listener object should be part of the pwField Object
    on(this._passwordField.getField(), 'focus', this._pwFieldListeners['focus'].bind(this));

    // make sure the overlay will be loaded even if the password field is already active
    if (false === this._isOpened && passwordField === document.activeElement) {
        this.activate();
    }

    this._id = BASE_NAME + 'generator-overlay-' + pwFieldId;
    this._create(this._passwordField.getField(), pwFieldId);

    return this;
};
