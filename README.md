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

Todo
======
1. use prototype and objects for generator parts
2. find a better way to get/recognize the service/loginname and/or use more possible input types, names, etc.
3. minify js and css through build structure as well as using vendor folders
4. localization
5. if extension gets deactivated or deleted the overlays should be removed from every page
