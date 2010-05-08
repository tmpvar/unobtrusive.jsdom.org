/*
  This is a simple rest service that handles contact list manipulation.

  Templating is unobtrusive which means with or without js on the browser
  this example will still work.  js on the browser certainly helps performance though!
*/

// Add server/lib to the search path
require.paths.unshift(__dirname + "/lib");
require.paths.unshift(__dirname + "/../browser/");

var port = 10017;
    sys = require("sys"),
    dom = require("jsdom/lib/level1/core").dom.level1.core,
    fs = require("fs"),
    router = require("node-router/lib/node-router"),
    server = router.getServer();
    
var window = global.window = require("jsdom/lib/browser").windowAugmentation(dom);
var document = global.document = global.window.document;
var location = global.location = global.window.location;
var window = global;
var navigator = global.navigator = { userAgent: "node-js" };

// TODO: move into level 2
global.window.document.compareDocumentPosition = function() {};
dom.Node.prototype.addEventListener = 
            window.addEventListener = 
   window.document.addEventListener = function() {};

eval(fs.readFileSync(__dirname + "/../browser/jquery.js"));
eval(fs.readFileSync(__dirname + "/../browser/pure.js"));

server.get(new RegExp(/\/c\/.+\..+/), router.staticDirHandler(__dirname + "/../browser/", "/c/"));

server.get("/", function(req, res) {
  
  return "";
});

// Get a contact 
server.get(new RegExp(/\/contact\/[\d]+/), function(req, res) {
  
  return "";
});

server.listen(port);
