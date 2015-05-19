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
.controller('UserEditController', function ($scope, $rootScope, $interval, $state, $stateParams, $timeout, tagsFactory, current_user, appApi) {
  console.log("UserEditController");
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
  appApi.post('user', {user_id : 1}).then(function(result) {
    $scope.user = result;
    $scope.user.user_id = $scope.user.id;
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
  // implement
  $scope.onSubmit = function () {
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

// New/Edit Event Screen
.controller('EventEditController', function ($scope, $rootScope, $interval, $state, $stateParams, $timeout, $ionicNavBarDelegate, tagsFactory, current_user, post_api_event, appApi) {
  console.log("EventEditController");
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
    appApi.post('event', {user_id : 1, event_id : parseInt($stateParams.event_id)}).then(function(result) {
      console.log('post event');

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

    // strip tags of extra param
    angular.forEach($scope.event.tags, function (tag, key) {
      delete tag.$$hashKey;
    });

    console.log($scope.event);
    // send to api
    // implement
    appApi.put('event', {
      event_id : $stateParams.evend_id,
      name : $scope.event.name,
      start : $scope.event.start,
      end : $scope.event.end,
      location : $scope.event.location,
      tags : $scope.event.tags,
      private : $scope.event.private
    }).then(function(result) {
      if (result === true) {
        console.log('updated event');
        $state.go('app.showEvent', {'event_id' : $stateParams.event_id});
      }
    });
  };
})
// Show Event Screen
.controller('EventShowController', function ($scope, $rootScope, $interval, $state, $stateParams, $timeout, $ionicPopup, tagsFactory, usersFactory, post_api_event, current_user, appApi) {
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

  //$scope.event = post_api_event.result;
  appApi.post('event', {event_id : $stateParams.event_id, user_id : 1}).then(function(result) {
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
    appApi.post('event/join', {user_id : 1, event_id : $stateParams.event_id, join : true}).then(function(result) {
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
    appApi.post('event/join', {user_id : 1, event_id : $stateParams.event_id, join : false}).then(function(result) {
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
          appApi.post('event', {event_id : $stateParams.event_id, user_id : 1}).then(function(result) {
            $scope.event = result;
          });
        });
      } else {
        console.log('cancelled onRemoveUser');
      }
    });
  };

})

// Event List Screen
.controller('EventsListController', function ($scope, $rootScope, $interval, $state, $stateParams, $timeout, tagsFactory, usersFactory, post_api_events, appApi) {
  console.log('EventsListController');

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

  // $scope.events = post_api_events.result;
  appApi.post('events', {user_id : 1}).then(function (result) {
    $scope.events = result;
  });
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
    $interval.cancel($rootScope.messagesRefresher);
    $interval.cancel($rootScope.matchesRefresher);
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
  appApi.post('conversation', {'user_id' : 1, 'conversation_id' : 1}).then(function(result){
    console.log('conversation');
    console.log(result);
    $scope.api.result = result;
  });
  /*
  appApi.post('conversations', {'user_id' : 1, 'conversation_id' : 1}).then(function(result){
    console.log(result);
    $scope.api.result = result;
  });
  */
  // every 3 seconds, repopulate the tags resource from the server
  /*
  $rootScope.tagRefresher = $interval(function(){
    appApi.get('tags').then(function(result){
      $scope.api.result = result;
    });
  }, 30000);
  */

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
    angular.forEach($scope.searchTags, function (tag, key) {
      delete tag.$$hashKey;
    });
    console.log($scope.searchTags);
    appApi.post('search', {'user_id' : 1, 'tags' : $scope.searchTags}).then(function(result) {
      console.log(result.search_id);
      $state.go('app.tagsResults', {search_id: result.search_id});
    });

    // searchTagsText = tagsFactory.idsList($scope.searchTags);
    
  };
})

// Tags Search Results Screen
.controller('TagsResultsController', function(appApi, $scope, $rootScope, $interval, $state, $stateParams, tagsFactory, usersFactory, post_api_search, current_user, allTags, $ionicSideMenuDelegate, appHelper) {
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

  appApi.post('search/results', {'search_id' : 1}).then(function(result){
    console.log('search/results');
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
    appApi.post('match/me', {user_id : 1, target_user_id : swiped_user_id, search_id : $stateParams.search_id}).then(function(result) {
      if (result === true) {
        console.log('matched with user');
      }
    });
    console.log($scope.swipedUserIds);
    console.log($stateParams.search_id);
  };

  $scope.onSwipeLeft = function(swiped_user_id) {
    console.log("Swiped Left");
    appHelper.removeIfExists(swiped_user_id, $scope.swipedUserIds);
    // send to API 
    appApi.post('match/me/remove', {user_id : 1, target_user_id : swiped_user_id, search_id : $stateParams.search_id}).then(function(result) {
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
    appApi.post('search/description', {search_id : 1, description : $scope.my.description}).then(function (result) {
      if (result === true) {
        console.log('description updated');
      }
    });
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
  appApi.post('match/mine', {user_id : 1}).then(function(result){
    $scope.matches = result;
  });

  // start the conversations checker
  // implement
  $rootScope.matchesRefresher = $interval(function(){
    appApi.post('match/mine', {user_id : 1}).then(function(result){
      $scope.matches = result;
    });
  }, 30000);

  // $scope.matches = post_api_match_mine.result;
  $scope.onMatchSelect = function(conversation_id){
    console.log('match selected');
    console.log(conversation_id);
    $state.go('app.conversation', {conversation_id: conversation_id});
  };
})

// Conversation Screen
.controller('ConversationController', function($ionicScrollDelegate, $scope, $rootScope, $interval, $state, $stateParams, post_api_messages, post_api_conversation, current_user, $ionicNavBarDelegate, appHelper, appApi) {
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


  appApi.post('messages', {'user_id' : 1, 'conversation_id' : parseInt($stateParams.conversation_id)}).then(function(result){
    $scope.messages = result;
    // start the messages checker
    // implement
    $rootScope.messagesRefresher = $interval(function(){
      appApi.post('messages/check', {'conversation_id' : 1, 'messages_count' : $scope.messages.length}).then(function(result){
        if (result.new_messages === true) {
          // get new messages
          appApi.post('messages', {'user_id' : 1, 'conversation_id' : parseInt($stateParams.conversation_id)}).then(function(result){
            $scope.messages = result;
          });
        }
      });
    }, 5000);
  });

  console.log($stateParams.conversation_id);

  // devleopment
  // $scope.messages = post_api_messages.result.messages;

  // live
  // works
  /*
  appApi.post('messages', {'user_id' : 1, 'conversation_id' : parseInt($stateParams.conversation_id)}).then(function(result){
    $scope.messages = result;
  });
  */

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
  appApi.post('conversation', {'user_id' : 1, 'conversation_id' : parseInt($stateParams.conversation_id)}).then(function(result){
    $scope.conversation = result;
    // debut navtitle not showing unless on refresh
    $scope.navTitle = navTitle();
    $ionicScrollDelegate.$getByHandle('userMessageScroll').scrollBottom();
  });

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
    appApi.post('messages/send', {user_id : 1, conversation_id : $stateParams.conversation_id, text : $scope.newMessage}).then(function(result) {
      if (result === true) {
        console.log('message sent');
        $scope.newMessage = null;
        // refresh conversation
        appApi.post('messages', {'user_id' : 1, 'conversation_id' : parseInt($stateParams.conversation_id)}).then(function(result){
          $scope.messages = result;
          $ionicScrollDelegate.$getByHandle('userMessageScroll').scrollBottom();
        });
      }
    });
  };

})

// Invite Matches Screen
.controller('MatchesInviteController', function($scope, $rootScope, $interval, $state, $stateParams, post_api_match_mine, post_api_conversations_invite, appApi) {
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
  appApi.post('invite', {conversation_id : 1, user_id : 1}).then(function (result) {
    $scope.matches = result;
  });
  // $scope.matches = post_api_conversations_invite.result;
  
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
.controller('ConversationDetailsController', function($scope, $rootScope, $interval, $state, $stateParams, $ionicPopup, usersFactory, post_api_conversation, appApi) {
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
  
  
  appApi.post('conversation', {conversation_id : 1, user_id : 1}).then(function(result) {
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




; // ends chaining