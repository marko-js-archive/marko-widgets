var template = require('marko').load(require.resolve('./template.marko'));
var fs = require('fs-extra');

var filePath = process.argv[2];

var marko = require('marko');
var markoWidgets = require('marko-widgets');
var out = marko.createWriter();

out.on('error', function(err) {
    console.log('ERROR' + err);
}).on('finish', function() {
    var output = out.getOutput();
    var result = {
        // separate out all the html content from JavaScript
        html: output.replace(/\n/g, '\\n').replace(/'/g, '\\\'').replace(/\\u/g, '\\\\u').replace(/<script.*?<\/script>/g, ''),
        // merge JavaScripts to one js code
        js: output.match(/<script.*?<\/script>/g).map(
            function (match) {
                return match.replace(/<script.*?>/g, '').replace('</script>', '');
            }
        ).join(';')
    };
    fs.writeFileSync(filePath,
        'function beforeServerTests() {\n' +
        '   window.testData.widgets = {}\n' +
        '   var el = document.createElement("div");\n' +
        '   el.id="server";\n' +
        '   el.innerHTML = \'' + result.html + '\';\n' +
        '   document.body.appendChild(el);\n' +
        result.js +
        '}',
        'utf8'
    );
});
template.render({}, out);
out.end();