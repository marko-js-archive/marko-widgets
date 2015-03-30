'use strict';
var widgets = require('../');
var DUMMY_WIDGET_DEF = {
        elId: function () {
        }
    };
module.exports = function render(input, out) {

    var global = out.global;
    if (!global.__widgetsBeginAsyncAdded) {
        global.__widgetsBeginAsyncAdded = true;
        out.on('beginAsync', function(event) {
            var parentAsyncWriter = event.parentWriter;
            var asyncWriter = event.writer;
            var widgetsContext = global.widgets;
            var widgetStack;

            if (widgetsContext && (widgetStack = widgetsContext.widgetStack).length) {
                // All of the widgets in this async block should be
                // initialized after the widgets in the parent. Therefore,
                // we will create a new WidgetsContext for the nested
                // async block and will create a new widget stack where the current
                // widget in the parent block is the only widget in the nested
                // stack (to begin with). This will result in top-level widgets
                // of the async block being added as children of the widget in the
                // parent block.
                var nestedWidgetsContext = new widgets.WidgetsContext(out);
                nestedWidgetsContext.widgetStack = [widgetStack[0]];
                asyncWriter.data.widgets = nestedWidgetsContext;
            }

            asyncWriter.data.widgetArgs = parentAsyncWriter.data.widgetArgs;
        });
    }

    var modulePath = input.module;
    var config = input.config || input._cfg;
    var widgetArgs = out.data.widgetArgs;
    var id = input.id;
    var extend;
    var domEvents = input.domEvents;
    var customEvents;
    var scope;

    if (widgetArgs) {
        delete out.data.widgetArgs;
        id = widgetArgs.id || id;
        extend = widgetArgs.extend;
        customEvents = widgetArgs.customEvents;
        scope = widgetArgs.scope;
    }

    if (global.widgetId) {
        id = global.widgetId;
        delete global.widgetId;
    }

    if (!id && input.hasOwnProperty('id')) {
        throw new Error('Invalid widget ID for "' + modulePath + '"');
    }
    var widgetsContext = widgets.getWidgetsContext(out);

    if (modulePath) {
        var widgetDef = widgetsContext.beginWidget({
            module: modulePath,
            id: id,
            config: config,
            domEvents: domEvents,
            customEvents: customEvents,
            scope: scope,
            createWidget: input.createWidget,
            extend: extend
        });

        input.renderBody(out, widgetDef);

        widgetDef.end();
    } else {
        input.renderBody(out, DUMMY_WIDGET_DEF);
    }
};