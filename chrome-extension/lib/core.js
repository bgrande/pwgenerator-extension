'use strict';

var DEFAULT_SETTINGS = {
        length: 20,
        repeat: 0,
        iteration: 8,
        lower: null,
        upper: null,
        number: null,
        dash: null,
        space: null,
        symbol: null,
        isVaultCompatible: true,

        autosend: false,
        servicename: 'prefix',
        defServicename: '',

        pwFieldList: [
            'pass', 'pass1', 'pass2', 'Pass', 'passwd', 'Passwd', 'password', 'Password', 'PASSWORD',
            'pw', 'PW', 'passwort', 'Passwort', 'ap_password', 'login_password', 'user_password',
            'user_pass', 'pwd', 'rpass', 'mypassword', 'myPassword', 'myregpassword'
        ],
        userFieldList: [
            'mail', 'Mail', 'email', 'Email', 'EMail', 'e-mail', 'E-Mail', 'eMail', 'login', 'Login',
            'user', 'User', 'username', 'Username', 'ap_email', 'userid', 'Userid', 'userId', 'UserId',
            'login_email', 'user_login', 'signin-email', 'j_username', 'session[username_or_email]'
        ],
        ccTldList: [
            'com', 'co', 'ar', 'net', 'org', 'jp', 'se', 'ae', 'me', 'plc', 'ac', 'ltd', 'gov', 'kids', 'us'
        ],

        serviceExceptions: {
            'alternate.de': {
                length: 15
            },
            'o2online.de': {
                space: 0,
                dash: 0,
                symbol: 0
            },
            'o2.co.uk': {
                space: 0,
                dash: 0,
                symbol: 0
            },
            'o2online.ie': {
                space: 0,
                dash: 0,
                symbol: 0
            },
            'o2.cz': {
                space: 0,
                dash: 0,
                symbol: 0
            },
            'o2.sk': {
                space: 0,
                dash: 0,
                symbol: 0
            },
            'npmjs.org': {
                symbol: 0
            },
            'hosteurope.de': {
                length: 16,
                symbols: '!%&/()=*+#.,:;'
            },
            'wordpress.com': {
                symbols: '!%&()=*+#.,:;'
            },
            'zooplus.de': {
                length: 20,
                symbols: '!#$%&\'()*+,./=?[\\]^{}~'
            },
            'nodejitsu.com': {
                space: 0,
                dash: 0,
                symbol: 0
            },
            'check24.de': {
                length: 15
            },
            'kabeldeutschland.de': {
                space: 0
            },
            'paket.de': {
                length: 13,
                space: 0,
                symbols: '!&/()=?*+'
            }
        },

        imgUrl: 'images/close.png'
    },
    TYPES = 'lower upper number dash space symbol'.split(' ');

var $ = function (selector) {
    var element = document.getElementById(selector);

    if (!element) {
        element = document.getElementsByName(selector)[0];
    }

    return element;
};

var on = function (element, event, listener) {
    if (!element) {
        return;
    }

    if ('string' === typeof event) {
        event = [event];
    }

    for (var i = 0, n = event.length; i < n; i++) {
        if (element.addEventListener) {
            element.addEventListener(event[i], listener, true);
        } else {
            element.attachEvent('on' + event[i], listener);
        }
    }
};

/**
 * handles specific domain extensions
 */
var DomainService = {
    _domainName: '',
    _rules: null,
    _setPasswordRules: null,
    _setDomainname: null,
    getPasswordRules: null,
    getDomainname: null

};

DomainService._setDomainname = function (domain) {
    var domainname = domain || document.domain,
        domainparts = domainname.split('.');

    if (2 < domainparts.length) {
        domainname = domainparts[domainparts.length - 2] + '.' + domainparts[domainparts.length - 1];

        if (Helper.isCcTld(domainparts[domainparts.length - 2])) {
            domainname = domainparts[domainparts.length - 3] + '.' + domainname;
        }
    }

    this._domainName = domainname;
};

DomainService._setPasswordRules = function (settings) {
    if (settings && settings[this._domainName]) {
        this._rules = settings[this._domainName];
    }
};

DomainService.getDomainname = function () {
    return this._domainName;
};

DomainService.getPasswordRules = function () {
    return this._rules;
};

DomainService.init = function (ruleSettings, domain) {
    this._setDomainname(domain);
    this._setPasswordRules(ruleSettings);

    return this;
};

/**
 * commonly used logic
 */
var Helper = {};

/**
 *
 * @param {Array} list
 *
 * @returns {*}
 */
Helper.getElementFromList = function (list) {
    var i, n, element;

    for (i = 0, n = list.length; i < n; i++) {
        element = $(list[i]);

        if (element) {
            return element;
        }
    }

    return null;
};

/**
 * checks if the given name is in the cctld list
 *
 * @param {String} name
 *
 * @returns {boolean}
 */
Helper.isCcTld = function (name) {
    var i, n;

    for (i = 0, n = DEFAULT_SETTINGS.ccTldList.length; i < n; i++) {
        if (name === DEFAULT_SETTINGS.ccTldList[i]) {
            return true;
        }
    }

    return false;
};

/**
 * fix problem if a password field id does exist more than once on a page
 *
 * @param {NodeList} nodeList
 */
Helper.fixDuplicateIds = function (nodeList) {
    var i, j, n = nodeList.length;

    for (i = 0; i < n; i++) {
        for (j = i + 1; j < n; j++) {
            if (nodeList[i].id === nodeList[j].id) {
                nodeList[j].id = 'passid1';
            }
        }
    }
};

/**
 * check if given pwField is part of an overlay
 *
 * @param {Object} pwField
 *
 * @returns {Boolean}
 */
Helper.isOverlay = function (pwField) {
    // @todo this is easy password handler only
    return pwField && pwField.id && pwField.id.match(/^easy-password-passphrase/);
};

/**
 * check if given pwField already has an overlay
 *
 * @param {Object} pwField
 *
 * @returns {Boolean}
 */
Helper.hasOverlay = function (pwField) {
    // @todo this is easy password handler only
    return pwField && pwField.id && $(BASE_NAME + 'generator-overlay-' + pwField.id);
};

/**
 * cancel event bubbling and capturing
 *
 * @param {Object} event
 */
Helper.cancelEventPropagation = function (event) {
    if (event.stopImmediatePropagation) {
        // as long it is the first registered event: even captured events are stopped
        event.stopImmediatePropagation();
    }

    if (event.cancelBubble != null) {
        event.cancelBubble = true;
    }
};

/**
 * merges second object into first
 *
 * @param {Object} first
 * @param {Object} second
 *
 * @returns {Object}
 */
Helper.mergeObject = function (first, second) {
    var attrName;

    if (first && second) {
        for (attrName in second) {
            if (second.hasOwnProperty(attrName)) {
                first[attrName] = second[attrName];
            }
        }
    }

    return first;
};

/**
 * gets the current password field's login form
 *
 * @param {Object} pwField
 *
 * @returns {Number|Boolean}
 */
Helper.getLoginForm = function (pwField) {
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

/**
 * generates a random servicename
 *
 * @returns {string}
 */
Helper.getRandomServicename = function () {
    return Math.random().toString(36).substring(7) + '@';
};
