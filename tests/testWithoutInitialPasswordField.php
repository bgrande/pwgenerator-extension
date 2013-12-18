<!DOCTYPE html>
<html>
<head>
    <title>Test Login</title>
</head>
<body>
<div>
    <div>
        <input type="text" class="inputtext" name="email" id="email" value="" tabindex="1" />
    </div>
    <div>
        <input type="text" class="inputtext" name="porkelblapass" id="porkelblapass" tabindex="2" />
    </div>
    <div>
        <label id="loginbutton">
            <input value="Anmelden" tabindex="4" type="submit" />
        </label>
    </div>
</div>
<script type="text/javascript">
    var $ = function (selector) {
        'use strict';

        return document.getElementById(selector);
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

    on($('porkelblapass'), 'keyup', function () {
        setTimeout(function () {
            $('porkelblapass').type = 'password';
        }, 1000)
    });
</script>
</body>
</html>