var templates = exports.templates = {},
    pure      = require('pure').pure;

exports.templateSeed = "";

exports.register = function(name, doc, string, directive) {
  var frag = doc.createDocumentFragment();
  frag.innerHTML = string;
  
  templates[name] = {
    string    : string,
    directive : directive,
    document  : doc,
    fragment  : frag,
    toJSON    : function() {
      return {
        string    : this.string,
        directive : this.directive
      }
    }
  };

  // Keep the template seed up to date
  exports.templateSeed = JSON.stringify(templates);
};


exports.render = function(name, data) {
  if (!templates[name]) {
    throw new Error("template '" + name + "' is not registered");
  }
  var template = templates[name],
      frag     = template.fragment.cloneNode(true),
      $p        = template.document.parentWindow.$p;

  $p(frag).render(data, template.directive);
  
  return frag;
};