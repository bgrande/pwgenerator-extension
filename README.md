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
* options are not retrieved completely
* standard options are incomplete
* check the overlay id naming -> might cause conflicts if there is no password input field id
* make escape work to close overlay field if not needed

Todo
======
* use option servicename within content script
* find a better way to get/recognize the service/loginname
* show/load already saved options at options page
* use extension icon to activate generator overlay on input field