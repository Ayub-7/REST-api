var CryptoJS = require("crypto-js");
exports.hash = async  function (password) {
    var pass = CryptoJS.SHA1(password);
    return pass;
}

