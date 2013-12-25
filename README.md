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

Todo
======
1. how to handle top level domain classes like co.uk as part of servicename recognition?
2. store field-id names for passphrase and servicename into object after initialization
3. maybe use object structure for core library
4. find a better way to get/recognize the service/loginname and/or use more possible input types, names, etc.
5. build script for app zipping
6. minify js and css through build structure as well as using vendor folders
7. localization
8. if possible: if extension gets deactivated or deleted the overlays should be removed from every page
9. firefox extension
10. android app
