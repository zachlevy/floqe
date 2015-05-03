angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

// Tags Search Screen
.controller('TagsSearchController', function($scope, $state, tagsFactory, allTags, $timeout, appHelper) {
  // reset global allTags value to make sure they're up to date
  tagsFactory.refreshTags();

  // default tags
  $scope.searchTags = [];
  // get all tags
  $scope.suggestedTags = tagsFactory.suggested();
  //console.log($scope.suggestedTags);
  $scope.allTags = tagsFactory.all();

  // tagger
  $scope.maxTags = 2;
  $scope.taggerTags = $scope.suggestedTags;
  $scope.showTagName = function (tag) {
    return tag.name;
  };
  $scope.createTagName = function (name) {
    return {name: name};
  };

  // add a tag
  $scope.addTag = function(tagId) {
    if ($scope.searchTags.length < $scope.maxTags) {
      appHelper.addIfNotExists(tagsFactory.getTag(tagId), $scope.searchTags);
    }
  };

  // process search
  $scope.submitTags = function () {
    console.log("submitTags");
    console.log(searchTags);
    searchTagsText = tagsFactory.idsList($scope.searchTags);
    $state.go('app.tagsResults', {tag_ids: searchTagsText});
  };
})

// Tags Search Results Screen
.controller('TagsResultsController', function($scope, $state, $stateParams, tagsFactory, usersFactory, post_api_search, current_user, allTags, $ionicSideMenuDelegate, appHelper) {
  tagsFactory.refreshTags(); // temp
  console.log('TagsResultsController');

  // init
  // hit API server for results
  users = post_api_search.result.users;
  searchedTags = post_api_search.result.tags;
  $scope.myDescription = post_api_search.result.me.description;
  $scope.me = current_user;
  $scope.tagNames = tagsFactory.namesList(searchedTags);
  $scope.users = users;

  // default filters
  $scope.filters = {};
  $scope.filters.proximity = 5;
  $scope.filters.ageMin = 18;
  $scope.filters.ageMax = 44;
  $scope.filters.male = true;
  $scope.filters.female = true;

  // by default, hide the filter list
  $scope.hideFilter = true;

  // handle add/hide filters button
  $scope.hideFilters = function () {
    $scope.hideFilter = true;
  };
  $scope.showFilters = function () {
    $scope.hideFilter = false;
  };

  // custom filter for age, proximity, gender
  $scope.filterUsers = function(user){
    if ($scope.showFilters) {
      return user.age >= $scope.filters.ageMin &&
      user.distance <= $scope.filters.proximity &&
      user.age <= $scope.filters.ageMax &&
      (
        (user.gender === 0 && $scope.filters.male) ||
        (user.gender === 1 && $scope.filters.female)
      )
      ;
    } else {
      return user;
    }
  };

  // swiping
  $scope.swipedUserIds = [];

  $scope.onSwipeRight = function(user_id) {
    console.log("Swiped Right");
    appHelper.addIfNotExists(user_id, $scope.swipedUserIds);
    // send to API 
    // implement
    console.log($scope.swipedUserIds);
    console.log($stateParams.search_id);
  };

  $scope.onSwipeLeft = function(user_id) {
    console.log("Swiped Left");
    appHelper.removeIfExists(user_id, $scope.swipedUserIds);
    // send to API 
    // implement
    console.log($scope.swipedUserIds);
    console.log($stateParams.search_id);
  };

  $scope.updateDescription = function() {
    console.log('updateDescription');
    // send to API
    // implement
    console.log($scope.myDescription);
  };
  
})

// Matches Screen
.controller('MatchesController', function($scope, $state, $stateParams, post_api_match_mine) {
  console.log('MatchesController');
  $scope.matches = post_api_match_mine.result;
  $scope.onMatchSelect = function(match_id){
    console.log('match selected');
    console.log(match_id);
  };
})

// Invite Matches Screen
.controller('MatchesInviteController', function($scope, $state, $stateParams, post_api_match_mine) {
  console.log('InviteMatchesController');
  $scope.matches = post_api_match_mine.result;
  
  // for match
  console.log();

  // swiping
  $scope.selectedMatchIds = [];

  // when match selected
  $scope.onMatchSelect = function(match_id){
    console.log('match selected');
    if ($scope.selectedMatchIds.indexOf(match_id) == -1) {
      $scope.selectedMatchIds.push(match_id);
    } else if ($scope.selectedMatchIds.indexOf(match_id) > -1) {
      $scope.selectedMatchIds.splice($scope.selectedMatchIds.indexOf(match_id), 1);
    }
    console.log($scope.selectedMatchIds);
  };

  // when invite button clicked
  $scope.onInvite = function(){
    // go back to convo screen
    console.log($stateParams.match_id);
    console.log($scope.selectedMatchIds);
    // send to API 
    // implement
  };
})

; // ends chaining