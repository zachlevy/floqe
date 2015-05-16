// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters', 'tagger', 'ui.slider', 'angularMoment'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
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
  .state('app.tagsSearch', {
    url: "/tags/search",
    views: {
      'menuContent': {
        templateUrl: "templates/tags_search.html",
        controller: 'TagsSearchController'
      }
    }
  })
  .state('app.tagsResults', {
    url: "/tags/results/{tag_ids}",
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
  .state('app.userEdit', {
    url: "/users/{user_id}/edit",
    views: {
      'menuContent': {
        templateUrl: "templates/users_edit.html",
        controller: 'UserEditController'
      }
    }
  })
  .state('app.createEvent', {
    url: "/events/new",
    views: {
      'menuContent': {
        templateUrl: "templates/events_new.html",
        controller: 'EventNewController'
      }
    }
  })

  // FLOQUE END

  ; // end chaining
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/events/new');
});
