var pageTemplate = require('marko').load(require.resolve('./fixtures/pages/server-init/template.marko'));
var pageLayoutTemplate = require('marko').load(require.resolve('./page-layout.marko'));

module.exports = function () {
    return pageTemplate.renderSync({
        layout: pageLayoutTemplate
    });
};