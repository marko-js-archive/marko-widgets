'use strict';
var path = require('path');
var fs = require('fs-extra');
var util = require('util');

// framework
var framework = function (emitter, config, logger) {
    var log = logger.create('framework:marko-html-content');
    var filePath = '.test/static/' + parseInt(Math.random()*999999999) + '.js';
    log.debug('saving contents to file', filePath);
    var sh = require('execSync');
    var code = sh.run('node fixtures/pages/server-init/index.js ' + filePath);
    config.files.push({
        pattern: process.cwd() + '/' + filePath,
        served: true,
        included: true,
        watched: true
    });
};
framework.$inject = ['emitter', 'config', 'logger'];
module.exports = {
    'framework:marko-html-content': [
        'factory', framework
    ]
};