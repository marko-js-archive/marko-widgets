/*
 * Copyright 2011 eBay Software Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
* Module to manage the lifecycle of widgets
*
*/

/*
 * Copyright 2011 eBay Software Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var stringify = require('raptor-json/stringify');
var raptorModulesResolver = require('raptor-modules/resolver');
var raptorModulesUtil = require('raptor-modules/util');
var raptorRenderer = require('raptor-renderer');

var WidgetsContext = require('./WidgetsContext');
var TAG_START = '<span id="rwidgets" data-ids="';
var TAG_END = '" style="display:none;"></span>';
var STRINGIFY_OPTIONS = {
    special: /([^ -~]|(["'\\<&%]))/g,
    replace: {
        '"': '\\u0022',
        '\n': '\\n',
    },
    useSingleQuote: true
};

function WrappedString(val) {
    this.html = val;
}

WrappedString.prototype = {
    toString: function() {
        return this.html;
    }
};

var bubbleEventsLookup = {};

require('./bubble').forEach(function(eventType) {
    bubbleEventsLookup[eventType] = true;
});

exports.isBubbleEvent = function(eventType) {
    return bubbleEventsLookup.hasOwnProperty(eventType);
};

exports.WidgetsContext = WidgetsContext;
exports.getWidgetsContext = WidgetsContext.getWidgetsContext;
exports.uniqueId = require('./uniqueId');
exports.attrs = function(widget) {
    var attrs = {
        'data-widget': widget.module
    };
    var i, len;

    var widgetConfig = widget.config;
    if (widgetConfig) {
        attrs['data-w-config'] = new WrappedString(stringify(widgetConfig, STRINGIFY_OPTIONS));
    }

    if (widget.assignedId) {
        attrs['data-w-id'] = (widget.scope ? widget.scope.id + '|' : '') + widget.assignedId;
    }

    var events = widget.events;
    if (events) {
        attrs['data-w-on'] = events.join('|');
    }

    var extend = widget.extend;

    if (extend && extend.length) {
        var extendParts = [];

        for (i=0, len=extend.length; i<len; i+=2) {
            var curExtend = extend[i];
            var curExtendConfig = stringify(extend[i+1], STRINGIFY_OPTIONS);
            extendParts.push(curExtend);
            extendParts.push(curExtendConfig);
        }
        attrs['data-w-extend'] = new WrappedString(extendParts.join('%'));
    }

    return attrs;
};

exports.writeInitWidgetsCode = function(widgetsContext, out, options) {
    var clearWidgets = true;
    var scanDOM = false;
    var immediate = false;

    if (options) {
        clearWidgets = options.clearWidgets !== false;
        scanDOM = options.scanDOM === true;
        immediate = options.immediate === true;
    }

    if (scanDOM) {
        out.write(TAG_START + '*' + TAG_END);
    } else {
        var widgets = widgetsContext.getWidgets();

        if (!widgets || !widgets.length) {
            return;
        }

        var ids = '';

        var commaRequired = false;

        var writeWidget = function(widget) {

            if (widget.children.length) {
                // Depth-first search (children should be initialized before parent)
                writeWidgets(widget.children);
            }

            if (commaRequired) {
                ids += ',';
            } else {
                commaRequired = true;
            }

            ids += widget.id;
        };

        var writeWidgets = function(widgets) {
            for (var i = 0, len = widgets.length; i < len; i++) {
                writeWidget(widgets[i]);
            }
        };

        writeWidgets(widgets);

        if (immediate) {
            out.write('<script type="text/javascript">$rwidgets("' + ids + '")</script>');
        } else {
            out.write(TAG_START + ids + TAG_END);
        }
    }

    if (clearWidgets !== false) {
        widgetsContext.clearWidgets();
    }
};

exports.getInitWidgetsCode = function(widgetsContext) {
    if (!widgetsContext) {
        throw new Error('"widgetsContext" is required');
    }

    if (!(widgetsContext instanceof WidgetsContext)) {
        // Assume that the provided "widgetsContext" argument is
        // actually an AsyncWriter
        var asyncWriter = widgetsContext;
        if (!asyncWriter.global) {
            throw new Error('Invalid argument: ' + widgetsContext);
        }

        widgetsContext = WidgetsContext.getWidgetsContext(asyncWriter);
    }

    var widgets = widgetsContext.getWidgets();

    if (!widgets || !widgets.length) {
        return;
    }

    var ids = '';

    var commaRequired = false;

    function writeWidget(widget) {

        if (widget.children.length) {
            // Depth-first search (children should be initialized before parent)
            writeWidgets(widget.children);
        }

        if (commaRequired) {
            ids += ',';
        } else {
            commaRequired = true;
        }

        ids += widget.id;
    }

    function writeWidgets(widgets) {
        for (var i = 0, len = widgets.length; i < len; i++) {
            writeWidget(widgets[i]);
        }
    }

    writeWidgets(widgets);

    return '$rwidgets("' + ids + '");';
};

exports.getClientWidgetPath = function(targetModuleFile, from) {
    var resolved = raptorModulesResolver.resolveRequire(targetModuleFile, from);
    return resolved.logicalPath;
};

var dynamicClientWidgetPathCache = {};

exports.getDynamicClientWidgetPath = function(targetModuleFile) {
    var clientPath = dynamicClientWidgetPathCache[targetModuleFile];
    if (!clientPath) {
        var resolved = raptorModulesUtil.getPathInfo(targetModuleFile);
        clientPath = dynamicClientWidgetPathCache[targetModuleFile] = resolved.logicalPath;
    }
    return clientPath;
};

exports.renderable = raptorRenderer.renderable;
exports.render = raptorRenderer.render;