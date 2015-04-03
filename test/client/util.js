require('jquery');

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


function cleanup() {

    window.testData = {
        widgets: {

        },
        addWidget: function(name, widget) {
            var widgetList = window.testData.widgets[name] || (window.testData.widgets[name] = []);
            widgetList.push(widget);
        }
    };

    var targetEl = document.getElementById('target');
    if (targetEl) {
        targetEl.parentNode.removeChild(targetEl);
    }

    var div = document.createElement('div');
    div.id = 'target';
    document.body.appendChild(div);
}

function triggerMouseEvent(el, type) {
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
}

exports.cleanup = cleanup;
exports.triggerMouseEvent = triggerMouseEvent;

Object.defineProperty(
    exports,
    'targetEl',
    {
        get: function () {
            return document.getElementById('target');
        }
    });