'use strict';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('here we are');

    if (!request.hasOwnProperty(event)) {
        return;
    }

    switch (request.event) {
        case "updatePassword":
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
