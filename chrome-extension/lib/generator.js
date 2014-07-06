'use strict';

var Generator = {
    generatorSettings: {},
    _vaultSettings: {},
    _domainService: null
};

Generator.generatePassword = function (phraseValue, saltValue) {
    var pwValue,
        vaultSettings,
        pwRules;

    try {
        if (saltValue && phraseValue) {
            pwRules = this._domainService.getPasswordRules();

            if (this.generatorSettings.isVaultCompatible && pwRules && pwRules.hasOwnProperty('symbols')) {
                pwRules['symbols'] = null;
                pwRules['symbol'] = 0;
            }

            vaultSettings = Helper.mergeObject(this._vaultSettings, pwRules);
            vaultSettings.phrase = phraseValue;
            pwValue = new Vault(vaultSettings).generate(saltValue);
        } else {
            pwValue = '';
        }

        return pwValue;
    } catch (e) {
        return '!! ' + e.message;
    }
};

Generator.getDomainname = function () {
    return this._domainService.getDomainname();
};

Generator.getServicename = function (servicename, loginField) {
    var domainname = this.getDomainname();

    if (servicename && domainname !== servicename) {
        return false;
    }

    switch (this.generatorSettings.servicename) {
        case 'login':
            if (loginField === undefined) {
               // do nothing
            } else if (loginField.value) {
                return loginField.value;
            } else if (loginField.textContent && loginField.textContent.length <= 30) {
                return loginField.textContent;
            }

            return domainname;

            break;

        case 'prefix':
            if (this.generatorSettings.defServicename) {
                return this.generatorSettings.defServicename + domainname;
            }
            break;

        case 'suffix':
            if (this.generatorSettings.defServicename) {
                return domainname + this.generatorSettings.defServicename;
            }
            break;
    }

    return false;
};

Generator._setVaultSettings = function (settings) {
    var vaultSettings = {}, i, n;
    // @TODO change plength to length (needs option migration)
    vaultSettings.length = undefined !== settings.plength ? settings.plength : settings.length;
    vaultSettings.repeat = settings.repeat;
    vaultSettings.iteration = settings.iteration;

    for (i = 0, n = TYPES.length; i < n; i++) {
        vaultSettings[TYPES[i]] = settings[TYPES[i]];
    }

    this._vaultSettings = vaultSettings;
};

Generator._setGeneratorSettings = function (settings) {
    var generatorSettings = {};

    generatorSettings.autosend = settings.autosend;
    generatorSettings.servicename = settings.servicename;
    generatorSettings.defServicename = settings.defServicename;
    generatorSettings.isVaultCompatible = settings.isVaultCompatible;

    this.generatorSettings = generatorSettings;
};

Generator._initSettings = function (settings) {
    this._setVaultSettings(settings);
    this._setGeneratorSettings(settings);
};

Generator.init = function (settings, domainService) {
    if (!domainService || !settings) {
        return false;
    }

    this._domainService = domainService;
    this._initSettings(settings);

    return this;
};