var complain = require('complain');

module.exports = function(el, context) {
    if (!context.data.widgetTransformedRoot) {
        context.data.widgetTransformedRoot = true;
        var walker = context.createWalker({
            enter(node) {
                if (node.type === 'TemplateRoot' || !node.type) {
                    // Don't worry about the TemplateRoot or an Container node
                } else if (node.type === 'HtmlElement') {
                    if (node.hasAttribute('w-bind')) {
                        if (node.parentNode.type !== 'TemplateRoot') {
                            complain('The w-bind attribute should be used on the root element of the template. See https://github.com/marko-js/marko-widgets/issues/95', { location:context.getPosInfo(node.pos).toString() });
                        }
                        walker.skip();
                    }
                }
            }
        });
        walker.walk(getTemplateRoot(el));
    }
};

function getTemplateRoot(el) {
    var parentNode = el.parentNode;
    while(parentNode.parentNode) parentNode = parentNode.parentNode;
    return parentNode;
}