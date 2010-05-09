/*
  This is a simple rest service that handles contact list manipulation.

  Templating is unobtrusive which means with or without js on the browser
  this example will still work.  js on the browser certainly helps performance though!
*/

// Add server/lib to the search path
require.paths.unshift(__dirname + "/lib");
require.paths.unshift(__dirname + "/../browser/");

var port         = 10017,
    sys          = require("sys"),
    dom          = require("jsdom/lib/level1/core").dom.level1.core,
    browser      = require("jsdom/lib/browser"),
    fs           = require("fs"),
    router       = require("node-router/lib/node-router"),
    server       = router.getServer(function() {}),
    jQueryScript = fs.readFileSync(__dirname + "/../browser/jquery.js"),
    PureScript   = fs.readFileSync(__dirname + "/../browser/pure.js");

// TODO: move into level 2
dom.Document.prototype.compareDocumentPosition = function() {};
dom.Node.prototype.addEventListener = function() {};

var datastore = JSON.parse(fs.readFileSync(__dirname + "/store.json")),
    templateCache = {};

var getTemplate = function(path) {
  if (!templateCache[path]) {
    var data = fs.readFileSync(__dirname + "/template/" + path);
    templateCache[path] = data;
    return data;
  } else {
    return templateCache[path];
  }
};

var templateToDom = function(path) {
  var data   = getTemplate(path),
      window = browser.windowAugmentation(dom);

  window.addEventListener = function() {};
  window.alert = function(msg) { sys.puts(msg); };

  window.document.innerHTML = data;
  window.window = window;
  with(window) {
    try {
      eval(jQueryScript);
      eval(PureScript);
    } catch (e) {
      sys.puts(sys.inspect(e.stack, true));
    }
  };
  return window;
};

// Cache all of the template documents synchronously
var masterTemplate = templateToDom("master.html");

var renderTemplate = function(templateName, data, directive, contentType) {
  contentType = contentType || "html";

  if (contentType.match(/html/) || contentType.match(/\*\/\*/)) {
    masterTemplate.jQuery(".page-content").html(getTemplate(templateName));
    // Perform Unobtrusive templating.
    if (data && directive) {
      masterTemplate.jQuery(".page-content").render(data, directive);
    }
    return masterTemplate.document.innerHTML;
  } else if (contentType.match(/json/)) {
    return data;
  }
};

var findContact = function(handle) {
  for (var i=0; i<datastore.contacts.length; i++) {
    if (datastore.contacts[i].handle === contact) {
      return datastore.contacts[i];
      break;
    }
  }
  return false;
};

server.get(new RegExp(/\/c\/.+\..+/), router.staticDirHandler(__dirname + "/../browser/", "/c/"));

server.get("/", function(req, res) {
  return renderTemplate("index.html");
});

// List the contacts
server.get(/\/contacts\/?$/, function(req, res) {
  var contentType = req.headers['content-type'] || "text/html", 
      directive = {
        ".contacts" : {
          "contact<-contacts" : {
            ".name" : "contact.name",
            ".email" : "contact.email",
            ".handle" : "contact.handle",
            ".homepage" : "contact.homepage",
          }
        }
      };
  return renderTemplate("contact/list.html", {contacts: datastore.contacts}, directive, contentType);
});

// Get a contact 
server.get(/\/contacts\/([^\/]+)\/?$/, function(req, res, contact) {
  var contentType = req.headers['content-type'] || "text/html", 
      directive = {
        ".name" : "name",
        ".email" : "email",
        ".handle" : "handle",
        ".homepage" : "homepage",
      },
      data = findContact(contact);

  if (data) {
    return renderTemplate("contact/view.html", data, directive, contentType);
  } else {
    res.writeHead(404);
    return renderTemplate("error.html");
  }
});

server.listen(port);