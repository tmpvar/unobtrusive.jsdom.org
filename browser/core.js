(function($) {
  var 
    cacheTemplates = function(json) {
  }
  
  
  $.ajax({
    url      : '/templates',
    dataType : 'json',
    success  : function() {
      
    },
    error    : function(text) {
      $('.fatalError').show().text('Could not contact template service');
    }
  });
  
  
  
  
}(jQuery));

  