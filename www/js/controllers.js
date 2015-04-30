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

// search screen
.controller('TagsSearchController', function($scope, $state, tagsFactory) {
  // default tags
  searchTags = [];
  updateSearch();
  // get all tags
  $scope.suggestedTags = tagsFactory.suggested();
  $scope.allTags = tagsFactory.all();

  // add a tag
  $scope.addTag = function(tagId) {
    var selectedTag = $scope.allTags.filter(function(tag) {
      return tag.id == tagId;
    });
    searchTags.push(selectedTag[0]);
    updateSearch();
  };

  // process search
  $scope.submitTags = function () {
    console.log("submitTags");
    console.log(searchTags);
    searchTagsText = tagsFactory.idsList(searchTags);
    $state.go('app.tagsResults', {tag_ids: searchTagsText});
  };

  // output the names of search tags
  function updateSearch() {
    console.log("updateSearch");
    $scope.search = [];
    angular.forEach(searchTags, function (value, key) {
      this.push(value.name);
    }, $scope.search);
  }

})

.controller('TagsResultsController', function($scope, $state, $stateParams, tagsFactory, post_api_search, current_user) {
  console.log('TagsResultsController');
  console.log($stateParams.tag_ids);
  searchedTags = [
    {
      "id" : 1,
      "name" : "Motor rallies"
    },
    {
      "id" : 2,
      "name" : "Motor"
    }
  ];
  $scope.me = current_user;
  $scope.tagNames = tagsFactory.namesList(searchedTags);
  users = post_api_search['result']['users'];
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
})



; // ends chaining