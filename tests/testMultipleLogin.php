<!DOCTYPE html>
<html>
<head>
    <title>Test Login</title>
    <script>
        var output = function (e) {
            console.log('got ya');
        };

        setInterval(function () {
            var passwords = document.querySelectorAll("input[type=password]");
            for (var i = 0, n = passwords.length; i < n; i++) {
                passwords[i].onclick = function (e) { console.log('got ya click!')};
                passwords[i].addEventListener("keydown", output, true);
                passwords[i].addEventListener("keyup", output, true);
            }
        }, 100)
    </script>
</head>
<body>
<div>
    <div>
        <input type="text" class="inputtext" name="email" id="email" value="" tabindex="1" />
    </div>
    <div>
        <input type="password" class="inputtext" name="pass" id="pass" tabindex="2" />
    </div>
    <div>
        <label id="loginbutton">
            <input value="Anmelden" tabindex="4" type="submit" />
        </label>
    </div>
</div>

<div>
    <div>
        <input type="text" class="inputtext" name="email" id="email2" value="" tabindex="1" />
    </div>
    <div>
        <input type="password" class="inputtext" name="pass" id="pass2" tabindex="2" />
    </div>
    <div>
        <label id="loginbutton">
            <input value="Anmelden" tabindex="4" type="submit" />
        </label>
    </div>
</div>
</body>
</html>