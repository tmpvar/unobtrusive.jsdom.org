/*
  This is a simple rest service that handles contact list manipulation.

  Templating is unobtrusive which means with or without js on the browser
  this example will still work.  js on the browser certainly helps performance though!
*/

var connect   = require('connect'),
    db        = require('dirty')(__dirname + "/contacts.db"),
    renderer  = require(__dirname + '/../shared/renderer'),
    templates = require(__dirname + '/templates'),
    port      = 3000;

var server = connect.createServer(
    connect.logger(),
    connect.staticProvider(__dirname + '/../browser'),
    connect.staticProvider(__dirname + '/../shared'),
    connect.bodyDecoder(),
    connect.router(function(r) {
      r.get('/', templates.renderRoute('index'));
      r.get('/contacts', templates.renderRoute('contact/list'));

      r.get('/templates', function(req, res) {
        var json = JSON.stringify(renderer.templates, null, '  ');

        res.writeHead(200, {
          'Content-type'   : 'application/json',
          'Content-length' : json.length
        });

        res.end(json);
      });
    })
);

server.listen(port);
console.log("Ready on port " + port)