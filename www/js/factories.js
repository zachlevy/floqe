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
// GET /api/tags
.value(
  'get_api/tags',
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
  'post_api/search',
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
          "photo" : "http://s3.aws.com/image1.png",
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
          "photo" : "http://s3.aws.com/image2.png",
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
  'post_api/search/description',
  {
    "success" : true
  }
)
// POST /api/match/me
.value(
  'post_api/match/me',
  {
    "success" : true
  }
)
// POST /api/match/mine
.value(
  'post_api/match/mine',
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
            "photo" : "http://s3.aws.com/image1.png",
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
  'post_api/invite',
  {
    "success": true
  }
)
// POST /api/message/read
.value(
  'post_api/message/read',
  {
    "success" : true
  }
)

; // end chaining