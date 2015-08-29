angular.module('starter.services', [])

// any function related to accessing the api
.factory('eventListening', function ($window, $state, $ionicPopup, eventNotification, current_user) {
	$rootScope.$on("newMatch", eventNotification.match())
})
.factory('eventNotification', function ($window, $state, $ionicPopup, current_user) {
	return {
        match: function () {
          // increment notification
          $rootScope.badge += 1;
          
			$ionicPopup.show({
			  title: 'Match', 
			  template: '', // String (optional). The html template to place in the popup body.
			  subTitle: 'You got a new match!',
			  buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
				text: 'Continue',
				type: 'button-default',
				onTap: function(e) {}
			  }, {
				text: 'View Matches',
				type: 'button-positive',
				onTap: function(e) {
				  // Returning a value will cause the promise to resolve with the given value.
				  $state.go('app.matches');
				}
			  }]
			})
		}
	}
})
.factory('PushProcessingService', function ($window, $ionicPopup, appApi, current_user) {
    function onDeviceReady() {
        var pushNotification = window.plugins.pushNotification;
        if (ionic.Platform.isAndroid()) {
            pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {'senderID': '276536771992', 'ecb': 'onNotificationGCM'});
        } else if (ionic.Platform.isIOS()) {
            var config = {
                "badge": "true",
                "sound": "true",
                "alert": "true",
                "ecb": "pushCallbacks.onNotificationAPN"
            };
            pushNotification.register(gcmSuccessHandler, gcmErrorHandler, config);
        }

        var addCallback = function addCallback(key, callback){
            if(window.pushCallbacks == undefined){
                window.pushCallbacks = {};
            }
            window.pushCallbacks[key] = callback({registered:true});
        }
    }
	function gcmSuccessHandler(result) {
        if (ionic.Platform.isIOS()) {
            var mobileType = "ios";
            var mobileRegisterId = result;
            // Save the ios mobile register Id in your server database
            // call the following method on callback of save
                addCallback("onNotificationAPN", onNotificationAPN);            
        }
    }

    function gcmErrorHandler(error) {
        alert("Error while register push notification : " + error);
    }
	
	return {
        initialize: function () {
            document.addEventListener('deviceready', onDeviceReady, false);
        },
        registerID: function (id) {
            var mobileType = "android";
			appApi.post('gcm/subscribe', { 'user_id': current_user.id, 'type': mobileType, 'token': id }).then(function(result) {
				console.log("Token stored, device is successfully subscribed to receive push notifications." + result)
			})
        },
        showNotificationGCM: function (event) {
            $ionicPopup.alert({
                title: "Spry Notification",
                subTitle: event.payload.type,
                template: event.payload.message
            });
        },
        showNotificationAPN: function (event) {
            $ionicPopup.alert({
                title: event.messageFrom + "..",
                subTitle: event.alert,
                template: event.body
            });
        }
    }

})
.factory('current_user', function(){

	user = this

	return {
		"id" : user.id,
		"name" : user.name,
		"photo" : '',
		"gender" : '1',
		"age" : user.age,
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
          console.log(baseUrl + endpoint);
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
          console.log(baseUrl + endpoint);
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
          console.log(baseUrl + endpoint);
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
  'http://46f3f2b1.ngrok.io/api/v1/'
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

onNotificationAPN = function(event) {
    if (!event.registered) {
        var elem = angular.element(document.querySelector('[ng-app]'));
        var injector = elem.injector();
        var myService = injector.get('PushProcessingService');
        myService.showNotificationAPN(event);
    } else {
        console.log("Registered successfully notification..");
    }
}

function onNotificationGCM(e) {
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                var elem = angular.element(document.querySelector('[ng-app]'));
                var injector = elem.injector();
                var myService = injector.get('PushProcessingService'); //injects factory
				myService.registerID(e.regid);				
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            var elem = angular.element(document.querySelector('[ng-app]'));
            var injector = elem.injector();
            //var myService = injector.get('PushProcessingService');
            //myService.showNotificationGCM(e);
            break;

        case 'error':
            alert('<li>ERROR :' + e.msg + '</li>');
            break;

        default:
            alert('<li>Unknown, an event was received and we do not know what it is.</li>');
            break;
    }
}

