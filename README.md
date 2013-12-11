vault-pwgenerator-extension
===========================

Generates safe passwords within browser context based on jcoglan's vault (https://github.com/jcoglan/vault)

Right now chrome only content_script extension

Needed Chrome Permissions
=========================
* storage
* activeTab
* website access for http and https

Issues
=======
1. after reloading extension generate file prevent extension from creating the overlay for overlay passwords

Todo
======
1. find a better way to get/recognize the service/loginname and/or use more possible input types, names, etc.
2. minify js and css through build structure as well as using vendor folders
3. localization
4. if extension gets deactivated or deleted the overlays should be removed from every page
