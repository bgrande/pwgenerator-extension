var pwFieldList = [ 'pass', 'Pass', 'passwd', 'Passwd', 'password', 'Password', 'PASSWORD', 'pw', 'PW', 'passwort', 'Passwort', 'ap_password', 'login_password', 'user_password', 'user_pass', 'pwd', 'rpass' ],
    userFieldList = [ 'mail', 'Mail', 'email', 'Email', 'EMail', 'e-mail', 'E-Mail', 'eMail', 'login', 'Login', 'user', 'User', 'username', 'Username', 'ap_email', 'userid', 'Userid', 'userId', 'UserId', 'login_email', 'user_login', 'signin-email', 'j_username', 'session[username_or_email]' ],
    imgURL = chrome.extension.getURL("./images/close.png"),
    overlayClosed = false,
    settings;

var getElementFromList = function (list, callback) {
    'use strict';

    var i, element;

    for (i = 0; i < list.length; i++) {
        element = callback(list[i]);

        if (element) {
            return element;
        }
    }

    return false;
};

var toggleOverlay = function (overlay, status) {
    'use strict';

    var display = 'none';

    if (status) {
        display = 'block';
    }

    overlay.style.display = display;
};

var generatePassword = function(serviceValue, phraseValue, settings) {
    'use strict';

    var pwValue;

    try {
        if (serviceValue && phraseValue) {
            settings.phrase = phraseValue;
            pwValue = new Vault(settings).generate(serviceValue);
        } else {
            pwValue = '';
        }

        return pwValue;
    } catch (e) {
        return '!! ' + e.message;
    }
};

var getPasswordIdentifier = function (password) {
    'use strict';

    var pwString;

    if (password.id) {
        return password.id;
    }
    if (password.name) {
        pwString = password.name.replace(/\[|\]/g, '-').replace(/-+$/, '');
        if ($('vault-generator-overlay-' + pwString)) {
            pwString += '1';
        }

        return pwString;
    }

    return null;
};

var addOverlayDiv = function (imgUrl, password, settings) {
    'use strict';

    var overlayDiv = document.createElement('div'),
        dialogDiv = document.createElement('div'),
        serviceDiv = document.createElement('div'),
        passDiv = document.createElement('div'),
        closeDiv = document.createElement('div'),
        closeImg = document.createElement('img'),
        serviceElementLabel = document.createElement('label'),
        serviceElement = document.createElement('input'),
        pwElementLabel = document.createElement('label'),
        pwElement = document.createElement('input'),
        submitButton = document.createElement('input'),
        pwId = getPasswordIdentifier(password);

    closeImg.id = 'vault-close-icon-' + pwId;
    closeImg.className = 'vault-close-icon';
    closeImg.src = imgUrl;
    closeImg.alt = 'Close Overlay';

    closeDiv.id = 'vault-close-' + pwId;
    closeDiv.className = 'vault-close';
    closeDiv.title = 'Close Overlay';
    closeDiv.appendChild(closeImg);

    serviceElementLabel.innerText = 'Service name';
    serviceElement.id = 'vault-servicename-' + pwId;
    serviceElement.className = 'vault-servicename';
    serviceElement.type = 'text';
    serviceElement.placeholder = 'twitter';

    pwElementLabel.innerText = 'Passphrase';
    pwElement.id = 'vault-passphrase-' + pwId;
    pwElement.className = 'vault-passphrase';
    pwElement.type = 'password';
    pwElement.value = password.value;
    pwElement.placeholder = 'best pass ever';

    passDiv.className = 'vault-pass-container';
    passDiv.appendChild(pwElementLabel);
    passDiv.appendChild(pwElement);

    serviceDiv.className = 'vault-service-container';
    serviceDiv.appendChild(serviceElementLabel);
    serviceDiv.appendChild(serviceElement);

    submitButton.id = 'vault-generate-' + pwId;
    submitButton.className = 'vault-generate';
    submitButton.type = 'button';
    submitButton.value = 'Generate';
    if (settings.autosend) {
        submitButton.value = 'Generate\n& Login';
    }

    overlayDiv.id = 'vault-generator-overlay-' + pwId;
    overlayDiv.className = 'vault-generator-overlay';

    dialogDiv.className = 'vault-generator-dialog';
    dialogDiv.appendChild(serviceDiv);
    dialogDiv.appendChild(passDiv);
    dialogDiv.appendChild(submitButton);

    overlayDiv.appendChild(closeDiv);
    overlayDiv.appendChild(dialogDiv);

    password.parentNode.appendChild(overlayDiv);

    on($('vault-passphrase-' + pwId), 'focus', function () {
        if (!this.value) {
            this.value = password.value;
        }
    });

};

var getLoginForm = function (password) {
    'use strict';

    for (var i = 0; i < document.forms.length; i++) {
        for (var o = 0; o < document.forms[i].length; o++) {
            if (password.id === document.forms[i][o].id) {
                return i;
            }
            if (password.name === document.forms[i][o].name) {
                return i;
            }
        }
    }

    return false;
};

var vaultButtonSubmit = function (settings, password) {
    'use strict';

    var pwId = getPasswordIdentifier(password),
        passPhrase = $('vault-passphrase-' + pwId),
        phraseValue  = passPhrase.value,
        serviceValue = $('vault-servicename-' + pwId).value,
        newPassword,
        loginFormNumber;

    newPassword = generatePassword(serviceValue, phraseValue, settings);
//console.log(newPassword);
    password.value = newPassword;

    toggleOverlay($('vault-generator-overlay-' + pwId), false);

    if (settings.autosend) {
        loginFormNumber = getLoginForm(password);
        if ('number' === typeof loginFormNumber) {
            document.forms[loginFormNumber].submit();
        }
    } else {
        passPhrase.value = '';
    }
};

var setServicename = function (servicename, login, settings) {
    var domainname = document.domain;

    if (!servicename || servicename.value) {
        return false;
    }

    switch (settings.servicename) {
        case 'login':
            if (undefined === login) {
                return null;
            }

            if (login.value) {
                servicename.value = login.value;
            } else if (login.textContent && login.textContent.length <= 30) {
                servicename.value = login.textContent;
            } else {
                servicename.value = domainname;
            }
            break;

        case 'prefix':
            if (settings.defServicename) {
                servicename.value = settings.defServicename + domainname;
            }
            break;

        case 'suffix':
            if (settings.defServicename) {
                servicename.value = domainname + settings.defServicename;
            }
            break;
    }

    return true;
};

var activateOverlay = function (password, login, settings) {
    'use strict';

    var pwId = getPasswordIdentifier(password),
        passphrase = $('vault-passphrase-' + pwId),
        servicename = $('vault-servicename-' + pwId);

    toggleOverlay($('vault-generator-overlay-' + pwId), true);

    if (passphrase && !passphrase.value) {
        passphrase.value = password.value;
    }

    if (!overlayClosed) {
        passphrase.focus();
    }

    overlayClosed = false;

    setServicename(servicename, login, settings);
};

var closeOverlay = function (pwId, password) {
    toggleOverlay($('vault-generator-overlay-' + pwId), false);
    overlayClosed = true;
    password.focus();
};

var createOverlay = function (imgUrl, password, login, settings) {
    'use strict';

    var pwId = getPasswordIdentifier(password),
        servicename = $('vault-servicename-' + pwId);

    if (!$('vault-generator-overlay-' + pwId)) {
        addOverlayDiv(imgUrl, password, settings);

        on($('vault-generate-' + pwId), 'click', function () {
            vaultButtonSubmit(settings, password);
        });

        on($('vault-passphrase-' + pwId), 'keydown', function (e) {
            if (e.keyCode === 13) {
                vaultButtonSubmit(settings, password);
            }

            if (e.keyCode === 27) {
                closeOverlay(pwId, password);
            }
        });

        on(servicename, 'keydown', function (e) {
            if (e.keyCode === 27) {
                closeOverlay(pwId, password);
            }
        });

        on($('vault-generator-overlay' + pwId), 'keydown', function (e) {
            if (e.keyCode === 27) {
                closeOverlay(pwId, password);
            }
        });

        on($('vault-close-' + pwId), 'click', function () {
            closeOverlay(pwId, password);
        });

        setServicename(servicename, login, settings);
    } else {
        activateOverlay(password, login, settings);
    }
};

var initGenerator = function (imgUrl, password, login, settings) {
    'use strict';

    createOverlay(imgUrl, password, login, settings);

    on(password, 'focus', function () {
        if (!overlayClosed) {
            activateOverlay(password, login, settings);
        } else {
            overlayClosed = false;
        }
    });

    // make sure the overlay will be loaded even if the password field is already active
    if (password === document.activeElement) {
        activateOverlay(password, login, settings);
    }
};

var getSettings = function (settings) {
    'use strict';

    settings.length = undefined !== settings.plength ? settings.plength : DEFAULT_SETTINGS.length;
    settings.repeat = undefined !== settings.repeat ? settings.repeat : DEFAULT_SETTINGS.repeat;
    settings.autosend = undefined !== settings.autosend ? settings.autosend : DEFAULT_SETTINGS.autosend;
    settings.servicename = undefined !== settings.servicename ? settings.servicename : DEFAULT_SETTINGS.servicename;
    settings.defServicename = undefined !== settings.defServicename ? settings.defServicename : DEFAULT_SETTINGS.defServicename;

    for (var i = 0; i < TYPES.length; i++) {
        settings[TYPES[i]] = undefined !== settings[TYPES[i]] ? settings[TYPES[i]] : DEFAULT_SETTINGS[TYPES[i]];
    }

    return settings;
};

var getLoginName = function (userFieldList) {
    var login = getElementFromList(userFieldList, $);

    if (!login) {
        // @todo make this work right
        var callback = function (name) {
            return document.getElementsByName(name);
        };
        login = getElementFromList(userFieldList, callback);
    }


    return login;
};