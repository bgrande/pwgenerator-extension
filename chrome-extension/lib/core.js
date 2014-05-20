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
            'zooplus.de': {
                length: 20,
                symbols: '!"#$%&\'()*+,./:;<=>?@[\\]^{}~'
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
 * @param {Array} idArray
 */
Helper.fixDuplicateIds = function (idArray) {
    var i, j, n = idArray.length;

    for (i = 0; i < n; i++) {
        for (j = i + 1; j < n; j++) {
            if (idArray[i].id === idArray[j].id) {
                idArray[j].id = 'passid1';
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
    return pwField && pwField.id && pwField.id.match(/^vault-passphrase-/);
};

/**
 * check if given pwField already has an overlay
 *
 * @param {Object} pwField
 *
 * @returns {Boolean}
 */
Helper.hasOverlay = function (pwField) {
    return pwField && pwField.id && $('vault-generator-overlay-' + pwField.id);
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