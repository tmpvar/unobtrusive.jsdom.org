var jsdom    = require('jsdom').jsdom,
    renderer = require(__dirname + '/../shared/renderer'),
    path     = __dirname + "/../shared/template/",
    fs       = require('fs');
    doc      = jsdom(fs.readFileSync(path + 'master.html').toString(), null, {
      features : {
        FetchExternalResources   : false, 
        ProcessExternalResources : false,
        MutationEvents           : false
      }
    });

exports.renderRoute = function(template, directive) {
  // Register the incoming template
  var string = fs.readFileSync(path + template + ".html").toString();

  renderer.register(template,
                    doc, 
                    string,
                    {});

  return function(req, res) {
    var frag = renderer.render(template),
        html = frag.innerHTML;

    res.writeHead(200, {
      'Content-type'   : 'text/html',
      'Content-length' : html.length 
    });

    res.end(html);
  }
};