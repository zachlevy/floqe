angular.module('starter.factories', [])

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


.factory('tagsFactory', function($http){
  return {
    namesList: function(tags) {
      text = [];
      angular.forEach(tags, function (value, key) {
      this.push(value.name);
      }, text);
      return text.join(', ');
    },
    suggested: function() {

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
    },
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

.value(
  'baseUrl',
  'http://backend-env-36mjm8eh3x.elasticbeanstalk.com/api/v1/'
)




// development
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
              "name" : "Hockey"
           }
         ],
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