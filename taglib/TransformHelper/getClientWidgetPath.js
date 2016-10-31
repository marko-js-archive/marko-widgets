var tryRequire = require('try-require');
var raptorModulesResolver = tryRequire('raptor-modules/resolver', require);
var lasso = tryRequire('lasso', require);
var resolveFrom = require('resolve-from');

module.exports = function getClientWidgetPath(targetModuleFile) {
    var from = this.template.dirname;

    if (lasso && lasso.getClientPath) {
        var targetPath = resolveFrom(from, targetModuleFile);
        return lasso.getClientPath(targetPath);
    } else if (raptorModulesResolver) {
        var resolved = raptorModulesResolver.resolveRequire(targetModuleFile, from);
        return resolved.logicalPath;
    } else {
        return targetModuleFile;
    }
};