'use strict';

var BASE_NAME = 'eph-overlay-';

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
    var pwString, i, l, testForDoubleId;

    // always check for duplicate ids for different types if the id was set
    if (pwField.id) {
        testForDoubleId = document.querySelectorAll('[id="' + pwField.id + '"]');
    }

    // if we have the same id for different types of tags use the input fields
    // it might not be any input field, though. Well then sth. went really wrong
    if (testForDoubleId && testForDoubleId.length > 1) {
        for (i = 0, l = testForDoubleId.length; i < l; i++) {
            // overwrite pwField node if we found an input field
            // overwrite the id to null as well to set it again
            if (testForDoubleId.hasOwnProperty(i) && testForDoubleId[i].tagName === 'INPUT') {
                pwField = testForDoubleId[i];
                pwField.id = null;
            }
        }
    }

    if (pwField.id) {
        this._id = pwField.id;
    } else {
        this._id = pwField.id = this._generateId();
    }

    return this;
};

var LoginField = {
    _id: ''
};

LoginField.init = function (userFieldList) {
    var login = Helper.getElementFromList(userFieldList);

    if (login && login.id) {
        this._id = login.id;
    } else if (login && login.name) {
        this._id = login.name;
        login.id = login.name;
    }

    return this;
};

LoginField.getField = function () {
    if (this._id) {
        return $(this._id);
    }

    return $('');
};
