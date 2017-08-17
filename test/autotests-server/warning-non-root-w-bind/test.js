var expect = require('chai').expect;
var complain = require('../../util/complain');

module.exports = function(helpers) {
    complain.watch();

    require('./template.marko');

    var results = complain.results();
    expect(results.callCount).to.equal(1);
};