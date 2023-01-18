'use strict';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('here we are');

    if (!request.hasOwnProperty('event')) {
        console.log('event property not found!', request, sender, sendResponse);
        return;
    }

    switch (request.event) {
        case "updatePassword":
            console.log(request);
            let passwordData = request.data;

            let $pwField = $(passwordData.fieldId);

            if ($pwField) {
                $pwField.value = passwordData.password;
                $pwField.type = passwordData.type;

                if (passwordData.autoSubmit) {
                    let loginFormNumber = Helper.getLoginForm($pwField);
                    if ('number' === typeof loginFormNumber) {
                        document.forms[loginFormNumber].submit();
                    }
                }
            }

            break;
        default:
            sendResponse(null);
    }
});
