var DEFAULT_SETTINGS = {
        length: 20,
        repeat: 0,
        lower: null,
        upper: null,
        number: null,
        dash: null,
        space: 0,
        symbol: 0,
        prefix: false,
        suffix: false,

        autosend: false,
        servicename: 'prefix',
        defServicename: 'myPrefix@',

        pwFieldList: [
            'pass', 'pass1', 'pass2', 'Pass', 'passwd', 'Passwd', 'password', 'Password', 'PASSWORD',
            'pw', 'PW', 'passwort', 'Passwort', 'ap_password', 'login_password', 'user_password',
            'user_pass', 'pwd', 'rpass'
        ],
        userFieldList: [
            'mail', 'Mail', 'email', 'Email', 'EMail', 'e-mail', 'E-Mail', 'eMail', 'login', 'Login',
            'user', 'User', 'username', 'Username', 'ap_email', 'userid', 'Userid', 'userId', 'UserId',
            'login_email', 'user_login', 'signin-email', 'j_username', 'session[username_or_email]'
        ],
        ccTldList: [
            'com', 'co', 'ar', 'net', 'org', 'jp', 'se', 'ae', 'me', 'plc', 'ac', 'ltd', 'gov', 'kids', 'us'
        ],

        imgUrl: 'images/close.png'
    },
    TYPES = 'lower upper number dash space symbol'.split(' ');

var $ = function (selector) {
    'use strict';

    var element = document.getElementById(selector);

    if (!element) {
        element = document.getElementsByName(selector)[0];
    }

    return element;
};

var on = function (element, event, listener) {
    'use strict';
    
    if (!element) {
        return;
    }

    if ('string' === typeof event) {
        event = [event];
    }

    for (var i = 0; i < event.length; i++) {
        if (element.addEventListener) {
            element.addEventListener(event[i], listener, false);
        } else {
            element.attachEvent('on' + event[i], listener);
        }
    }
};

var getElementFromList = function (list) {
    'use strict';

    var i, element;

    for (i = 0; i < list.length; i++) {
        element = $(list[i]);

        if (element) {
            return element;
        }
    }

    return false;
};

var isCcTld = function (name) {
    var i;
    for (i = 0; i < DEFAULT_SETTINGS.ccTldList.length; i++) {
        if (name === DEFAULT_SETTINGS.ccTldList[i]) {
            return true;
        }
    }

    return false;
};

var isOverlay = function (pwField) {
    return pwField && pwField.id && pwField.id.match(/^vault-passphrase-/);
};

var hasOverlay = function (pwField) {
    return pwField && pwField.id && $('vault-generator-overlay-' + pwField.id);
};