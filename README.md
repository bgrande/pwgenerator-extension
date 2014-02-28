pwgenerator-extension
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

Tested Services
===============
* facebook.com
* google.com (gmail, plus, ...)
* ebay.com
* paypal.com
* trello.com
* news.ycombinator.com
* amazon.com
* stackoverflow.com
* github.com
* a jenkins installation

... more to come

Issues
=======
See github's repository issue section


Future Features
======
1. if possible: if extension gets deactivated or deleted the overlays should be removed from every page
2. firefox extension
3. android app
