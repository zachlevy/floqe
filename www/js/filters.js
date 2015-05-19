angular.module('starter.filters', [])

// gender 1/0 to male or female
.filter('genderFilter', function() {
  return function(gender) {
    if (gender === 1) {
      return "Female";
    } else {
      return "Male";
    }
  };
})

// return human readable time format with start and end date
.filter('privateFilter', function() {
  return function(private) {
    if (private === true) {
      return "Private";
    } else {
      return "Public";
    }
  };
})

// return creator or admin for event user lists
.filter('adminFilter', function() {
  return function(admin) {
    if (admin === true) {
      return "Creator";
    } else {
      return "Member";
    }
  };
})

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

// chat filter, takes new lines and makes them <br/>s
.filter('nl2br', ['$filter',
  function($filter) {
    return function(data) {
      if (!data) return data;
      return data.replace(/\n\r?/g, '<br />');
    };
  }
])
// takes an array of tags and returns tags w/ relative % column_size widths
.filter('tagColumns', function() {
  return function (tags) {
    // get total chars
    total = 0;
    column_total = 0;
    angular.forEach(tags, function (tag, key) {
      total += tag.name.length;
    });
    // add the column size to the tag object
    angular.forEach(tags, function (tag, key) {
      column_size = Math.round(tag.name.length / total * 100);
      tag.column_size = column_size;
      column_total += column_size;
    });
    // catch empty array
    if (tags.length !== 0) {
      // catch if total not 100
      if (column_total < 100) {
        tags[0].column_size += 100 - column_total;
      } else if (column_total > 100) {
        tags[0].column_size -= abs(100 - column_total);
      }
    }
    return tags;
  };
})

; // end chaining