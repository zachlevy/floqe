angular.module('starter.services', [])

// any function related to accessing the api
.factory('current_user', function($rootScope){
	
	if ($rootScope.user == undefined) {
		$rootScope.user = {}
		var user = {}
	}

	return {
		"id" : 123,
		"name" : 'Test',
		"photo" : '',
		"gender" : '1',
		"age" : '19',
		"birthdate" : "1991-06-17T01:11:21Z",
		"interests" : [
		  {
			"id" : 1,
			"name" : "Motor rallies"
		  },
		  {
			"id" : 2,
			"name" : "Motor"
		  },
		]
	}
})
.factory('appApi', function ($http, $q, baseUrl) {
  // data is an object like {'foo':'bar'}
  // endpoint is a string
  return {
    post: function(endpoint, data) {
      console.log('sending post from appApi');
      console.log(baseUrl + endpoint);
      console.log(data);
      // promise
      var deferred = $q.defer();

      $http.post(baseUrl + endpoint, data)
      .success(function(res, status) {
        if (res.success === true) {
          // success
          console.log('http success');
          if ( res.hasOwnProperty('result')) {
            deferred.resolve(res.result);
          } else {
            deferred.resolve(true);
          }
          
        } else if (res.success === false) {
          // bad params
          console.log('http bad server request');
          console.log(res.result);
          deferred.resolve(res.result);
        } else {
          // server error
          console.log('http server error');
          console.log(res.result);
          deferred.resolve(res.result);
        }
      }).error(function(res, status) {
        // http error
        console.log('http error');
        console.log(status);
        console.log(res);
        deferred.reject(res);
      });
      return deferred.promise;
    },
    put: function(endpoint, data) {
      console.log('sending post from appApi');
      console.log(baseUrl + endpoint);
      console.log(data);
      // promise
      var deferred = $q.defer();

      $http.put(baseUrl + endpoint, data)
      .success(function(res, status) {
        if (res.success === true) {
          // success
          console.log('http success');
          if ( res.hasOwnProperty('result')) {
            deferred.resolve(res.result);
          } else {
            deferred.resolve(true);
          }
          
        } else if (res.success === false) {
          // bad params
          console.log('http bad server request');
          console.log(res.result);
          deferred.resolve(res.result);
        } else {
          // server error
          console.log('http server error');
          console.log(res.result);
          deferred.resolve(res.result);
        }
      }).error(function(res, status) {
        // http error
        console.log('http error');
        console.log(status);
        console.log(res);
        deferred.reject(res);
      });
      return deferred.promise;
    },
    get: function(endpoint) {
      // promise
      var deferred = $q.defer();

      $http.get(baseUrl + endpoint)
      .success(function(res, status) {
        console.log(status);
        if (res.success === true) {
          // success
          console.log('http success');
          deferred.resolve(res.result);
        } else if (res.success === false) {
          // bad params
          console.log('http bad server request');
          console.log(res.result);
          deferred.resolve(res.result);
        } else {
          // server error
          console.log('http server error');
          console.log(res.result);
          deferred.resolve(res);
        }
      }).error(function(res, status, msg) {
        // http error
        console.log('http error');
        deferred.reject(msg);
      });
      return deferred.promise;
    }
  };
})

// any function related to users
.factory('usersFactory', function ($http){
  // factory vars

  // factory functions
  return {
    getUser: function (id, users) {
      var results = users.filter(function(user) {
        return user.id == id;
      });
      return results[0];
    },
    // send a swipe to API server
    sendSwipe: function (user_id) {

    }
  };
})

// any function related to tags
.factory('tagsFactory', function($http, allTags){
  // factory functions
  return {
    refreshTags: function () {
      allTags.tags = this.all();
    },
    // returns tag objects based on ids string like "1,2,3,4"
    // requires its own factory because super this unaccessible
    tagsFromIdsList: function (tag_ids, tagsFactory) {
      tags = [];
      tag_ids.split(',').map(function(tag_id) {
        tags.push(tagsFactory.getTag(tag_id));
      });
      return tags;
    },
    // get tag object from tag id
    getTag: function (id) {
      var results = allTags.tags.filter(function(tag) {
        return tag.id == id;
      });
      return results[0];
    },
    // get tag object from tag id
    getTagFromTags: function (id, tags) {
      var results = tags.filter(function(tag) {
        return tag.id == id;
      });
      return results[0];
    },
    // returns tag ids like "1,2,3,4" from tag objects
    idsList: function (tags) {
      text = [];
      angular.forEach(tags, function (value, key) {
        this.push(value.id);
      }, text);
      return text.join(',');
    },
    // returns tag ids like [1,2,3,4] from tag objects
    idsArray: function (tags) {
      ids_array = [];
      angular.forEach(tags, function (value, key) {
        this.push(value.id);
      }, ids_array);
      return ids_array;
    },
    all: function() {
      return [
        {
          "id" : 1,
          "name" : "Motor rallies"
        },
        {
          "id" : 2,
          "name" : "Motor"
        },
        {
          "id" : 3,
          "name" : "Volleyball"
        },
        {
          "id" : 4,
          "name" : "Horses"
        },
        {
          "id" : 5,
          "name" : "Dog Walking"
        }
      ];
    }
  };
})

// generic application helper for common js functions
.factory('appHelper', function(){
  // factory vars

  // factory functions
  return {
    // array add
    addIfNotExists: function (item, array) {
      if (array.indexOf(item) == -1) {
        array.push(item);
      }
    },
    // array remove
    removeIfExists: function (item, array) {
      var index = array.indexOf(item);
      if (index > -1) {
        array.splice(index, 1);
      }
    },
    // returns names from objects like "basketball, hockey"
    // from objects like [{name:"basketball"},{name:"hockey"}]
    namesList: function(tags) {
      text = [];
      angular.forEach(tags, function (value, key) {
      this.push(value.name);
      }, text);
      return text.join(', ');
    },
  };
})

// global helper values
// API base url
.value(
  'baseUrl',
  //'http://192.168.0.11:8100/api/v1/'
  //'http://127.0.0.1:5000/api/v1/'
  'http://c34b8fa2.ngrok.io/api/v1/'
  //'http://backend-env-36mjm8eh3x.elasticbeanstalk.com/api/v1/'
)
// all tags preloaded, can be refreshed with tagsFactory.refreshTags()
.value(
  'allTags',
  {
    'tags' : []
  }
)

// development helpers
// current_user
.value(
  'current_user1',
  {
    "id" : 2,
    "name" : "Boaz",
    "photo" : "http://placehold.it/100x100",
    "gender" : 1,
    "age" : 23,
    "birthdate" : "1991-06-17T01:11:21Z",
    "interests" : [
      {
        "id" : 1,
        "name" : "Motor rallies"
      },
      {
        "id" : 2,
        "name" : "Motor"
      },
    ]
  }
)
.value(
  'post_api_user',
  {
    "id" : 2,
    "name" : "Boaz",
    "photo" : "http://placehold.it/100x100",
    "distance" : 5.2,
    "gender" : 0,
    "age" : 23,
    "birthdate" : "1991-06-17T01:11:21Z",
    "interests" : [
      {
        "id" : 1,
        "name" : "Motor rallies"
      },
      {
        "id" : 2,
        "name" : "Motor"
      },
    ]
  }
)

; // end chaining