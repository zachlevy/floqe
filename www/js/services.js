angular.module('starter.services', ['firebase'])

// any function related to accessing the api
.factory('appApi', function ($http, baseUrl) {
  // data is an object like {'foo':'bar'}
  // endpoint is a string
  return {
    send: function(endpoint, data) {
      $http.post(baseUrl, data)
      .success(function(data, status, headers, config) {
        if (data.success === true) {
          return data.result;
        } else if (data.success === false) {
          return false;
        } else {
          return null;
        }
      }).error(function(data, status, headers, config) {
        console.log(status);
        return status;
      });
    },
    recieve: function(endpoint) {
      $http.get(baseUrl + endpoint)
      .success(function(data, status, headers, config) {
        return data;
      }).error(function(data, status, headers, config) {
        return status;
      });
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
  // factory vars
  var suggested = function() {
    return [
      {
        "id" : 1,
        "name" : "Motor rallies"
      },
      {
        "id" : 2,
        "name" : "Motor"
      },
    ];
  };
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
    // returns tag names like basketball,hockey from tag objects
    namesList: function(tags) {
      text = [];
      angular.forEach(tags, function (value, key) {
      this.push(value.name);
      }, text);
      return text.join(', ');
    },
    // get suggested tags for tag search screen
    suggested: suggested,
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
    }
  };
})

// firebase start
.factory('Auth', ["$firebaseAuth", "$rootScope",
  function ($firebaseAuth, $rootScope) {
    var ref = new Firebase(firebaseUrl);
    return $firebaseAuth(ref);
  }
])

// Simple Service which returns Rooms collection as Array
// from Salesforce & binds to the Scope in Controller
.factory('Rooms', function ($firebaseArray) {
  // Might use a resource here that returns a JSON array
  var ref = new Firebase(firebaseUrl);
  var rooms = $firebaseArray(ref.child('rooms'));

  return {
    all: function () {
      return rooms;
    },
    get: function (roomId) {
      // Simple index lookup
      return rooms.$getRecord(roomId);
    }
  };
})
.factory('Chats', function ($firebaseArray, Rooms) {

  var selectedRoomId;

  var ref = new Firebase(firebaseUrl);
  var chats;

  return {
    all: function () {
      return chats;
    },
    remove: function (chat) {
      chats.$remove(chat).then(function (ref) {
        ref.key() === chat.$id; // true item has been removed
      });
    },
    get: function (chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    },
    getSelectedRoomName: function () {
      var selectedRoom;
      if (selectedRoomId && selectedRoomId != null) {
        selectedRoom = Rooms.get(selectedRoomId);
        if (selectedRoom)
          return selectedRoom.name;
        else
          return null;
      } else
      return null;
    },
    selectRoom: function (roomId) {
      console.log("selecting the room with id: " + roomId);
      selectedRoomId = roomId;
      if (!isNaN(roomId)) {
        chats = $firebaseArray(ref.child('rooms').child(selectedRoomId).child('chats'));
      }
    },
    send: function (from, message) {
      console.log("sending message from :" + from.displayName + " & message is " + message);
      if (from && message) {
        var chatMessage = {
          from: from.displayName,
          message: message,
          createdAt: Firebase.ServerValue.TIMESTAMP
        };
        chats.$add(chatMessage).then(function (data) {
          console.log("message added");
        });
      }
    }
  };
})
/*
.value(
  'firebaseUrl',
  'https://floqe.firebaseio.com'
)
*/
// firebase end

// global helper values
// API base url
.value(
  'baseUrl',
  'http://backend-env-36mjm8eh3x.elasticbeanstalk.com/api/v1/'
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
  'current_user',
  {
    "id" : 3,
    "name" : "Boaz",
    "photo" : "http://placehold.it/100x100",
    "description" : null,
    "gender" : 1,
    "age" : 23
  }
)

// sample API responses
// GET /api/tags
.value(
  'get_api_tags',
  [
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
  ]
)
// POST /api/search
.value(
  'post_api_search',
  {
    "success" : true,
    "result" : {
      "id" : 1,
      "me" : {
        "description" : "scrim"
      },
      "tags" : [
        {
          "id" : 1,
          "name" : "Hockey"
        },
        {
          "id" : 2,
          "name" : "Basketball"
        }
      ],
      "users" : [
        {
          "id" : 1,
          "name" : "Jake",
          "description" : "pickup",
          "photo" : "http://placehold.it/100x100",
          "friend" : true,
          "gender" : 0,
          "distance" : 2.1,
          "age" : 26,
          "matched" : true
        },
        {
          "id" : 2,
          "name" : "Alex",
          "description" : "Scrim",
          "photo" : "http://placehold.it/100x100",
          "friend" : false,
          "gender" : 1,
          "distance" : 5,
          "age" : 23,
          "matched" : false
        }
      ]
    }
  }
)
// POST /api/search/description
.value(
  'post_api_search_description',
  {
    "success" : true
  }
)
// POST /api/match/me
.value(
  'post_api_match_me',
  {
    "success" : true
  }
)
// POST /api/match/mine
.value(
  'post_api_match_mine',
  {
    "success" : true,
    "result" : [
      {
        "id": 1,
        "last_message" : {
          "user_id" : 1,
          "message" : "Cya there bro",
          "time" : "2015-04-26T00:00:00Z",
          "unread" : true
        },
        "users" : [
          {
            "id" : 1,
            "name" : "Jake",
            "photo" : "http://placehold.it/100x100",
            "friend" : true,
          }
        ],
        "matched_for" : [
          {
            "id" : 1,
            "name" : "Hockey",
            "time" : "2015-04-22T01:11:21Z"
           }
         ],
      },
      {
        "id": 2,
        "last_message" : null,
        "users" : [
          {
            "id" : 1,
            "name" : "Jake",
            "photo" : "http://placehold.it/100x100",
            "friend" : true,
          },
          {
            "id" : 2,
            "name" : "Alex",
            "description" : "Scrim",
            "photo" : "http://placehold.it/100x100",
            "friend" : false,
          }
        ],
        "matched_for" : {
          "time" : "2015-04-25T02:15:31Z",
          "tags" : [
            {
              "id" : 1,
              "name" : "Hockey",
            }
          ]
        }
      }
    ]
  }
)
// POST /api/invite
.value(
  'post_api_invite',
  {
    "success": true
  }
)
// POST /api/message/read
.value(
  'post_api_message_read',
  {
    "success" : true
  }
)

; // end chaining