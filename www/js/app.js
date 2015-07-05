// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters', 'tagger', 'ui.slider', 'angularMoment'])

.run(function($ionicPlatform, $cordovaPush, appApi) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  
  // Push
	document.addEventListener("deviceready", onDeviceReady, false);
 
	function onDeviceReady(){
		config = { "senderID": "276536771992", }

		$cordovaPush.register(config).then(function(result) {
		  // Success
		  console.log('Registered!')
		}, function(err) {
		  // Error
		})
	
		$scope.$on('pushNotificationReceived', function (event, notification) {
		  switch(notification.event) {
			case 'registered':
			  if (notification.regid.length > 0 ) {
				alert(notification.regid)
				//alert('registration ID = ' + notification.regid);
				storeDeviceToken('android', notification.regid)
			  }
			  break;

			case 'message':
			  // this is the actual push notification. its format depends on the data model from the push server
			  alert('message = ' + notification.message + ' param = ' + notification.param);
			  break;
			case 'the_message':
			  // this is the actual push notification. its format depends on the data model from the push server
			  alert('message = ' + notification.message + ' param = ' + notification.param);
			  break;

			case 'error':
			  alert('GCM error = ' + notification.msg);
			  break;

			default:
			  alert('An unknown GCM event has occurred');
			  break;
		  }
		})
	}

	function storeDeviceToken(type,regid) {
        // Create a random userid to store with it
        var user = { user: 'user1', type: type, token: regid };
        alert("Post token for registered device with data " + JSON.stringify(user))
        appApi.post('gcm/subscribe', {'user' : user}).then(function(result) {
            alert("Token stored, device is successfully subscribed to receive push notifications." + data)
        }), function(err) {
		  // Error
		  alert('Error'+ err)
		}
    }
  
  
  
  
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  
  // FLOQE START
  .state('app.login', {
    url: '/fb/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/fb_login.html',
        controller: 'LoginController'
      }
    }
  })
  .state('app.tagsSearch', {
    url: '/tags/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/tags_search.html',
        controller: 'TagsSearchController'
      }
    }
  })
  .state('app.tagsResults', {
    url: "/tags/results/{search_id}",
    views: {
      'menuContent': {
        templateUrl: "templates/tags_results.html",
        controller: 'TagsResultsController'
      }
    }
  })
  .state('app.matches', {
    url: "/matches",
    views: {
      'menuContent': {
        templateUrl: "templates/matches.html",
        controller: 'MatchesController'
      }
    }
  })
  .state('app.matchesInvite', {
    url: "/matches/invite/{conversation_id}",
    views: {
      'menuContent': {
        templateUrl: "templates/matches_invite.html",
        controller: 'MatchesInviteController'
      }
    }
  })
  .state('app.conversation', {
    url: "/conversations/{conversation_id}",
    views: {
      'menuContent': {
        templateUrl: "templates/conversation.html",
        controller: 'ConversationController'
      }
    }
  })
  .state('app.conversationDetails', {
    url: "/conversations/{conversation_id}/details",
    views: {
      'menuContent': {
        templateUrl: "templates/conversation_details.html",
        controller: 'ConversationDetailsController'
      }
    }
  })
  .state('app.user', {
    url: "/users/{user_id}",
    views: {
      'menuContent': {
        templateUrl: "templates/user.html",
        controller: 'UserController'
      }
    }
  })
  .state('app.userEdit', {
    url: "/users/{user_id}/edit",
    views: {
      'menuContent': {
        templateUrl: "templates/users_edit.html",
        controller: 'UserEditController'
      }
    }
  })
  .state('app.editEvent', {
    url: "/events/edit/{event_id}",
    views: {
      'menuContent': {
        templateUrl: "templates/events_edit.html",
        controller: 'EventEditController'
      }
    }
  })
  .state('app.showEvent', {
    url: "/events/{event_id}",
    views: {
      'menuContent': {
        templateUrl: "templates/event.html",
        controller: 'EventShowController'
      }
    }
  })
  .state('app.eventList', {
    url: "/events",
    views: {
      'menuContent': {
        templateUrl: "templates/events.html",
        controller: 'EventsListController'
      }
    }
  })
  .state('app.inviteContacts', {
    url: "/contacts/invite/{event_id}",
    views: {
      'menuContent': {
        templateUrl: "templates/invite_contacts.html",
        controller: 'ContactsInviteController'
      }
    }
  })
  .state('app.getContacts', {
    url: "/contacts/get",
    views: {
      'menuContent': {
        templateUrl: "templates/invite_contacts.html",
        controller: 'GetContactsController'
      }
    }
  })
  .state('app.getGeo', {
    url: "/geo/get",
    views: {
      'menuContent': {
        templateUrl: "templates/get_geo.html",
        controller: 'GetGeoController'
      }
    }
  })
  .state('app.getPush', {
    url: "/push",
    views: {
      'menuContent': {
        templateUrl: "templates/push.html",
        controller: 'PushController'
      }
    }
  })

  // FLOQUE END

  ; // end chaining
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tags/search');
  //$urlRouterProvider.otherwise('/app');
});
