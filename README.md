vault-pwgenerator-extension
===========================

Generates safe passwords within browser context based on James Coglan's vault (https://github.com/jcoglan/vault)

Right now chrome only content_script extension

Needed Chrome Permissions
=========================
* storage
* activeTab
* website access for http and https

Issues
=======
1. fix reloading of generate.js
2. get password field through generator object

Todo
======
1. should default settings be stored in storage?
2. how to handle top level domain classes like co.uk as part of servicename recognition?
3. store passphrase and service field-id-names into object after initialization
4. maybe use object structure for core library
5. find a better way to get/recognize the service/loginname and/or use more possible input types, names, etc.
6. build script for app zipping
7. minify js and css through build structure as well as using vendor folders
8. localization
9. if extension gets deactivated or deleted the overlays should be removed from every page
