'use strict';
var path = require('path');
var fs = require('fs-extra');
var util = require('util');

// framework
var framework = function (emitter, config, logger) {
    var log = logger.create('framework:content-stream');
    var filePath = './' + parseInt(Math.random()*999999999) + '.js';
    var out = fs.writeFileSync(filePath, config.contentStream());

    config.files.push({
        pattern: filePath,
        served: true,
        included: true,
        watched: true
    });
};
framework.$inject = ['emitter', 'config', 'logger'];
module.exports = {
    'framework:content-stream': [
        'factory', framework
    ]
};