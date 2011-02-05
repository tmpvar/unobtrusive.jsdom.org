(function(exports) {
  exports.templateDirectives = {
    'contact/view' : {
      "span.name"    : "name",
      "span.handle"  : "handle",
      "span.email"   : "email",
      "span.website" : "website"
    },
    'contact/add'  : {
    },
    'contact/manage' : {
      "p.name input"    : "name",
      "p.handle input"  : "handle",
      "p.email input"   : "email",
      "p.website input" : "website"
      
    }
  };
}((typeof exports === 'undefined') ? window : exports));