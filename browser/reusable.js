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
          ".email" : "contact.email",
          ".handle" : "contact.handle",
          ".homepage" : "contact.homepage",
        }
      }
    },
    contact : {
      ".name" : "name",
      ".email" : "email",
      ".handle" : "handle",
      ".homepage" : "homepage",
    },
  };

  // Rendering


})(this.window || exports);

