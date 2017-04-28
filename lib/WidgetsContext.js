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

var WidgetDef = require('./WidgetDef');
var uniqueId = require('./uniqueId');
var initWidgets = require('./init-widgets');
var EventEmitter = require('events').EventEmitter;
var inherit = require('raptor-util/inherit');

var PRESERVE_EL = 1;
var PRESERVE_EL_BODY = 2;
var PRESERVE_EL_UNPRESERVED_BODY = 4;

function GlobalWidgetsContext() {
    this._widgets = [];
    this.preserved = null;
    this.reusableWidgets = null;
    this.reusableWidgetsById = null;
    this.widgetsById = {};
}

GlobalWidgetsContext.prototype = {
    get widgets() {
        var allChildren = [];

        this._widgets.forEach(function(rootWidgetDef) {
            allChildren = allChildren.concat(rootWidgetDef.children);
        });

        return allChildren;
    },

    initWidgets: function(document) {
        initWidgets.initClientRendered(this.widgets, document);
    },

    isPreservedEl: function(id) {
        var preserved = this.preserved;
        return preserved && (preserved[id] & PRESERVE_EL);
    },

    isPreservedBodyEl: function(id) {
        var preserved = this.preserved;
        return preserved && (preserved[id] & PRESERVE_EL_BODY);
    },

    hasUnpreservedBody: function(id) {
        var preserved = this.preserved;
        return preserved && (preserved[id] & PRESERVE_EL_UNPRESERVED_BODY);
    },

    addPreservedDOMNode: function(existingEl, bodyOnly, hasUnppreservedBody) {
        var preserved = this.preserved || (this.preserved = {});

        var value = bodyOnly ?
            PRESERVE_EL_BODY :
            PRESERVE_EL;

        if (hasUnppreservedBody) {
            value |= PRESERVE_EL_UNPRESERVED_BODY;
        }

        preserved[existingEl.id] = value;
    },
    getWidget: function(id) {
        return this.widgetsById[id];
    },
    hasWidgets: function () {
        return this.widgets.length !== 0;
    }
};

function WidgetsContext(out, rootWidget) {
    if (!rootWidget) {
        rootWidget = new WidgetDef({}, null, out);
    }

    EventEmitter.call(this);
    this.out = out;
    this.widgetStack = [rootWidget];

    this.globalWidgetsContext = out.global.widgets || (out.global.widgets = new GlobalWidgetsContext(out));
}

WidgetsContext.prototype = {
    getWidgets: function () {
        return this.widgets;
    },

    getWidgetStack: function() {
        return this.widgetStack;
    },

    getCurrentWidget: function() {
        return this.widgetStack[this.widgetStack.length - 1];
    },

    beginWidget: function (widgetInfo, callback) {
        var _this = this;
        var widgetStack = _this.widgetStack;
        var origLength = widgetStack.length;
        var parent = widgetStack[origLength - 1];

        if (!widgetInfo.id) {
            widgetInfo.id = _this._nextWidgetId();
        }

        widgetInfo.parent = parent;

        function end() {
            widgetStack.length = origLength;
        }

        var widgetDef = new WidgetDef(widgetInfo, end, this.out);
        this.globalWidgetsContext.widgetsById[widgetInfo.id] = widgetDef;

        parent.addChild(widgetDef);

        widgetStack.push(widgetDef);

        this.emit('beginWidget', widgetDef);

        return widgetDef;
    },
    _nextWidgetId: function () {
        return uniqueId(this.out);
    },
    onBeginWidget: function(listener) {
        this.on('beginWidget', listener);
    }
};

inherit(WidgetsContext, EventEmitter);

WidgetsContext.getWidgetsContext = function(out) {
    var widgetsContext = out.data.widgets;
    if (!widgetsContext) {
        out.data.widgets = widgetsContext = new WidgetsContext(out);
        widgetsContext.globalWidgetsContext._widgets.push(widgetsContext.widgetStack[0]);
    }

    return widgetsContext;
};

module.exports = WidgetsContext;