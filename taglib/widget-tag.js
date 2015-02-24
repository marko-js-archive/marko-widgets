'use strict';
var widgets = require('../');
var DUMMY_WIDGET_DEF = {
        elId: function () {
        }
    };
module.exports = function render(input, out) {
    var modulePath = input.module;
    var config = input.config || input._cfg;
    var widgetArgs = out.data.widgetArgs;
    var id = input.id;
    var scope = input.scope || out.getAttribute('widget');
    var assignedId = input.assignedId;
    var extend;
    var events = input.events;

    if (widgetArgs) {
        delete out.data.widgetArgs;
        scope = scope || widgetArgs.scope;
        assignedId = assignedId || widgetArgs.id;
        extend = widgetArgs.extend;
    }

    if (!id && input.hasOwnProperty('id')) {
        throw new Error('Invalid widget ID for "' + modulePath + '"');
    }
    var widgetsContext = widgets.getWidgetsContext(out);

    if (modulePath) {
        var widgetDef = widgetsContext.beginWidget({
            module: modulePath,
            id: id,
            assignedId: assignedId,
            config: config,
            scope: scope,
            events: events,
            createWidget: input.createWidget,
            extend: extend
        });

        input.renderBody(out, widgetDef);

        widgetDef.end();
    } else {
        input.renderBody(out, DUMMY_WIDGET_DEF);
    }
};