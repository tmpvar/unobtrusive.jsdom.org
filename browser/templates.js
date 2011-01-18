window.cacheTemplates = function() {
  $.ajax({
    url      : '/templates',
    dataType : 'json',
    success  : function(data) {
      
    },
    error    : function(text) {
      
    }
  });
};