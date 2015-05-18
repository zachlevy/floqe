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

// Edit User Screen
.controller('UserEditController', function ($scope, $rootScope, $interval, $state, $stateParams, $timeout, tagsFactory, current_user) {
  console.log("UserEditController");
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  // photo upload
  $scope.changePhoto = function () {
    uploadcare.openDialog().done(function(file) {
      file.promise().done(function(fileInfo) {
        $scope.user.photo = fileInfo.cdnUrl;
      });
    });
  };

  $scope.user = current_user;

  // birthdate
  // convert from date string to js date object
  $scope.user.birthdate = new Date($scope.user.birthdate);

  // gender
  // change user object gender into radio button
  if ($scope.user.gender === 1) {
    $scope.user.gender = {};
    $scope.user.gender.male = true;
  } else {
    $scope.user.gender = {};
    $scope.user.gender.male = false;
  }
  $scope.user.gender.female = !$scope.user.gender.male;

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

  // interests
  $scope.allTags = tagsFactory.all();
  console.log($scope.allTags);

  // tagger
  $scope.maxTags = 10;
  $scope.showTagName = function (tag) {
    return tag.name;
  };
  $scope.createTagName = function (name) {
    return {name: name};
  };

  // submit
  $scope.onSubmit = function () {
    // change gender radio buttons into user object
    if ($scope.user.gender.male === true) {
      $scope.user.gender = 1;
    } else {
      $scope.user.gender = 0;
    }
    console.log($scope.user.name);
    console.log($scope.user.birthdate);
    console.log($scope.user.gender.male);
    console.log($scope.user.gender.female);
    console.log($scope.user.interests);
    console.log($scope.user.photo);
  };
})

// New/Edit Event Screen
.controller('EventEditController', function ($scope, $rootScope, $interval, $state, $stateParams, $timeout, $ionicNavBarDelegate, tagsFactory, current_user, post_api_event) {
  console.log("EventEditController");
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

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
    // tags
    $scope.event.tags = [];
  } else {
    // its an existing event
    $ionicNavBarDelegate.title("Edit event");
    // temp
    $scope.event = post_api_event.result;
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
  }
  // temp
  $scope.allTags = tagsFactory.all();

  // tagger
  $scope.maxTags = 10;
  $scope.taggerTags = $scope.suggestedTags;
  $scope.showTagName = function (tag) {
    return tag.name;
  };
  $scope.createTagName = function (name) {
    return {name: name};
  };

  // submit
  $scope.onSubmit = function () {
    // rebuild dates from the separate date and time pickers
    $scope.event.start = new Date(
      $scope.event.start.date.getFullYear(),
      $scope.event.start.date.getMonth(),
      $scope.event.start.date.getDay(),
      $scope.event.start.time.getHours(),
      $scope.event.start.time.getMinutes()
    );
    $scope.event.end = new Date(
      $scope.event.end.date.getFullYear(),
      $scope.event.end.date.getMonth(),
      $scope.event.end.date.getDay(),
      $scope.event.end.time.getHours(),
      $scope.event.end.time.getMinutes()
    );
    console.log($scope.event);
  };
})
// Show Event Screen
.controller('EventShowController', function ($scope, $rootScope, $interval, $state, $stateParams, $timeout, $ionicPopup, tagsFactory, usersFactory, post_api_event, current_user) {
  console.log('EventShowController');

  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  $scope.event = post_api_event.result;
  $scope.current_user = current_user;

  // admins removing user from group
  $scope.onRemoveUser = function (user_id) {
    console.log('onRemoveUser: ' + user_id);
    $scope.confirmRemoveUser(user_id);
  };

  $scope.onJoinEvent = function () {
    console.log('onJoinEvent');
    $scope.event.me.joined = true;
    // send to api
    // implement
  };

  $scope.onLeaveEvent = function () {
    console.log('onLeaveEvent');
    $scope.event.me.joined = false;
    // send to api
    // implement
  };

  $scope.onChat = function () {
    console.log('onChat: ' + $scope.event.conversation_id);
    $state.go('app.conversation', {'conversation_id': $scope.event.conversation_id});
  };

  // popup for admins removing users from event
  $scope.confirmRemoveUser = function(user_id) {
    var confirmRemoveUserPopup = $ionicPopup.confirm({
      title: 'Remove User',
      template: 'Are you sure you want to remove ' + usersFactory.getUser(user_id, $scope.event.users).name + ' from the conversation?'
    });
    confirmRemoveUserPopup.then(function(res) {
      if(res) {
        console.log('confirmed onRemoveUser');
        // send to API
        // implement
      } else {
        console.log('cancelled onRemoveUser');
      }
    });
  };

})

// Event List Screen
.controller('EventsListController', function ($scope, $rootScope, $interval, $state, $stateParams, $timeout, tagsFactory, usersFactory, post_api_events) {
  console.log('EventsListController');

  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  $scope.events = post_api_events.result;
  $scope.onEventSelect = function (event_id) {
    console.log('onEventSelect');
    $state.go('app.showEvent', {'event_id' : event_id});
  };

})


// Tags Search Screen
.controller('TagsSearchController', function($scope, $rootScope, $interval, $state, appApi, tagsFactory, allTags, $timeout, appHelper, post_api_tags_suggested) {
  // before the view is loaded, add things here that involve switching between controllers
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  // testing api
  $scope.api = {};

  // populate the tags resource
  // sample, remove for production
  /*
  appApi.get('tags').then(function(result){
    $scope.api.result = result;
  });
  */

  // populate the tags resource
  // sample, remove for production
  appApi.post('match/mine', {'user_id' : 1}).then(function(result){
    $scope.api.result = result;
  });

  // every 3 seconds, repopulate the tags resource from the server
  $rootScope.tagRefresher = $interval(function(){
    appApi.get('tags').then(function(result){
      $scope.api.result = result;
    });
  }, 30000);

  /*
  // sample, remove for production
  appApi.post('match/mine', {}).then(function(result){
    $scope.api.result = result;
  });
  */

  // reset global allTags value to make sure they're up to date
  tagsFactory.refreshTags();

  // default tags
  $scope.searchTags = [];
  // get all tags
  // $scope.suggestedTags = tagsFactory.suggestedTags
  $scope.suggestedTags = post_api_tags_suggested.result;
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
    console.log($scope.searchTags);
    searchTagsText = tagsFactory.idsList($scope.searchTags);
    $state.go('app.tagsResults', {tag_ids: searchTagsText});
  };
})

// Tags Search Results Screen
.controller('TagsResultsController', function($scope, $rootScope, $interval, $state, $stateParams, tagsFactory, usersFactory, post_api_search, current_user, allTags, $ionicSideMenuDelegate, appHelper) {
  // before the view is loaded, add things here that involve switching between controllers
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  tagsFactory.refreshTags(); // temp
  console.log('TagsResultsController');

  // init
  // hit API server for results
  users = post_api_search.result.users;
  searchedTags = post_api_search.result.tags;
  $scope.me = current_user;
  $scope.my = {};
  $scope.my.description = post_api_search.result.me.description;
  $scope.tagNames = appHelper.namesList(searchedTags);
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

  // udpate self description for search
  $scope.updateDescription = function() {
    console.log('updateDescription');
    // send to API
    // implement
    console.log($scope.my.description);
    // search id
  };
  
})

// Matches Screen
.controller('MatchesController', function($scope, $rootScope, $interval, $state, $stateParams, post_api_match_mine, appApi) {
  console.log('MatchesController');
  // before the view is loaded, add things here that involve switching between controllers
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  // live
  // works
  appApi.post('match/mine', {'user_id' : 1}).then(function(result){
    $scope.matches = result;
  });

  // $scope.matches = post_api_match_mine.result;
  $scope.onMatchSelect = function(conversation_id){
    console.log('match selected');
    console.log(conversation_id);
    $state.go('app.conversation', {conversation_id: conversation_id});
  };
})

// Conversation Screen
.controller('ConversationController', function($scope, $rootScope, $interval, $state, $stateParams, post_api_messages, post_api_conversation, current_user, $ionicNavBarDelegate, appHelper, appApi) {
  // before the view is loaded, add things here that involve switching between controllers
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    // multilined header bar, make sure to turn this off on all screens visited after
    $rootScope.multiBar = true;
    // convoinvite
    $rootScope.showInvite = true;
    $rootScope.showOptions = true;
  }
  pre();

  console.log($stateParams.conversation_id);

  // devleopment
  // $scope.messages = post_api_messages.result.messages;
  
  // live
  // works
  appApi.post('messages', {'user_id' : 1, 'conversation_id' : $stateParams.conversation_id}).then(function(result){
    $scope.messages = result;
  });

  // $scope.messages = $scope.result.messages;

  //$scope.messages = chatFactory.refreshChat($stateParams.conversation_id).messages;
  $scope.current_user = current_user;

  // build the nav title
  function navTitle () {
    names = appHelper.namesList(post_api_conversation.result.users);
    description = post_api_conversation.result.users[0].description;
    tags = appHelper.namesList(post_api_conversation.result.search.tags);
    if (post_api_conversation.result.users.length == 1) {
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
  $scope.navTitle = navTitle();

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
    // implement
  };

})

// Invite Matches Screen
.controller('MatchesInviteController', function($scope, $rootScope, $interval, $state, $stateParams, post_api_match_mine, post_api_conversations_invite) {
  // before the view is loaded, add things here that involve switching between controllers
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  console.log('InviteMatchesController');
  $scope.matches = post_api_conversations_invite.result;
  
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
    console.log($stateParams.conversation_id);
    console.log($scope.selectedMatchIds);
    // send to API 
    // implement
  };
})

// Conversation Details Screen
.controller('ConversationDetailsController', function($scope, $rootScope, $interval, $state, $stateParams, $ionicPopup, usersFactory, post_api_conversation) {
  // before the view is loaded, add things here that involve switching between controllers
  function pre () {
    // cancel the refresher
    $interval.cancel($rootScope.tagRefresher);
    // convoinvite
    $rootScope.showInvite = false;
    $rootScope.showOptions = false;
    // multilined header bar
    $rootScope.multiBar = false;
  }
  pre();

  console.log('ConversationDetailsController');
  $scope.users = post_api_conversation.result.users;
  
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
        // implement
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
        // implement
        $state.go('app.matches');
      } else {
        console.log('cancelled Leave');
      }
    });
  };
})




; // ends chaining