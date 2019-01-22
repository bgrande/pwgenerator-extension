'use strict';

var SaltGenerator = {
    _generatorSettings: {},
    _loginField: null,
    _domainService: null
};


SaltGenerator.getDomainname = function () {
    return this._domainService.getDomainname();
};

SaltGenerator.getServicename = function () {
    let domainname = this.getDomainname();

    switch (this._generatorSettings.servicename) {
        case 'login':
            if (this._loginField === undefined) {
               // do nothing
            } else if (this._loginField.value) {
                return this._loginField.value;
            } else if (this._loginField.textContent && this._loginField.textContent.length <= 30) {
                return this._loginField.textContent;
            }

            return domainname;
            break;

        case 'prefix':
            if (this._generatorSettings.defServicename) {
                return this._generatorSettings.defServicename + domainname;
            }
            break;

        case 'suffix':
            if (this._generatorSettings.defServicename) {
                return domainname + this._generatorSettings.defServicename;
            }
            break;
    }

    return false;
};

SaltGenerator._setGeneratorSettings = function (settings) {
    let generatorSettings = {};

    generatorSettings.autosend = settings.autosend;
    generatorSettings.servicename = settings.servicename;
    generatorSettings.defServicename = settings.defServicename;
    generatorSettings.isVaultCompatible = settings.isVaultCompatible;

    this._generatorSettings = generatorSettings;
};

SaltGenerator.init = function (settings, domainService, loginField) {
    if (!domainService || !settings || !loginField) {
        return false;
    }

    this._domainService = domainService;
    this._loginField = loginField;
    this._setGeneratorSettings(settings);

    return this;
};
