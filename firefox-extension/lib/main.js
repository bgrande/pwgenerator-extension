// "data" is supplied by the "self" module
var data = require("sdk/self").data;

contentScriptFile: [
    data.url("lib/crypto-js-3.1.2.js"),
    data.url("lib/vault.js"),
    data.url("lib/core.js"),
    data.url("app/vault-generator.js"),
    data.url("app/options.js"),
    data.url("app/generate.js")
];