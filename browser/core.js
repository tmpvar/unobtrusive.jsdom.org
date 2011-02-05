(function($) {
  var 
    cacheTemplates = function(json) {
  };
  
  
  $.ajax({
    url      : '/templates',
    dataType : 'json',
    success  : function() {
      
    },
    error    : function(text) {
      $('.fatalError').show().text('Could not contact template service');
    }
  });
  
  $('form').live('submit', function() {
    var form = $(this), data = {};
    
    $(':input:not(type=submit)', form).each(function() {
      console.log($(this).attr('name'));
    });
    
    $.ajax({
      url  : el.attr('action'),
      type : el.attr('method'),
      //data : 
    });
    
    return false;
  });
  
  
  
  
}(jQuery));

  