angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $rootScope, $state, $ionicModal, $timeout, $cordovaFacebook, appApi, current_user) {
	$scope.tags = [{"name":"None", "id":0}] 
	function load(){
		appApi.post('tags/me',{'user_id':current_user.id}).then(function(resp) {
			if (resp !== undefined){
				$scope.tags = resp
			}
		})
		$scope.search_id = 0
		appApi.post('search/last',{'user_id':current_user.id}).then(function(resp) {
			if (resp !== undefined){
				$scope.search_id = resp.search_id
			}
		})
		$scope.viewSearch = function(){
			if ($scope.search_id != 0){
				$state.go('app.tagsResults', {search_id: $scope.search_id});
			}
		}
	}
	load();
	
	$scope.$on('search:updated', function(event) {
        load();
    });
})

// Edit User Screen
.controller('LoginController', function ($cordovaFacebook,$ionicLoading, PushProcessingService, $scope, $rootScope, $interval, $state, $stateParams, $timeout, current_user, appApi) {
  console.log('LoginController');
  
    $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="ripple"></ion-spinner>'
		});
	  };
	  $scope.hide = function(){
		$ionicLoading.hide();
	  };
  
  
  $scope.loginData = {};
	$scope.doLogin = function() {
		$scope.show();
		appApi.post('login',{'psw_object':$scope.loginData}).then(function(resp) {
			if (resp.errors === undefined) {
				current_user.id = resp.id
				current_user.gender = resp.gender
				current_user.age = resp.age
				current_user.name = resp.name
				current_user.photo = resp.photo
				current_user.photo = resp.photo

				PushProcessingService.initialize();
				$scope.hide();
				$state.go('app.tagsSearch');
			}
			else {
				$scope.hide();
				alert(resp.errors.error)
			}
		})
		$timeout(function() {
		  //$scope.closeLogin();
		}, 1000);
	};
	
	$scope.fbLogin = function () {
		$scope.show();
		if ( ionic.Platform.isAndroid() ||  ionic.Platform.isIOS()) {
			$cordovaFacebook.login(["public_profile", "email"])
			.then(function(success) {
			  $cordovaFacebook.api("me")
			  .then(function(success) {
				$scope.response = success;
				appApi.post('login',{'fb_object':success}).then(function(result) {
					current_user.id = result.id
					current_user.gender = result.gender
					current_user.age = result.age
					current_user.name = result.name
					current_user.photo = result.photo
					
					PushProcessingService.initialize();
					$scope.hide();
					$state.go('app.tagsSearch');
				})
				
			  }, function (error) {
				  $scope.hide();
				alert('Facebook Login Error 1');
				// error
			  });
			}, function (error) {
				$scope.hide();
			  alert('Facebook Login Error 2');
			});
		}
		else {
			alert('browser')
			current_user.id = 1
			current_user.gender = 1
			current_user.age = 25
			current_user.name = 'shazam'
			current_user.photo = 21323
			$scope.response = current_user
			//$scope.modal.hide()
		}
	};
})

// Edit User Screen
.controller('UserEditController', function ($scope, $rootScope, $ionicLoading, $interval, $state, $stateParams, $timeout, tagsFactory, current_user, appApi) {
  console.log("UserEditController");
  
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="ripple"></ion-spinner>'
		});
	  };
	  $scope.hide = function(){
		$ionicLoading.hide();
	  };
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  // START TAGS SEARCH
  // prep the tags object
  $scope.tags = {};
  // tags that the user has selected
  $scope.tags.selected = [];
  // max number of tags teh user can serach
  $scope.tags.max = 3;
  $scope.tags.search = {};
  $scope.tags.search.name = "";

  $scope.show();
  // get all tags
  appApi.get('tags').then(function(result) {
    $scope.tags.all = result;
    console.log('$scope.tags.all');
    console.log($scope.tags.all);

    $scope.processedTags = processedTags();
  });

  // get all suggested tags
  appApi.post('tags', {user_id : current_user.id}).then(function(result) {
    $scope.tags.suggested = result;
    console.log('$scope.tags.suggested');
    console.log($scope.tags.suggested);
  });
  
  $scope.hide();
  
  // when search button is pressed
  $scope.onSearch = function () {
    console.log('onSearch');
    console.log($scope.tags.selected);
    console.log("submitTags");

    $scope.tags.fullSelected = [];
    angular.forEach($scope.tags.selected, function (tag_id, key) {
      $scope.tags.fullSelected.push(tagsFactory.getTagFromTags(tag_id, $scope.tags.all));
    });
    console.log($scope.tags.fullSelected);
    appApi.post('search', {user_id : current_user.id, 'tags' : $scope.tags.fullSelected}).then(function(result) {
      console.log(result.search_id);
      $state.go('app.tagsResults', {search_id: result.search_id});
    });
  };

  // when a tag is selected
  $scope.onTagSelect = function(tag_id) {
    if ($scope.tags.selected.indexOf(tag_id) == -1) {
      if ($scope.tags.selected.length < $scope.tags.max) {
        $scope.tags.selected.push(tag_id);
      }
    } else if ($scope.tags.selected.indexOf(tag_id) > -1) {
      $scope.tags.selected.splice($scope.tags.selected.indexOf(tag_id), 1);
    }
    // $scope.tags.selected.push(tag_id);
    console.log('tagsFactory.getTag(tag_id)');
    console.log(tagsFactory.getTagFromTags(tag_id, $scope.tags.all));
    console.log('$scope.tags.selected');
    console.log($scope.tags.selected);
  };

  // watch for the search field to be updated to re-run the tag processor
  $scope.$watch('tags.search.name', function () {
    console.log('watched tags.search.name');
    $scope.processedTags = processedTags();
  });
  
  function processedTags () {
    numRows = 3;
    rowTags = [[]];
    angular.forEach($scope.tags.all, function(tag, index) {
      // if the tag is selected or it contains the search string
      console.log('name: ' + tag.name);
      if (
        $scope.tags.selected.indexOf(tag.id) !== -1 ||
        (angular.lowercase(tag.name).indexOf(angular.lowercase($scope.tags.search.name)) != -1)
      ) {
        if ((rowTags[rowTags.length - 1].length) % numRows === 0) {
          // push a new row
          rowTags.push([]);
        }
        // push the tag into the last row
        rowTags[rowTags.length - 1].push(tag);
      }
    });
    return rowTags;
  }
  // END TAGS SEARCH

  // photo upload
  $scope.changePhoto = function () {
    uploadcare.openDialog().done(function(file) {
      file.promise().done(function(fileInfo) {
        $scope.user.photo = fileInfo.cdnUrl;
        $scope.$apply();
      });
    });
  };

  // $scope.user = current_user;
  appApi.post('user', {user_id : current_user.id}).then(function(result) {
    $scope.user = result;
    $scope.user.user_id = $scope.user.id;
     // birthdate
    // convert from date string to js date object
    $scope.user.birthdate = new Date($scope.user.birthdate);

    // tags
    angular.forEach(result.interests, function(tag, index) {
      $scope.tags.selected.push(tag.id);
    });

    // gender
    // change user object gender into radio button
    if ($scope.user.gender === 0) {
      $scope.user.gender = {};
      $scope.user.gender.male = true;
    } else {
      $scope.user.gender = {};
      $scope.user.gender.male = false;
    }
    $scope.user.gender.female = !$scope.user.gender.male;
  });



  $scope.onSelectMale = function () {
    console.log('onSelectMale');
    $scope.user.gender.male = true;
    $scope.user.gender.female = false;
  };
  $scope.onSelectFemale = function () {
    console.log('onSelectFemale');
    $scope.user.gender.male = false;
    $scope.user.gender.female = true;
  };

  // submit
  // implement
  $scope.onSubmit = function () {
    // tags
    $scope.user.interests = [];
    angular.forEach($scope.tags.selected, function (tag_id, key) {
      $scope.user.interests.push(tagsFactory.getTagFromTags(tag_id, $scope.tags.all));
    });

    // change gender radio buttons into user object
    if ($scope.user.gender.male === true) {
      $scope.user.gender = 1;
    } else {
      $scope.user.gender = 0;
    }
    // remove extra data
    angular.forEach($scope.user.interests, function (tag, key) {
      delete tag.$$hashKey;
    });
    // print
    console.log($scope.user.user_id);
    console.log($scope.user.name);
    console.log($scope.user.birthdate);
    console.log($scope.user.gender);
    console.log($scope.user.interests);
    console.log($scope.user.photo);
    // put to api
    appApi.put('user', {
      user_id : $scope.user.user_id,
      name : $scope.user.name,
      photo : $scope.user.photo,
      gender : $scope.user.gender,
      birthdate : $scope.user.birthdate,
      interests : $scope.user.interests
    }).then(function (result) {
      if (result === true) {
        $state.go('app.tagsSearch');
      }
    });
  };
})

// view/show user
.controller('UserController', function ($scope, $rootScope, $interval, $state, $stateParams, $timeout, tagsFactory, current_user, appApi, post_api_user) {
  console.log("UserController");
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  //$scope.user = post_api_user;
  appApi.post('user', {user_id : $stateParams.user_id}).then(function(result) {
    $scope.user = result;
  });

})

// New/Edit Event Screen
.controller('EventEditController', function ($scope, $window,$rootScope, $interval, $state, $stateParams, $timeout, $ionicPopup, $ionicNavBarDelegate, tagsFactory, current_user, appApi) {
  console.log("EventEditController");
  
	if (current_user.id == undefined) {	
		//$state.go('app.tagsSearch',{},{reload: true}); 
		$window.location.href = '#/app/tags/search'
	}
  
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  // START TAGS SEARCH
  // prep the tags object
  $scope.tags = {};
  // tags that the user has selected
  $scope.tags.selected = [];
  // max number of tags teh user can serach
  $scope.tags.max = 3;
  $scope.tags.search = {};
  $scope.tags.search.name = "";

  // get all tags
  appApi.get('tags').then(function(result) {
    $scope.tags.all = result;
    console.log('$scope.tags.all');
    console.log($scope.tags.all);

    $scope.processedTags = processedTags();
  });

  // get all suggested tags
  appApi.post('tags', {user_id : current_user.id}).then(function(result) {
    $scope.tags.suggested = result;
    console.log('$scope.tags.suggested');
    console.log($scope.tags.suggested);
  });

  // when search button is pressed
  $scope.onSearch = function () {
    console.log('onSearch');
    console.log($scope.tags.selected);
    console.log("submitTags");

    $scope.tags.fullSelected = [];
    angular.forEach($scope.tags.selected, function (tag_id, key) {
      $scope.tags.fullSelected.push(tagsFactory.getTagFromTags(tag_id, $scope.tags.all));
    });
    console.log($scope.tags.fullSelected);
    appApi.post('search', {user_id : current_user.id, 'tags' : $scope.tags.fullSelected}).then(function(result) {
      console.log(result.search_id);
      $state.go('app.tagsResults', {search_id: result.search_id});
    });
  };

  // when a tag is selected
  $scope.onTagSelect = function(tag_id) {
    if ($scope.tags.selected.indexOf(tag_id) == -1) {
      if ($scope.tags.selected.length < $scope.tags.max) {
        $scope.tags.selected.push(tag_id);
      }
    } else if ($scope.tags.selected.indexOf(tag_id) > -1) {
      $scope.tags.selected.splice($scope.tags.selected.indexOf(tag_id), 1);
    }
    // $scope.tags.selected.push(tag_id);
    console.log('tagsFactory.getTag(tag_id)');
    console.log(tagsFactory.getTagFromTags(tag_id, $scope.tags.all));
    console.log('$scope.tags.selected');
    console.log($scope.tags.selected);
  };

  // watch for the search field to be updated to re-run the tag processor
  $scope.$watch('tags.search.name', function () {
    console.log('watched tags.search.name');
    $scope.processedTags = processedTags();
  });
  
  function processedTags () {
    numRows = 3;
    rowTags = [[]];
    angular.forEach($scope.tags.all, function(tag, index) {
      // if the tag is selected or it contains the search string
      console.log('name: ' + tag.name);
      if (
        $scope.tags.selected.indexOf(tag.id) !== -1 ||
        (angular.lowercase(tag.name).indexOf(angular.lowercase($scope.tags.search.name)) != -1)
      ) {
        if ((rowTags[rowTags.length - 1].length) % numRows === 0) {
          // push a new row
          rowTags.push([]);
        }
        // push the tag into the last row
        rowTags[rowTags.length - 1].push(tag);
      }
    });
    return rowTags;
  }
  // END TAGS SEARCH

  if ($stateParams.event_id === "") {
    // if its a new event
    $ionicNavBarDelegate.title("New Event");
    $scope.event = {};
    // times
    $scope.event.start = null;
    $scope.event.end = null;
    today = new Date((new Date()).toDateString()); // hacky

    // default to today's date
    $scope.event.start = {};
    $scope.event.end = {};
    $scope.event.start.date = today; // new Date();
    $scope.event.start.time = today; // new Date();
    $scope.event.end.date = today; // new Date();
    $scope.event.end.time = today; // new Date();
    // fills in empty info
    $scope.event.tags = [];
	$scope.event.private = false
	$scope.event.location = ''
  } else {
    // its an existing event
    $ionicNavBarDelegate.title("Edit event");
    // temp
    appApi.post('event', {user_id : current_user.id, event_id : parseInt($stateParams.event_id)}).then(function(result) {
      console.log('post event');
      // tags
      angular.forEach(result.tags, function(tag, index) {
        $scope.tags.selected.push(tag.id);
      });

      $scope.event = result;

      // build date objects from api
      start = new Date($scope.event.start);
      end = new Date($scope.event.end);
      // break down dates in scope between date and time for pickers
      $scope.event.start = {};
      $scope.event.end = {};
      $scope.event.start.date = start;
      $scope.event.start.time = start;
      $scope.event.end.date = end;
      $scope.event.end.time = end;
    });
  }
  // temp
  $scope.allTags = tagsFactory.all();

  // submit
  $scope.onSubmit = function () {
    // tags
    $scope.event.tags = [];
    angular.forEach($scope.tags.selected, function (tag_id, key) {
      $scope.event.tags.push(tagsFactory.getTagFromTags(tag_id, $scope.tags.all));
    });
	
    // rebuild dates from the separate date and time pickers
    $scope.event.start = new Date(
      $scope.event.start.date.getFullYear(),
      $scope.event.start.date.getMonth(),
      $scope.event.start.date.getDay(),
      $scope.event.start.time.getHours(),
      $scope.event.start.time.getMinutes()
    );
	if ($scope.event.end.date != undefined) {
		$scope.event.end = new Date(
		  $scope.event.end.date.getFullYear(),
		  $scope.event.end.date.getMonth(),
		  $scope.event.end.date.getDay(),
		  $scope.event.end.time.getHours(),
		  $scope.event.end.time.getMinutes()
		);
	}

    // strip tags of extra param
    angular.forEach($scope.event.tags, function (tag, key) {
      delete tag.$$hashKey;
    });

    // send to api
    // implement
	var event_info = {};
	event_info.user_id = current_user.id,
    event_info.event_id = $stateParams.event_id,
    event_info.name = $scope.event.name,
    event_info.start = $scope.event.start,
    event_info.end = $scope.event.end,
    event_info.location = $scope.event.location,
    event_info.tags = $scope.event.tags,
    event_info.private = $scope.event.private

	console.log(event_info)
	console.log('User id:',current_user.id)
	
	if ($scope.event.name == "" || $scope.event.name == undefined ) {
		$ionicPopup.alert({
			 title: 'Problemo',
			 template: 'Empty event name!'
		});
	}
	else if ($scope.event.end == undefined || $scope.event.start == undefined) {
		$ionicPopup.alert({
			 title: 'Problemo',
			 template: 'Empty date fields!'
		});
	}
	else {
		appApi.put('event', event_info ).then(function(result) {
		  if (result === false) {
			console.log(result)
			$ionicPopup.alert({
			title: 'Problemo',
			template: 'There was an error somewhere!'
			}); 
		  }
		  else {
			console.log('updated event', result);
			$state.go('app.showEvent', {'event_id' : result.event_id});
			//$state.go('app.showEvent', {'event_id' : $stateParams.event_id});
		  }
		});
	}
  };
})
// Show Event Screen
.controller('EventShowController', function ($scope, $rootScope, $interval, $state, $stateParams, $timeout, $ionicPopup, tagsFactory, usersFactory, current_user, appApi) {
  console.log('EventShowController');

  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  appApi.post('event', {event_id : $stateParams.event_id, user_id : current_user.id}).then(function(result) {
    $scope.event = result;
  });

  $scope.current_user = current_user;

  // admins removing user from group
  $scope.onRemoveUser = function (target_user_id) {
    console.log('onRemoveUser: ' + target_user_id);
    $scope.confirmRemoveUser(target_user_id);
  };

  $scope.onJoinEvent = function () {
    console.log('onJoinEvent');
    // send to api
    appApi.post('event/join', {user_id : current_user.id, event_id : $stateParams.event_id, join : true}).then(function(result) {
      if (result === true) {
        console.log('joined event');
        $scope.event.me.joined = true;
      }
      // $state.go('app.eventList');
    });
  };

  $scope.onLeaveEvent = function () {
    console.log('onLeaveEvent');
    // send to api
    appApi.post('event/join', {user_id : current_user.id, event_id : $stateParams.event_id, join : false}).then(function(result) {
      if (result === true) {
        console.log('removed from event');
        $scope.event.me.joined = false;
      }
      $state.go('app.eventList');
    });
  };

  $scope.onChat = function () {
    console.log('onChat: ' + $scope.event.conversation_id);
    $state.go('app.conversation', {'conversation_id': $scope.event.conversation_id});
  };

  // popup for admins removing users from event
  $scope.confirmRemoveUser = function(target_user_id) {
    var confirmRemoveUserPopup = $ionicPopup.confirm({
      title: 'Remove User',
      template: 'Are you sure you want to remove ' + usersFactory.getUser(target_user_id, $scope.event.users).name + ' from the conversation?'
    });
    confirmRemoveUserPopup.then(function(res) {
      if(res) {
        console.log('confirmed onRemoveUser');
        // send to API
        appApi.post('event/join', {user_id : target_user_id, event_id : $stateParams.event_id, join : false}).then(function(result) {
          if (result === true) {
            console.log('removed from event');
          }
          appApi.post('event', {event_id : $stateParams.event_id, user_id : current_user.id}).then(function(result) {
            $scope.event = result;
          });
        });
      } else {
        console.log('cancelled onRemoveUser');
      }
    });
  };

  // inviting contacts from contact book
  $scope.onInviteContacts = function () {
    console.log('onInviteContacts');
    console.log('$stateParams.event_id: ' + $stateParams.event_id);
    $state.go('app.inviteContacts', {'event_id' : $stateParams.event_id});
  };

})

// Event List Screen
.controller('EventsListController', function ($scope, $rootScope, $ionicLoading, $interval, $state, $stateParams, $timeout, tagsFactory, usersFactory, appApi, current_user) {
  console.log('EventsListController');

  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="ripple"></ion-spinner>'
		});
	  };
	  $scope.hide = function(){
		$ionicLoading.hide();
	  };
  
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  $scope.show()
  appApi.post('events', {user_id : current_user.id}).then(function (result) {
    $scope.events = result;
	$scope.hide()
  });
  $scope.onEventSelect = function (event_id) {
    console.log('onEventSelect');
    $state.go('app.showEvent', {'event_id' : event_id});
  };

})

// Tags Search Results Screen
.controller('TagsResultsController', function(appApi, $scope, $rootScope, $interval, $state, $stateParams, tagsFactory, usersFactory, current_user, allTags, $ionicSideMenuDelegate, appHelper) {
  // before the view is loaded, add things here that involve switching between controllers
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  tagsFactory.refreshTags(); // temp
  console.log('TagsResultsController');

  appApi.post('search/results', {'search_id' : $stateParams.search_id,'user_id':current_user.id}).then(function(result){
    console.log(result);
    $scope.result = result;

    // init
    // hit API server for results
    $scope.me = current_user;
    $scope.my = {};
    $scope.my.description = $scope.result.me.description;
    $scope.tagNames = appHelper.namesList($scope.result.tags);
    $scope.users = $scope.result.users;
  });

  
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

  $scope.onSwipeRight = function(swiped_user_id) {
    console.log("Swiped Right");
    appHelper.addIfNotExists(swiped_user_id, $scope.swipedUserIds);
    // send to API 
    appApi.post('match/me', {user_id : current_user.id, target_user_id : swiped_user_id, search_id : $stateParams.search_id}).then(function(result) {
      if (result === true) {
        console.log('matched with user');
      }
	  if (result.matched === true) {
		  $ionicPopup.alert({
			 title: 'Bingo!',
			 template: 'You have a new match!'
		});
	  }
    });
    console.log($scope.swipedUserIds);
    console.log($stateParams.search_id);
  };

  $scope.onSwipeLeft = function(swiped_user_id) {
    console.log("Swiped Left");
    appHelper.removeIfExists(swiped_user_id, $scope.swipedUserIds);
    // send to API 
    appApi.post('match/me/remove', {user_id : current_user.id, target_user_id : swiped_user_id, search_id : $stateParams.search_id}).then(function(result) {
      if (result === true) {
        console.log('unmatched with user');
      }
    });
    console.log($scope.swipedUserIds);
    console.log($stateParams.search_id);
  };

  // udpate self description for search
  $scope.updateDescription = function() {
    console.log('updateDescription');
    // send to API
    appApi.post('search/description', {search_id : $stateParams.search_id, description : $scope.my.description}).then(function (result) {
      if (result === true) {
        console.log('description updated');
      }
    });
    console.log($scope.my.description);
    // search id
  };
  
})

// Matches Screen
.controller('MatchesController', function($scope, $rootScope, $ionicLoading, $interval, $state, $stateParams, appApi, current_user) {
  console.log('MatchesController');
  // before the view is loaded, add things here that involve switching between controllers
  
    $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="ripple"></ion-spinner>'
		});
	  };
	  $scope.hide = function(){
		$ionicLoading.hide();
	  };
  
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  // live
  // works
  $scope.show()
  appApi.post('match/mine', {user_id : current_user.id}).then(function(result){
    $scope.matches = result;
	$scope.hide()
  });

  // start the conversations checker
  // implement
  $rootScope.matchesRefresher = $interval(function(){
    appApi.post('match/mine', {user_id : current_user.id}).then(function(result){
      $scope.matches = result;
    });
  }, 30000);

  $scope.onMatchSelect = function(conversation_id){
    console.log('match selected');
    console.log(conversation_id);
    $state.go('app.conversation', {conversation_id: conversation_id});
  };
})

// Conversation Screen
.controller('ConversationController', function($timeout, $ionicScrollDelegate, $scope, $rootScope, $interval, $state, $stateParams, current_user, $ionicNavBarDelegate, appHelper, appApi) {
  // before the view is loaded, add things here that involve switching between controllers
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
    // multilined header bar, make sure to turn this off on all screens visited after
    $rootScope.multiBar = true;
    // convoinvite
    $rootScope.showInvite = true;
    $rootScope.showOptions = true;
  }
  pre();


  appApi.post('messages', {user_id : current_user.id, 'conversation_id' : parseInt($stateParams.conversation_id)}).then(function(result){
    $scope.messages = result;
    // start the messages checker
    // implement
    $rootScope.messagesRefresher = $interval(function(){
      appApi.post('messages/check', {'conversation_id' : 1, 'messages_count' : $scope.messages.length}).then(function(result){
        if (result.new_messages === true) {
          // get new messages
          appApi.post('messages', {user_id : current_user.id, 'conversation_id' : parseInt($stateParams.conversation_id)}).then(function(result){
            $scope.messages = result;
          });
        }
      });
    }, 5000);
  });

  console.log($stateParams.conversation_id);

  // build the nav title
  function navTitle () {
    names = appHelper.namesList($scope.conversation.users);
    description = $scope.conversation.users[0].description;
    tags = appHelper.namesList($scope.conversation.search.tags);
    if ($scope.conversation.users.length == 1) {
      // 1v1 convo
      title_top = names + " for " + tags;
      title_bottom = description;
    } else {
      // group convo
      title_top = names;
      title_bottom = tags;
    }
    return "<span class=\"multi-title-top\">" + title_top + "</span><br /><span class=\"multi-title-bottom\">For " + title_bottom + "</span>";
  }

  // live
  // works
  $timeout(function(){
    appApi.post('conversation', {user_id : current_user.id, 'conversation_id' : parseInt($stateParams.conversation_id)}).then(function(result){
      $scope.conversation = result;
      // debug navtitle not showing unless on refresh
      $scope.navTitle = navTitle();
      $ionicScrollDelegate.$getByHandle('userMessageScroll').scrollBottom();
    });
  }, 2000);



  

  // $scope.messages = $scope.result.messages;

  //$scope.messages = chatFactory.refreshChat($stateParams.conversation_id).messages;
  $scope.current_user = current_user;
  

  // when invite is clicked
  $rootScope.inviteClick = function () {
    console.log('inviteClick');
    console.log($stateParams.conversation_id);
    $state.go('app.matchesInvite', {conversation_id: $stateParams.conversation_id});
  };

  // when options is clicked
  $rootScope.optionsClick = function () {
    console.log('optionsClick');
    //console.log($stateParams.conversation_id);
    $state.go('app.conversationDetails', {conversation_id: $stateParams.conversation_id});
  };
  
  // send message
  $scope.newMessage = null;
  $scope.sendMessage = function (form) {
    console.log('sendMessage');
    console.log($scope.newMessage);
    // send to API
    appApi.post('messages/send', {user_id : current_user.id, conversation_id : $stateParams.conversation_id, text : $scope.newMessage}).then(function(result) {
      if (result === true) {
        console.log('message sent');
        $scope.newMessage = null;
        // refresh conversation
        appApi.post('messages', {user_id : current_user.id, 'conversation_id' : parseInt($stateParams.conversation_id)}).then(function(result){
          $scope.messages = result;
          $ionicScrollDelegate.$getByHandle('userMessageScroll').scrollBottom();
        });
      }
    });
  };

})

// Invite Matches Screen
.controller('MatchesInviteController', function($scope, $rootScope, $interval, $state, $stateParams, appApi, current_user) {
  // before the view is loaded, add things here that involve switching between controllers
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  console.log('InviteMatchesController');
  appApi.post('invite', {conversation_id : 1, user_id : current_user.id}).then(function (result) {
    $scope.matches = result;
  });
  
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
    console.log('onInvite');
    // go back to convo screen
    console.log($stateParams.conversation_id);
    console.log($scope.selectedMatchIds);
    // send to API
    angular.forEach($scope.selectedMatchIds, function (target_user_id, index) {
      appApi.post('conversations', {user_id : target_user_id, conversation_id : $stateParams.conversation_id}).then(function(result) {
        if (result === true) {
          console.log('invite successful');
        }
      });
    });
    $state.go('app.conversation', {conversation_id : $stateParams.conversation_id});
  };
})

// Conversation Details Screen
.controller('ConversationDetailsController', function($scope, $rootScope, $interval, $state, $stateParams, $ionicPopup, usersFactory, appApi, current_user) {
  // before the view is loaded, add things here that involve switching between controllers
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  console.log('ConversationDetailsController');
  
  
  appApi.post('conversation', {conversation_id : 1, user_id : current_user.id}).then(function(result) {
    $scope.users = result.users;
  });
  
  // swiping
  $scope.selectedUserIds = [];

  // when leave button clicked
  $scope.onLeave = function(){
    // leave convo
    console.log('onLeave');
    $scope.confirmLeave();
  };
  // when user remove button clicked
  $scope.onRemoveUser = function (user_id) {
    console.log('onRemoveUser');
    $scope.confirmRemoveUser(user_id);
  };
  // when user view button clicked
  $scope.onUserView = function (user_id) {
    console.log('onUserView');
  };
  $scope.confirmRemoveUser = function(user_id) {
    var confirmRemoveUserPopup = $ionicPopup.confirm({
      title: 'Remove User',
      template: 'Are you sure you want to remove ' + usersFactory.getUser(user_id, $scope.users).name + ' from the conversation?'
    });
    confirmRemoveUserPopup.then(function(res) {
      if(res) {
        console.log('confirmed onRemoveUser');
        // send to API
        appApi.post('conversations/remove', {conversation_id : $stateParams.conversation_id, remove_user : user_id}).then(function(result) {
          if (result === true) {
            console.log('user removed from conversation');
          }
          $state.go('app.matches');
        });
      } else {
        console.log('cancelled onRemoveUser');
      }
    });
  };
  $scope.confirmLeave = function() {
    var confirmLeavePopup = $ionicPopup.confirm({
      title: 'Leave Conversation',
      template: 'Are you sure you want to leave this conversation?'
    });
    confirmLeavePopup.then(function(res) {
      if(res) {
        console.log('confirmed Leave');
        console.log($stateParams.conversation_id);
        // send to API
        appApi.post('conversations/remove', {conversation_id : $stateParams.conversation_id, remove_user : 1}).then(function(result) {
          if (result === true) {
            console.log('removed from conversation');
          }
          $state.go('app.matches');
        });
      } else {
        console.log('cancelled Leave');
      }
    });
  };
})

// Invite Contacts Screen
.controller('ContactsInviteController', function($scope, $rootScope, $ionicLoading, $cordovaContacts, $interval, $state, $stateParams, appApi, current_user) {
  console.log('ContactsInviteController');
  console.log($stateParams.event_id);
  // before the view is loaded, add things here that involve switching between controllers
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="ripple"></ion-spinner>'
		});
	  };
	  $scope.hide = function(){
		$ionicLoading.hide();
	};
	
	$scope.show();
	
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();
  

    $cordovaContacts.find({}).then(function(resp) {
		appApi.put('contacts', {'user_id' : current_user.id, 'contacts':resp}).then(function (result) {
			$scope.contacts = result;
			$scope.hide();
		})
    });
  
  // swiping
  $scope.selectedContactIds = [];

  // when contact selected
  $scope.onContactSelect = function(contact_id){
    console.log('contact selected');
    if ($scope.selectedContactIds.indexOf(contact_id) == -1) {
      $scope.selectedContactIds.push(contact_id);
    } else if ($scope.selectedContactIds.indexOf(contact_id) > -1) {
      $scope.selectedContactIds.splice($scope.selectedContactIds.indexOf(contact_id), 1);
    }
    console.log($scope.selectedContactIds);
  };

  // when invite button clicked
  $scope.onInvite = function(){
    console.log('onInvite');
    // go back to convo screen
    console.log($stateParams.event_id);
    console.log($scope.selectedContactIds);
    // prep array
    $scope.selectedContactIds = $scope.selectedContactIds.map(Number);
    // send to API
    appApi.post('contacts/invite', {
      user_id : current_user.id,
      event_id : parseInt($stateParams.event_id),
      contact_ids : $scope.selectedContactIds
    }).then(function(result) {
      if (result === true) {
        console.log('invite successful');
      }
    });
    $state.go('app.showEvent', {'event_id' : $stateParams.event_id});
  };
})

.controller('TagsSearchController', function($scope, $rootScope, $cordovaPush, $interval, $state, $ionicPopup,  $ionicLoading,
	$cordovaGeolocation, PushProcessingService, $stateParams,$ionicModal,$timeout, appApi, tagsFactory, current_user, $cordovaFacebook ) {
		
  console.log('TagsSearchController');
  
    $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="ripple"></ion-spinner>'
		});
	  };
	  $scope.hide = function(){
		$ionicLoading.hide();
	  };
  
  $scope.loginData = {};
  
  // Loads pop login screen
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

	if (current_user.id === undefined) {
		$timeout(function() {
			console.log('Modal:',$scope.modal)
      $scope.modal.show();
		}, 100);
	}
	else {
		getTags();
		getGeo();
	}
	
	$scope.doLogin = function() {
		appApi.post('login',{'psw_object':$scope.loginData}).then(function(resp) {
			if (resp.errors === undefined) {
				current_user.id = resp.id
				current_user.gender = resp.gender
				current_user.age = resp.age
				current_user.name = resp.name
				current_user.photo = resp.photo
				
				PushProcessingService.initialize();
				getTags();
				getGeo();
				$scope.modal.hide();
			}
			else {
				alert(resp.errors.error)
			}
		})
		$timeout(function() {
		  //$scope.closeLogin();
		}, 1000);
	};
	
	$scope.fbLogin = function () {
		if ( ionic.Platform.isAndroid() ||  ionic.Platform.isIOS()) {
			alert('FB Login is currently unavailable!');
			$cordovaFacebook.login(["public_profile", "email"])
			.then(function(success) {
			  $cordovaFacebook.api("me")
			  .then(function(success) {
				$scope.response = success;
				appApi.post('login',{'fb_object':success}).then(function(result) {
					$scope.response = result
					current_user.id = result.id
					current_user.gender = result.gender
					current_user.age = result.age
					current_user.name = result.name
					current_user.photo = result.photo
					$scope.response = current_user
					
					PushProcessingService.initialize();
					getTags();
					getGeo();
					$scope.modal.hide();
				})
				
			  }, function (error) {
				alert('Facebook Login Error 1');
				// error
			  });
			}, function (error) {
			  alert('Facebook Login Error 2');

			});
		}
		else {
			alert('browser')
			current_user.id = 1
			current_user.gender = 1
			current_user.age = 25
			current_user.name = 'shazam'
			current_user.photo = 21323
			$scope.response = current_user
			//$scope.modal.hide()
		}
	};

	function pre () {
		// cancel the refresher
		$interval.cancel($rootScope.tagRefresher);
		$interval.cancel($rootScope.messagesRefresher);
		$interval.cancel($rootScope.matchesRefresher);
		// convoinvite
		$rootScope.showInvite = false;
		$rootScope.showOptions = false;
		// multilined header bar
		$rootScope.multiBar = false;
	  };
	pre();

	  // prep the tags object
	  $scope.tags = {};
	  // tags that the user has selected
	  $scope.tags.selected = [];
	  // max number of tags teh user can serach
	  $scope.tags.max = 3;
	  $scope.tags.search = {};
	  $scope.tags.search.name = "";

	  // get all tags
	
	function getTags(){
		if (current_user.id !== undefined) {
		  appApi.get('tags').then(function(result) {
			$scope.tags.all = result;
			// get all suggested tags
			appApi.post('tags', {user_id : current_user.id}).then(function(result) {
			  $scope.tags.suggested = result;
			  $scope.processedTags = processedTags();
			});
		  });
		}
	}

	function getGeo() {
		$scope.show();
		var posOptions = {timeout: 10000, enableHighAccuracy: true};
		$cordovaGeolocation.getCurrentPosition(posOptions).then(function(resp) {
			console.log("geolocation fired!");
			appApi.post('position',{'gps_object':resp, "user_id": current_user.id}).then(function(reply) {
				if (reply.status !== undefined) {
					$scope.hide();
					$ionicPopup.alert({
						 title: 'Problemo',
						 template: 'No GPS data was found! Setting location settings to last known.'
					});
				};
				
			});
		});
		
	}
	
	
	  // when search button is pressed
	  $scope.onSearch = function () {
		$scope.tags.fullSelected = [];
		angular.forEach($scope.tags.selected, function (tag_id, key) {
		  $scope.tags.fullSelected.push({"id" : tag_id});
		});
		console.log($scope.tags.fullSelected);
		appApi.post('search', {user_id : current_user.id, 'tags' : $scope.tags.fullSelected}).then(function(result) {
		  $scope.tags.selected = [];
		  $rootScope.$broadcast('search:updated');
		  $state.go('app.tagsResults', {search_id: result.search_id});
		});
	  };

	  // when a tag is selected
	  $scope.onTagSelect = function(tag_id) {
		if ($scope.tags.selected.indexOf(tag_id) == -1) {
		  if ($scope.tags.selected.length < $scope.tags.max) {
			$scope.tags.selected.push(tag_id);
		  }
		} else if ($scope.tags.selected.indexOf(tag_id) > -1) {
		  $scope.tags.selected.splice($scope.tags.selected.indexOf(tag_id), 1);
		}
	  };

	  // watch for the search field to be updated to re-run the tag processor
	  $scope.$watch('tags.search.name', function () {
		console.log('watched tags.search.name');
		$scope.processedTags = processedTags();
	  });
	  
	  function processedTags () {
		numRows = 3;
		rowTags = [[]];
		availableTags = $scope.tags.all;
		if ($scope.tags.search.name.length > 0) {
		  availableTags = $scope.tags.all;
		} else {
		  availableTags = $scope.tags.suggested;
		}
		
		angular.forEach(availableTags, function(tag, index) {
		  // if the tag is selected or it contains the search string
		  if (
			$scope.tags.selected.indexOf(tag.id) !== -1 ||
			(angular.lowercase(tag.name).indexOf(angular.lowercase($scope.tags.search.name)) != -1)
		  ) {
			if ((rowTags[rowTags.length - 1].length) % numRows === 0) {
			  // push a new row
			  rowTags.push([]);
			}
			// push the tag into the last row
			rowTags[rowTags.length - 1].push(tag);
		  }
		});
		return rowTags;
	  }
})

// Get Contacts Controller
.controller('GetContactsController', function($scope, $rootScope, $interval, $state, $stateParams, $cordovaContacts) {
  document.addEventListener("deviceready", onDeviceReady, false);
  $scope.contacts = {};
  $scope.contacts.all = "sadfa";
  
	

  
  function onDeviceReady(){
    $cordovaContacts.find({}).then(function(resp) {
      console.log(resp);
      $scope.contacts.all = resp;
    });
  }
})

// Get Geo Controller
.controller('GetGeoController', function($scope, $rootScope, $interval, $state, $stateParams, $cordovaGeolocation, appApi) {
  document.addEventListener("deviceready", onDeviceReady, false);
  $scope.geo = {};
  $scope.geo.get = "sadfa";  
  
  function onDeviceReady(){
	var posOptions = {timeout: 10000, enableHighAccuracy: true};
	console.log("geo start")
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function(resp) {
		$scope.geo.get = resp
		appApi.post('position', {"data" : resp, "user_id":current_user.id}).then(function(result) {
			
		})
      
    });

  }
  
})

// Friends Controller
.controller('GetContactsController', function($scope, $rootScope, $interval, $state, $stateParams, $cordovaContacts) {
  document.addEventListener("deviceready", onDeviceReady, false);
  $scope.contacts = {};
  $scope.contacts.all = "sadfa";
  
  function onDeviceReady(){
    $cordovaContacts.find({}).then(function(resp) {
      console.log(resp);
      $scope.contacts.all = resp;
    });
  }
})


; // ends chaining