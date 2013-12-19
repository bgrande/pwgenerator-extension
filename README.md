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
1. should default settings be stored in storage? At least we need a better (structured) setting handling
2. how to handle top level domain classes like co.uk as part of servicename recognition?
3. store field-id names for passphrase and servicename into object after initialization
4. maybe use object structure for core library
5. find a better way to get/recognize the service/loginname and/or use more possible input types, names, etc.
6. build script for app zipping
7. minify js and css through build structure as well as using vendor folders
8. localization
9. if extension gets deactivated or deleted the overlays should be removed from every page
