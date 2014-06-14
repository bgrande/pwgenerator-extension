'use strict';

var Generator = {
    generatorSettings: {},
    _vaultSettings: {},
    _passwordField: null,
    _domainService: null
};

Generator.generatePassword = function (phraseValue, saltValue) {
    var pwValue,
        vaultSettings;

    try {
        if (saltValue && phraseValue) {
            vaultSettings = Helper.mergeObject(this._vaultSettings, this._domainService.getPasswordRules());
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

    this.generatorSettings = generatorSettings;
};

Generator._initSettings = function (settings) {
    this._setVaultSettings(settings);
    this._setGeneratorSettings(settings);
};

Generator.init = function (settings, pwField, domainService) {
    if (!pwField) {
        return false;
    }

    this._domainService = domainService;
    this._passwordField = pwField;
    this._initSettings(settings);

    return this;
};