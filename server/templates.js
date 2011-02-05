var jsdom      = require('jsdom').jsdom,
    renderer   = require(__dirname + '/../shared/renderer'),
    path       = __dirname + "/../shared/template/",
    fs         = require('fs');
    directives = require(__dirname + '/../shared/directives').templateDirectives,
    doc        = jsdom(fs.readFileSync(path + 'master.html').toString(), null, {
      features : {
        FetchExternalResources   : false, 
        ProcessExternalResources : false
      }
    }),
    window = doc.createWindow(),
    pageContent = window.document.getElementById('page-content');

window.$p = require('pure').$p;

// TODO: callback
jsdom.jQueryify(window, __dirname + "/../shared/jquery.js", function(window, $) {
  $("script:last").remove();
});

exports.render = function(template, directive) {
  // Register the incoming template
  var string = fs.readFileSync(path + template + ".html").toString();

  renderer.register(template,
                    window.document, 
                    string,
                    directives[template] || {});

  return function(req, res) {
    pageContent.innerHTML = "";
    pageContent.appendChild(renderer.render(template));

    var html = window.document.outerHTML;


    res.writeHead(200, {
      'Content-type'   : 'text/html',
      'Content-length' : html.length 
    });

    res.end(html);
  }
};