var expect = require('chai').expect;

module.exports = {
    init: function() {
        window.app = this;
        this.helloWidgets = this.getWidgets('hello');
    },

    test: function() {
        expect(this.helloWidgets.length).to.equal(5);
    }
};