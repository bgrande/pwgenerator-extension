'use strict';

var Generator = {
    _saltGenerator: null,
    _vaultSettings: {},
    _domainService: null
};

Generator.generatePassword = function (phraseValue, saltValue, overwriteSettings) {
    var pwValue,
        vaultSettings,
        pwRules;

    try {
        if (saltValue && phraseValue) {
            pwRules = this._domainService.getPasswordRules();

            if (overwriteSettings) {
                pwRules = Helper.mergeObject(pwRules || {}, overwriteSettings);
            }

            if (this.generatorSettings.isVaultCompatible && pwRules && pwRules.hasOwnProperty('symbols')) {
                pwRules['symbols'] = null;
                pwRules['symbol'] = 0;
            }

            if (this.generatorSettings.isVaultCompatible && pwRules) {
                pwRules['iteration'] = 8;
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

Generator.getServicename = function () {
    return this._saltGenerator.getServicename();
};

Generator._setVaultSettings = function (settings) {
    let vaultSettings = {}, i, n;

    vaultSettings.length = settings.length;
    vaultSettings.repeat = settings.repeat;
    vaultSettings.iteration = settings.iteration;
    vaultSettings.requiredLength = settings.requiredLength;

    for (i = 0, n = TYPES.length; i < n; i++) {
        vaultSettings[TYPES[i]] = settings[TYPES[i]];
    }

    this._vaultSettings = vaultSettings;
};

Generator.init = function (settings, domainService, saltGenerator) {
    if (!domainService || !settings || !saltGenerator) {
        return false;
    }

    this._domainService = domainService;
    this._saltGenerator = saltGenerator;
    this._setVaultSettings(settings);

    return this;
};
