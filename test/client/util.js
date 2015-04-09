require('jquery');
// we load all the files required for server side test cases here
require('marko-widgets');
require('./fixtures/components/app-foo/widget');
require('./fixtures/components/app-bar/widget');
require('./fixtures/components/app-dom-events/widget');
require('./fixtures/components/app-dom-events-jquery/widget');
require('./fixtures/components/app-extend-checkbox/widget');
require('./fixtures/components/app-widget-config/widget');
require('./fixtures/components/app-init-async/widget');
require('./fixtures/components/app-fixed-id/widget');

require('chai').Assertion.includeStack = true;
// initializing testdata for widget tests
window.testData = {
    widgets: {},
    addWidget: function (name, widget) {
        var widgetList = window.testData.widgets[name] || (window.testData.widgets[name] = []);
        widgetList.push(widget);
    }
};

exports.triggerMouseEvent = function (el, type) {
    var ev = document.createEvent("MouseEvent");
    ev.initMouseEvent(
        type,
        true /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    el.dispatchEvent(ev);
};
// utility functions for client rendered tests
exports.clientTests = {
    before: function () {
        this.widgets = window.testData.widgets;
    },
    after: function () {
        window.testData.widgets = this.widgets;
    },
    beforeEach: function () {
        $('#target').remove();
        $('<div id="target"></div>').appendTo($('body'));
        window.testData.widgets = {};
    }
};

Object.defineProperty(
    exports,
    'targetEl',
    {
        get: function () {
            return document.getElementById('target');
        }
    });