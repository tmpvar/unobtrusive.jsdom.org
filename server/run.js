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
    server       = router.getServer(),
    jQueryScript = fs.readFileSync(__dirname + "/../browser/jquery.js"),
    PureScript   = fs.readFileSync(__dirname + "/../browser/pure.js");

// TODO: move into level 2
dom.Document.prototype.compareDocumentPosition = function() {};
dom.Node.prototype.addEventListener = function() {};

var templateToDom = function(path) {
  var data   = fs.readFileSync(__dirname + "/" + path),
      window = browser.windowAugmentation(dom);
  window.addEventListener = function() {};
  window.document.body.innerHTML = data;
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

// Cache all of the templates synchronously
var templates = {
  master    : templateToDom("template/master.html"),
  index     : templateToDom("template/index.html"), 
  error     : templateToDom("template/error.html"),
  contact   : {
    list   : templateToDom("template/contact/list.html"),
    view   : templateToDom("template/contact/view.html"),
    manage : templateToDom("template/contact/manage.html")
  }
}

server.get(new RegExp(/\/c\/.+\..+/), router.staticDirHandler(__dirname + "/../browser/", "/c/"));

server.get("/", function(req, res) {
  
  return "";
});

// Get a contact 
server.get(new RegExp(/\/contact\/[\d]+/), function(req, res) {
  
  return "";
});

server.listen(port);
