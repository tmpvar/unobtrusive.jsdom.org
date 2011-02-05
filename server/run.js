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
    //connect.logger(),
    connect.staticProvider(__dirname + '/../browser'),
    connect.staticProvider(__dirname + '/../shared'),
    connect.bodyDecoder(),
    connect.router(function(r) {
      r.get('/', templates.render('index'));
      r.get('/contacts', templates.render('contact/list', function(cb) {
        cb(null, db.get('contacts'));
      }));

      r.post('/contacts', function(req, res) {
        var contacts = db.get('contacts') || {},
            email    = req.body.email;
        
        if (!contacts[email]) {
          contacts[email] = req.body;
          db.set('contacts', contacts);

          res.writeHead(201, {
            'Content-type' : 'text/html',
            'Location'     : '/contacts/' + email
          });

          res.end();
        } else {
          res.writeHead(409, {'Content-type' : 'text/html'});
          res.end('Duplicate Contact\n');
        }
      });

      r.get('/contacts/add', templates.render('contact/manage'));

      r.get('/contacts/:contact', templates.render('contact/view', function(email,cb) {
        var contacts = db.get('contacts');
        if (contacts[email]) {
          cb(null, contacts[email])
        } else {
          cb(404);
        }
      }));

      r.get('/templates', function(req, res) {
        res.writeHead(200, {
          'Content-type'   : 'application/json',
          'Content-length' : renderer.templateSeed.length
        });

        res.end(renderer.templateSeed);
      });
    })
);

server.listen(port);
console.log("Ready on port " + port)