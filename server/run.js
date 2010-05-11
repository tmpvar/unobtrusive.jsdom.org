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
    PureScript   = fs.readFileSync(__dirname + "/../browser/pure.js"),
    reusable     = require(__dirname + "/../browser/reusable").jsdom;

// TODO: move into level 2
dom.Document.prototype.compareDocumentPosition = function() {};
dom.Node.prototype.addEventListener = function() {};

var datastore = JSON.parse(fs.readFileSync(__dirname + "/store.json")),
    templateCache = {};

var getTemplate = function(path) {
  if (!templateCache[path]) {
    try {
      var data = fs.readFileSync(__dirname + "/../template/" + path);
      templateCache[path] = data;
      return data;
    } catch (e) {
      return false;
    }
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

server.get(new RegExp(/\/c\/.+\..+/), router.staticDirHandler(__dirname + "/../browser/", "/c/"));

server.get(/\/templates\/(.+)/, function(req, res, template) {
  var templateData = getTemplate(template);
  if (templateData) {
    return templateData;
  } else {
    res.writeHead("404");
    return "";
  }
});

server.get("/", function(req, res) {
  return renderTemplate("index.html");
});

// List the contacts
server.get(/\/contacts\/?$/, function(req, res) {
  var contentType = req.headers['content-type'] || "text/html";

  return renderTemplate("contact/list.html",
                        {contacts: datastore.contacts},
                        reusable.directives.contacts,
                        contentType);
});

// Get a contact
server.get(/\/contacts\/([^\/]+)\/?$/, function(req, res, contact) {
  var contentType = req.headers['content-type'] || "text/html", 
      data = null;
  for (var i=0; i<datastore.contacts.length; i++) {
    if (datastore.contacts[i].handle && datastore.contacts[i].handle === contact) {
      data = datastore.contacts[i];
      break;
    }
  }

  if (data) {
    return renderTemplate("contact/view.html",
                          data,
                          reusable.directives.contact,
                          contentType);
  } else {
    res.writeHead(404);
    return renderTemplate("error.html");
  }
});

server.listen(port, "0.0.0.0");