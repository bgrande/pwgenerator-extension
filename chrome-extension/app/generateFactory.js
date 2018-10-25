'use strict';

var overlayFactory = function (settings, passwordElement, domainname) {
    var domainService = Object.create(DomainService).init(settings.serviceExceptions, domainname),
        loginField = Object.create(LoginField).init(settings.userFieldList),
        passwordField = Object.create(PasswordField).init(passwordElement),
        generator = Object.create(Generator).init(settings, domainService);

    return Object.create(Overlay).init(settings, passwordField, loginField, generator);
};
