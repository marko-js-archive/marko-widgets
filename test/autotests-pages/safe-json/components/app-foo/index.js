module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),

    getInitialState: function() {
        return {
            'foo-0': 'bar\u2028',
            'foo-1': 'bar\u2029',
            'foo-2': '\u2028bar\u2029',
            'foo-3': 'Hello </script> \u2028bar\u2029'
        };
    },

    init: function(widgetConfig) {
        window.fooWidget = this;
    }
});