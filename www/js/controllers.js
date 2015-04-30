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
.controller('TagsController', function($scope, tagsFactory) {
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

.controller('TagsResultsController', function($scope, tagsFactory) {
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
  $scope.title = tagsFactory.namesList(searchedTags);
})



; // ends chaining