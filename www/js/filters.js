angular.module('starter.filters', [])

// get user names csv from user objects array
.filter('namesFilter', function() {
  return function(objects) {
    text = [];
    angular.forEach(objects, function (object, key) {
      this.push(object.name);
    }, text);
    return text.join(', ');
  };
})

// chat filter
.filter('nl2br', ['$filter',
  function($filter) {
    return function(data) {
      if (!data) return data;
      return data.replace(/\n\r?/g, '<br />');
    };
  }
])
; // end chaining