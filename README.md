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
1. how to handle top level domain classes like co.uk as part of servicename recognition?
2. store passphrase and service field-id-names into object after initialization

Todo
======
1. find a better way to get/recognize the service/loginname and/or use more possible input types, names, etc.
2. build script for app zipping
3. minify js and css through build structure as well as using vendor folders
4. localization
5. if extension gets deactivated or deleted the overlays should be removed from every page
