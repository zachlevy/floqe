angular.module('starter.services', [])

// any function related to accessing the api
.factory('appApi', function ($http, $q, baseUrl) {
  // data is an object like {'foo':'bar'}
  // endpoint is a string
  return {
    post: function(endpoint, data) {
      // promise
      var deferred = $q.defer();

      $http.post(baseUrl + endpoint, data)
      .success(function(res, status) {
        if (res.success === true) {
          // success
          console.log('http success');
          deferred.resolve(res.result);
        } else if (res.success === false) {
          // bad params
          console.log('http bad server request');
          console.log(res.result);
          deferred.resolve(res.result);
        } else {
          // server error
          console.log('http server error');
          console.log(res.result);
          deferred.resolve(res.result);
        }
      }).error(function(res, status) {
        // http error
        console.log('http error');
        deferred.reject(msg);
      });
      return deferred.promise;
    },
    get: function(endpoint) {
      // promise
      var deferred = $q.defer();

      $http.get(baseUrl + endpoint)
      .success(function(res, status) {
        console.log(status);
        if (res.result.success === true) {
          // success
          console.log('http success');
          deferred.resolve(res.result);
        } else if (res.result.success === false) {
          // bad params
          console.log('http bad server request');
          console.log(res.result);
          deferred.resolve(res.result);
        } else {
          // server error
          console.log('http server error');
          console.log(res.result);
          deferred.resolve(res.result);
        }
      }).error(function(res, status) {
        // http error
        console.log('http error');
        deferred.reject(msg);
      });
      return deferred.promise;
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
    },
    // returns names from objects like "basketball, hockey"
    // from objects like [{name:"basketball"},{name:"hockey"}]
    namesList: function(tags) {
      text = [];
      angular.forEach(tags, function (value, key) {
      this.push(value.name);
      }, text);
      return text.join(', ');
    },
  };
})

// global helper values
// API base url
.value(
  'baseUrl',
  'http://192.168.0.11:8100/api/v1/'
  //'http://backend-env-36mjm8eh3x.elasticbeanstalk.com/api/v1/'
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
    "id" : 2,
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
        "conversation_id": 1,
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
        "conversation_id": 2,
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
// POST /api/v1/messages/check
.value (
  'post_api_message_check',
  {
    "success" : true,
    "result" : {
      "messages_count" : 3,
      "last_message" : {
        "user_id" : 1,
        "message" : "Cya there bro",
        "time" : "2015-04-26T00:00:00Z",
        "unread" : true
      },
    }
  }
)
// POST /conversation
.value(
  'post_api_conversation',
  {
    "success" : true,
    "result" : {
      "search": {
        "id": 1,
        "tags": [
          {
            "id": 1,
            "name": "Hockey"
          },
          {
            "id": 2,
            "name": "Basketball"
          }
        ]
      },
      "users" : [
        {
          "id" : 1,
          "name" : "Jake",
          "description" : null,
          "photo" : "http://placehold.it/100x100",
          "friend" : true,
          "removable" : true
        },
        {
          "id" : 2,
          "name" : "Alex",
          "description" : "Scrim",
          "photo" : "http://placehold.it/100x100",
          "friend" : false,
          "removable" : false
        }
      ]
    }
  }
)
// POST /messages
.value (
  'post_api_messages',
  {
    "success" : true,
    "result" : {
    "messages":[
        {
          "id": 1,
          "text": "wanna meet up?",
          "time" : "2015-04-25T12:32:54Z",
          "read_count" : 4,
          "user" : {
            "id" : 1,
            "name" : "Jake",
            "photo" : "http://placehold.it/100x100",
            "friend" : true,
          },
        },
        {
          "id": 2,
          "text": "yeah man, tomorrow 2pm at the area?",
          "time" : "2015-04-25T18:32:01Z",
          "read_count" : 4,
          "user" : {
            "id" : 2,
            "name" : "Alex",
            "photo" : "http://placehold.it/100x100",
            "friend" : false,
          }
        },
        {
          "id": 3,
          "text": "cool story bro, see you there",
          "time" : "2015-04-26T02:30:00Z",
          "read_count" : 4,
          "user" : {
            "id" : 1,
            "name" : "Jake",
            "photo" : "http://placehold.it/100x100",
            "friend" : true,
          },
        }
      ]
    }
  }
)

// POST /conversations/invite
.value(
  'post_api_conversations_invite',
  {
    "success" : true,
    "result" : [
      {
        "id" : 1,
        "name" : "Jake",
        "photo" : "http://placehold.it/100x100",
        "friend" : true,
        "matched_for" : {
          "time" : "2015-04-22T01:11:21Z",
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
        }
      },
      {
        "id" : 2,
        "name" : "Alex",
        "description" : "Scrim",
        "photo" : "http://placehold.it/100x100",
        "friend" : false,
        "matched_for" : {
          "time" : "2015-04-22T01:11:21Z",
          "tags" : [
            {
              "id" : 1,
              "name" : "Hockey"
            },
          ]
        }
      },
      {
        "id" : 1,
        "name" : "Jake",
        "photo" : "http://placehold.it/100x100",
        "friend" : true,
        "matched_for" : {
          "time" : "2015-04-22T01:11:21Z",
          "tags" : [
            {
              "id" : 1,
              "name" : "Hockey"
            },
          ]
        }
      }
    ]
  }
)
// Response POST /tags/suggested
// add to api docs
.value(
  'post_api_tags_suggested',
  {
    "success" : true,
    "result" : {
      "trending" : [
        {
          "id" : 1,
          "name" : "Motor rallies"
        },
        {
          "id" : 2,
          "name" : "Motor"
        },
      ],
      "suggested" : [
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
      ],
      "popular" : [
        {
          "id" : 1,
          "name" : "Motor rallies"
        },
        {
          "id" : 4,
          "name" : "Horses"
        },
        {
          "id" : 2,
          "name" : "Motor"
        },
      ],
    }
  }
)

// edit event
.value(
  'post_api_event',
  {
    "success" : true,
    "result" : {
      "name" : "Zach's Birthday",
      "start" : "2015-06-17T20:00:00Z",
      "end" : "2015-06-17T23:55:00Z",
      "location" : "1701 - 55 Maitland St. Toronto, ON M4Y1C9",
      "tags" : [
        {
          "id" : 1,
          "name" : "Motor rallies"
        },
        {
          "id" : 2,
          "name" : "Motor"
        },
      ],
      "private" : true,
      "users" : [
        {
          "id" : 1,
          "name" : "Jake",
          "photo" : "http://placehold.it/100x100",
          "friend" : true,
          "admin" : true
        },
        {
          "id" : 2,
          "name" : "Alex",
          "photo" : "http://placehold.it/100x100",
          "friend" : false,
          "admin" : false
        }
      ],
      "conversation_id" : 1,
      "me" : {
        "joined" : true,
        "admin" : true
      }
    }
  }
)

// events
.value(
  'post_api_events',
  {
    "success" : true,
    "result" : [
      {
        "name" : "Zach's Birthday",
        "start" : "2015-06-17T20:00:00Z",
        "end" : "2015-06-17T23:55:00Z",
        "location" : "1701 - 55 Maitland St. Toronto, ON M4Y1C9",
        "tags" : [
          {
            "id" : 1,
            "name" : "Motor rallies"
          },
          {
            "id" : 2,
            "name" : "Motor"
          },
        ],
        "private" : true,
        "users" : [
          {
            "id" : 1,
            "name" : "Jake",
            "photo" : "http://placehold.it/100x100",
            "friend" : true,
            "admin" : true
          },
          {
            "id" : 2,
            "name" : "Alex",
            "photo" : "http://placehold.it/100x100",
            "friend" : false,
            "admin" : false
          }
        ],
        "conversation_id" : 1,
        "me" : {
          "joined" : true,
          "admin" : true
        }
      }
    ]
  }
)

; // end chaining