module.exports = function(el, context) {
    context.deprecate("<"+el.tagName+"> is deprecated and no longer required.");
    el.detach();
}