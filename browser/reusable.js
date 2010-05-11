/**********************
* Reusable javascript *
**********************/

(function(ns) {
  if (!ns.jsdom) {
    ns.jsdom = {};
  }

  // Pure Directives
  ns.jsdom.directives = {
    contacts : {
      ".contacts" : {
        "contact<-contacts" : {
          ".name" : "contact.name",
          ".name@href" : "/contacts/#{contact.handle}",
          ".email" : "contact.email",
          ".handle" : "contact.handle",
          ".website" : "contact.website",
        }
      }
    },
    contact : {
      ".name" : "name",
      ".email" : "email",
      ".handle" : "handle",
      ".website" : "website",
    },
  };

  // Rendering


})(this.window || exports);

