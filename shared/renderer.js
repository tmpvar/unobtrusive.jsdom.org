
var templates = {};

exports.register = function(name, doc, string, directive) {
  var frag = doc.createDocumentFragment();
  frag.innerHTML = string;
  
  templates[name] = {
    string    : string,
    document  : doc,
    fragment  : frag,
    directive : directive
  };
};

exports.render = function(name, data) {
  if (!templates[name]) {
    throw new Error("template '" + name + "' is not registered");
  }

  var frag = templates[name].fragment.cloneNode(true);
  // TODO: pure
  return frag;
};