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
1) set standard options when installing extension

Todo
======
1) find a better way to get/recognize the service/loginname and/or use more possible input types
2) if extension gets deactivated or deleted the overlays should be removed from every page