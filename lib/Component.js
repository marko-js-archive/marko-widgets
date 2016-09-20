var inherit = require('raptor-util/inherit');
var extend = require('raptor-util/extend');
var Widget = require('./Widget');

/////////////////
// Constructor //
/////////////////

function Component(id, document) {
    Widget.apply(this, arguments);
}

/////////////
// Statics //
/////////////

Component._isWidget = true;

Component.renderer = function(input, out) {
    var template;
    var component = new this();

    if (component.onInput) {
        component.onInput(input, out);
    }

    var data = {};

    if(component.render) {
        template = component.render(component.state, input, out);
    } else {
        template = component.constructor.template;
        if(typeof template === 'string') {
            template = component.constructor.template = require('marko').load(template);
        }

        if(component.getTemplateData) {
            data = component.getTemplateData(component.state, input, out);
        } else {
            data = extend(data, component.state);
        }
    }

    data.widgetState = component.state;
    data.widgetProps = input;
    data.widgetBody = component.getInitialBody ? component.getInitialBody() : input.renderBody;
    data.widgetConfig = component.getWidgetConfig();

    template.render(data, out);
};

Component.render = function() {
    if(this === Component) {
        throw new Error('You cannot render the base Component directly');
    }
    this.render = require('raptor-renderer').createRenderFunc(this.renderer.bind(this));
    return this.render.apply(this, arguments);
};

///////////////
// Prototype //
///////////////


var component = Component.prototype;

component.initWidget = function(config) {
    if(config) extend(this, config);
};

component.getWidgetConfig = function() {
    var config = {};
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            if(key === 'state') continue;
            if(typeof this[key] === 'function') continue;
            config[key] = this[key];
        }
    }
    return config;
};

module.exports = inherit(Component, Widget);