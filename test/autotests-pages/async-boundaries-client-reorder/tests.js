var path = require('path');

describe(path.basename(__dirname), function() {
    it('should initialize widgets correctly across async boundaries', function() {
        window.app.test();
    });
});