var Promise = require('promise-polyfill');

exports.getPromiseShort = function() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve({});
        }, 10);
    });
};

exports.getPromiseLong = function() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve({});
        }, 40);
    });
};