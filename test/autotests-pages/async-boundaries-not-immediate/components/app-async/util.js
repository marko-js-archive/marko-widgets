var Promise = require('promise-polyfill');

exports.getPromise = function() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve({});
        }, 10);
    });
};