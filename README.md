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
2) standard options are incomplete
3) check the overlay id naming -> might cause conflicts if there is no password input field id
4) make escape work to close overlay field if not needed

Todo
======
2) use option servicename within content script
3) find a better way to get/recognize the service/loginname
4) use extension icon to activate generator overlay on input field