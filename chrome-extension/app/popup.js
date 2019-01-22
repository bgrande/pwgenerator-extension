'use strict';

const BASE_NAME_POPUP = 'eph-popup-';

let Popup = {
    _generator: null,
    _passwordField: null,
    _activeField: null,
    _loginField: null,
    _settings: null,
    _showPassword: false,
    _settingsOverwrite: false,
    _pwFieldListeners: {
        focus: function (e) {

        },
        click: function (e) {
            Helper.cancelEventPropagation(e);
        }
    }
};

Popup._getPasswordFieldId = function () {
    return this._passwordField.getFieldIdentifier();
};

Popup._getPassphraseField = function () {
    return $(BASE_NAME_POPUP + 'passphrase');
};

Popup._getServicenameField = function () {
    return $(BASE_NAME_POPUP + 'servicename');
};

Popup._listenExtend = function _listenExtend() {
    let that = this;
    on($(BASE_NAME_POPUP + 'extend'), 'click', function () {
        let extension = $(BASE_NAME_POPUP + 'overlay-settings');

        if (extension.style.display === 'none') {
            let vaultSettings = Helper.mergeObject(
                that._generator._vaultSettings,
                that._generator._domainService.getPasswordRules()
            );

            extension.style.display = 'table';
            //this.firstChild.src = that._arrowUpImgUrl;
            that._settingsOverwrite = true;
            Helper.setTypeSettings(vaultSettings);
            that._setOverwriteSettings(vaultSettings);
        } else {
            extension.style.display = 'none';
            //this.firstChild.src = that._arrowDownImgUrl;
        }
    });
};

Popup._setOverwriteSettings = function _setOverwriteSettings(settings) {
    if (settings.hasOwnProperty('length') && settings.length) {
        $(BASE_NAME_POPUP + 'vlength').value = settings.length;
    }

    if (settings.hasOwnProperty('repeat') && settings.repeat) {
        $(BASE_NAME_POPUP + 'repeat').value = settings.repeat;
    }

    if (settings.hasOwnProperty('requiredLength') && settings.requiredLength) {
        $(BASE_NAME_POPUP + 'required').value = settings.requiredLength;
    }
};

Popup._getOverwriteSettings = function _getOverwriteSettings() {
    // @todo this is a duplicate and has to be a separate object handling the settings overwrite
    let length = parseInt($(BASE_NAME + 'vlength').value, 10),
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
        let serviceExceptions = {};

        serviceExceptions[this._generator.getDomainname()] = serviceRules;
        chrome.runtime.sendMessage({event: 'saveOverwrite', settings: serviceExceptions});
        // @todo we might want to ask the user to contribute the new settings
        // @todo we need an overview (located in options) with all exceptions and corresponding (cr)ud
    }

    return serviceRules;
};

Popup._submit = function _submit() {
    let passPhrase = this._getPassphraseField(),
        serviceSalt = this._getServicenameField(),
        newPassword,
        overwriteSettings;

    if (this._settingsOverwrite) {
        overwriteSettings = this._getOverwriteSettings();
    }

    newPassword = this._generator.generatePassword(passPhrase.value, serviceSalt.value, overwriteSettings);

    passPhrase.value = '';
    return newPassword;
};

Popup.generate = function generate () {
    let newPassword = this._submit(),
        pwField = this._passwordField;

    let type = (this._showPassword) ? 'text' : 'password',
        autoSubmit = this._generator.getSettings().autosend && !this._showPassword;

    pwField.type = type;
    pwField.value = newPassword;

    if (this._activeField) {
        let pwData = {
            fieldId: this._activeField,
            password: newPassword,
            type: type,
            autoSubmit: autoSubmit
        };

        // @todo test this
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            let activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {event: "updatePassword", data: pwData});
        });

        //chrome.runtime.sendMessage({event: 'updatePassword', data: pwData});
    }
};

Popup.setActiveField = function setActiveField(fieldId) {
    let field = {
        id: fieldId
    };
    this._activeField = fieldId;
    this._passwordField = Object.create(PasswordField).init(field);
    return this;
};

Popup.setServicename = function setServicename(serviceName) {
    this._getServicenameField().value = serviceName;
    return this;
};

Popup.init = function (settings, passwordField, loginField, generator) {
    this._passwordField = passwordField;
    this._loginField = loginField;
    this._generator = generator;
    this._settings = settings;

    let pwFieldId = this._getPasswordFieldId();

    this._showPassword = $(BASE_NAME_POPUP + 'show-password').checked;

    on(this._passwordField.getField(), 'focus', this._pwFieldListeners['focus'].bind(this));

    // @todo 1. hook onto current password field (via passwordField object)
    //       2. provide logic to generate on overlay 'generate' button click - either default password field in popup or autofill on password field on website

    return this;
};

var popup;

(function () {
    let closeWindow = function () {
        window.close();
    };

    $(BASE_NAME_POPUP + 'close-window-img').src = chrome.extension.getURL('images/close.png');

    on($('close-window'), 'click', function (e) {
        closeWindow();
    });

    chrome.storage.sync.get('settings', function (items) {
        let settings = (undefined !== items.settings) ? Helper.mergeObject(DEFAULT_SETTINGS, JSON.parse(items.settings)) : DEFAULT_SETTINGS;

        if (settings.useBrowserPopup == false) {
            $(BASE_NAME_POPUP + 'on-overlay').style.display = 'block';
            $(BASE_NAME_POPUP + 'generator-overlay').style.display = 'none';
            $(BASE_NAME_POPUP + 'browser-popup').classList = 'popup-without-overlay';

            on($(BASE_NAME_POPUP + 'reload-overlay'), 'click', function (e) {
                chrome.runtime.sendMessage({event: 'reload', tab: chrome.tabs.getSelected});
                closeWindow();
            });

            on($(BASE_NAME_POPUP + 'disable-overlay'), 'click', function (e) {
                chrome.runtime.sendMessage({event: 'disable', tab: chrome.tabs.getSelected});
                closeWindow();
            });

            let reloadTitle = chrome.i18n.getMessage("reloadTitle"),
                disableTitle = chrome.i18n.getMessage("disableTitle");

            $(BASE_NAME_POPUP + 'reload-title').innerText = reloadTitle;
            $(BASE_NAME_POPUP + 'disable-title').innerText = disableTitle;
        }

        if (settings.useBrowserPopup == true) {
//  @todo images via chrome.extension.getUrl('path/to/image')!? -> shouldn't it work via html?

            $(BASE_NAME_POPUP + 'on-overlay').style.display = 'none';
            $(BASE_NAME_POPUP + 'generator-overlay').style.display = 'block';
            $(BASE_NAME_POPUP + 'browser-popup').classList = 'popup-with-overlay';

            // @todo we need to get the currently active (if any: else dummy!) password field! via messages and content script which provides the current fields
            // this might just only work with the current result-pass password field and we have to send a message to update the password in contentscript
            let defaultPwField = $(BASE_NAME_POPUP + 'generator-result-pass');

            let domainService = Object.create(DomainService).init(settings.serviceExceptions),
                loginField = Object.create(LoginField).init(settings.userFieldList),
                passwordField = Object.create(PasswordField).init(defaultPwField),
                saltGenerator = Object.create(SaltGenerator).init(settings, domainService, loginField),
                generator = Object.create(Generator).init(settings, domainService, saltGenerator);

            popup = Object.create(Popup).init(settings, passwordField, loginField, generator);

            let closeButtonTitle = chrome.i18n.getMessage("close"),
                serviceNameLabel = chrome.i18n.getMessage("serviceNameLabel"),
                passphraseLabel = chrome.i18n.getMessage("passphraseLabel");

            setTimeout(function () {
                on($(BASE_NAME_POPUP + 'generate-pass'), 'click', function (e) {
                    popup.generate();
                });
            }, 100);

            /*
            $(BASE_NAME_POPUP + 'close-pass').setAttribute('title', closeButtonTitle);
            $(BASE_NAME_POPUP + 'close-icon').setAttribute('alt', closeButtonTitle);
            $(BASE_NAME_POPUP + 'service-label').innerText = serviceNameLabel;
            $(BASE_NAME_POPUP + 'servicename-pass').setAttribute('placeholder', generator.getDomainname());
            $(BASE_NAME_POPUP + 'passphrase-label').innerText = passphraseLabel;
            */
        }
    });
})();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.event) {
        switch (request.event) {
            case 'activePasswordField':
                let activePasswordField = request.fieldId ? request.fieldId : '';

                setTimeout(function () {
                    popup.setActiveField(activePasswordField).setServicename(request.serviceName);
                }, 150);

                break;

            default:
                sendResponse(null);
        }
    }
});



