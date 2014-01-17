vault-pwgenerator-extension
===========================

Generates safe passwords within browser context based on James Coglan's vault (https://github.com/jcoglan/vault)

* Right now it is a chrome only content_script extension with browser action support
* The firefox extension is under development


Needed Chrome Permissions
=========================
* storage
* activeTab
* website access for http and https

Requirements
=============
1. ant

Usage (Chrome)
==============
1. run ant prepare-chrome
2. Install the unzipped extension (folder chrome-extension) by using the chrome/chromium developer mode.

Usage (Firefox)
===============
1. run ant firefox
2. Install the zipped (xpi) extension you find into the build/ folder from your firefox add-on management

Usage (All)
===========
3. Use the extension options to configure allowed or required characters, the servicename generation and so on.
4. Login to your account and change the password or create a new account. As soon as you hit the password field an overlay should open with a preset servicename and another password field. Choose your servicename and password and hit the Generate Button. Save the changes and logout.
5. Now you should be able to login with the overlay opening as soon as you hit a password field. Make sure you use the same servicename and password as set before. The number of password fields found should be shown in front of the extension icon. If there was a password field on the page but no overlay opened, please click on the extension icon to rerun the password field recognition. If that didn't help, you might have found a bug...

Issues
=======
See github's repository issue section

Future Features
===============
1. if possible: if extension gets deactivated or deleted the overlays should be removed from every page
2. firefox extension
3. android app
