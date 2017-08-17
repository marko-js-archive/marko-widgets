var sinon = require('sinon');
var complain = require('complain');

var _log, spy;

exports.watch = function(helpers) {
    _log=  complain.log;
    spy = sinon.spy(complain, 'log');
};

exports.results = function() {
    complain.log.restore();
    return spy;
}