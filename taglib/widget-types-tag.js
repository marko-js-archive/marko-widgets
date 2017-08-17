var complain = require('complain');
var buildWidgetTypeNode = require('./util/buildWidgetTypeNode');

module.exports = function codeGenerator(el, codegen) {
    var builder = codegen.builder;
    var context = codegen.context;

    complain('The <widget-types> tag is deprecated. See https://github.com/marko-js/marko/issues/514', { location:context.getPosInfo(el.pos).toString() })

    var attrs = el.getAttributes();

    var typesObject = {};

    attrs.forEach((attr) => {
        if (!attr.isLiteralString()) {
            codegen.addError('Widget type should be a string');
            return;
        }

        typesObject[attr.name] = buildWidgetTypeNode(attr.literalValue, codegen.context.dirname, codegen.builder);
    });

    codegen.addStaticVar('__widgetTypes', builder.literal(typesObject));
};