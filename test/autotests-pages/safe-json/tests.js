var path = require('path');
var expect = require('chai').expect;

describe(path.basename(__dirname), function() {
    it('should serialize widget config down to the browser', function() {
        expect(window.fooWidget.state['foo-0']).to.equal('bar\u2028');
        expect(window.fooWidget.state['foo-1']).to.equal('bar\u2029');
        expect(window.fooWidget.state['foo-2']).to.equal('\u2028bar\u2029');
        expect(window.fooWidget.state['foo-3']).to.equal('Hello </script> \u2028bar\u2029');
    });
});