var firebaseUrl = "https://floqe.firebaseio.com";
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'starter.controllers', 'starter.services', 'starter.filters', 'tagger', 'ui.slider'])

.run(function($ionicPlatform, $rootScope, $location, Auth, $ionicLoading) {
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

    // firechat start
    // To Resolve Bug
    ionic.Platform.fullScreen();

    $rootScope.firebaseUrl = firebaseUrl;
    $rootScope.displayName = null;

    Auth.$onAuth(function (authData) {
      if (authData) {
        console.log("Logged in as:", authData.uid);
      } else {
        console.log("Logged out");
        $ionicLoading.hide();
        $location.path('/login');
      }
    });

    $rootScope.logout = function () {
      console.log("Logging out from the app");
      $ionicLoading.show({
        template: 'Logging Out...'
      });
      Auth.$unauth();
    };


    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $location.path("/login");
      }
    });
    // firechat end
  });
})

.config(function($stateProvider, $urlRouterProvider) {
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
    url: "/matches/invite/{match_id}",
    views: {
      'menuContent': {
        templateUrl: "templates/matches_invite.html",
        controller: 'MatchesInviteController'
      }
    }
  })
  // FLOQUE END

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  })

// firechat
// State to represent Login View
.state('login', {
  url: "/login",
  templateUrl: "templates/login.html",
  controller: 'LoginCtrl',
  resolve: {
    // controller will not be loaded until $waitForAuth resolves
    // Auth refers to our $firebaseAuth wrapper in the example above
    "currentAuth": ["Auth",
      function (Auth) {
        // $waitForAuth returns a promise so the resolve waits for it to complete
        return Auth.$waitForAuth();
      }
    ]
  }
})

// setup an abstract state for the tabs directive
.state('tab', {
  url: "/tab",
  abstract: true,
  templateUrl: "templates/tabs.html"
})

// Each tab has its own nav history stack:

.state('tab.rooms', {
  url: '/rooms',
  views: {
    'tab-rooms': {
      templateUrl: 'templates/tab-rooms.html',
      controller: 'RoomsCtrl'
    }
  },
  resolve: {
    // controller will not be loaded until $requireAuth resolves
    // Auth refers to our $firebaseAuth wrapper in the example above
    "currentAuth": ["Auth",
      function (Auth) {
        // $requireAuth returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return Auth.$requireAuth();
      }
    ]
  }
})

.state('tab.chat', {
  url: '/chat/:roomId',
  views: {
    'tab-chat': {
      templateUrl: 'templates/tab-chat.html',
      controller: 'ChatCtrl'
    }
  }
})


  ; // end chaining
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tags/search');
});
