vault-pwgenerator-extension
===========================

Generates safe passwords within browser context based on James Coglan's vault (https://github.com/jcoglan/vault)

Right now chrome only content_script extension with browser action support

Needed Chrome Permissions
=========================
* storage
* activeTab
* website access for http and https

Usage
=====
1. Install the unzipped extension by using the chrome/chromium developer mode.
2. Use the extension options to configure allowed or required characters, the servicename generation and so on.
3. Login to your account and change the password or create a new account. As soon as you hit the password field an overlay should open with a preset servicename and another password field. Choose your servicename and password and hit the Generate Button. Save the changes and logout. 
4. Now you should be able to login with the overlay opening as soon as you hit a password field. Make sure you use the same servicename and password as set before. The number of password fields found should be shown in front of the extension icon. If there was a password field on the page but no overlay opened, please click on the extension icon to rerun the password field recognition. If that didn't help, you might have found a bug... 


Issues
=======

Todo
======
2. store field-id names for passphrase and servicename into object after initialization
3. maybe use object structure for core library
4. find a better way to get/recognize the service/loginname and/or use more possible input types, names, etc.
5. build script for app zipping
6. minify js and css through build structure as well as using vendor folders
7. localization
8. if possible: if extension gets deactivated or deleted the overlays should be removed from every page
9. firefox extension
10. android app
