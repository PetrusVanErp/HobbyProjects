# REST Specification

This is our REST specification. All REST-requests are done in the route-files (directory 'routes'). 
These route-files are:

* Playlist (playlist.js)
* User (user.js)

## SAVE NEW TRACKS

**`POST`** `/playlists/tracks`

_Parameters:_ None

_Body:_

```json
{
  "tracks": [
    {
      "name": "String",
      "artist": "String",
      "genre": [
        "String"
      ],
      "platform": "String",
      "url_id": "String",
      "duration": "Number",
      "added_on": "Date"
    }
  ]
}
```

_Response when successful:_

```json
{
  "tracks": [
    {
      "name": "String",
      "artist": "String",
      "genre": [
        "String"
      ],
      "platform": "String",
      "url_id": "String",
      "duration": "Number",
      "added_on": "Date"
    }
  ]
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## CREATE NEW PLAYLIST

**`POST`** `/playlists`

_Parameters:_

* `userID` - The id of the owner of the playlist

_Body:_

```json
{
  "playlist": {
    "name": "String",
    "description": "String",
    "owner": "String",
    "tracks": [
      "String"
    ]
  }
}
```
_Response when successful:_

Statuscode `200`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## UPDATE PLAYLIST

**`PUT`** `/playlists/:playlistID`

_Parameters:_

* `playlistID` - The id of targeted playlist

_Body:_

```json
{
  "playlist": {
    "name": "String",
    "description": "String",
    "image_url": "String",
    "owner": "String",
    "tracks": [
      "String"
    ]
  }
}
```
`image_url` is optional.

_Response when successful:_

Statuscode `200`

_Response when unsuccessful:_

Error (//TODO Statuscode coming soon...)

-------------

## ADD TRACK TO PLAYLIST

**`POST`** `/playlists/:playlistID/tracks`

_Parameters:_

* `playlistID` - The id of targeted playlist

_Body:_

```json
{
  "track": {
    "name": "String",
    "artist": "String",
    "genre": [
      "String"
    ],
    "platform": "String",
    "url_id": "String",
    "duration": "Number",
    "added_on": "Date"
  }
}
```

_Response when successful:_

Statuscode `200`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## REMOVE TRACK FROM PLAYLIST

**`DELETE`** `/playlists/:playlistID/tracks/:trackID`

_Parameters:_

* `playlistID` - The id of targeted playlist
* `trackID` - The id of the targeted track

_Body:_ None

_Response when successful:_

Statuscode `200` 

_Response when unsuccessful:_

Statuscode `500`

-------------

## DELETE PLAYLIST

**`DELETE`** `/playlists/:playlistID`

_Parameters:_

* `playlistID` - The id of targeted playlist

_Body:_ None

_Response when successful:_

Statuscode `200`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET PLAYLIST BY ID

**`GET`** `/playlists/:playlistID`

_Parameters:_

* `playlistID` - The id of targeted playlist

_Body:_ None

_Response when successful:_

```json
{
  "playlist": {
    "name": "String",
    "description": "String",
    "owner": "String",
    "image_url": "String",
    "tracks": [
      {
        "name": "String",
        "artist": "String",
        "genre": [
          "String"
        ],
        "platform": "String",
        "url_id": "String",
        "duration": "Number",
        "added_on": "Date"
      }
    ]
  }
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

##### GET PLAYLISTS AND USERS BASED ON SEARCH

**`GET`** `/search/:searchTerm`

_Parameters:_

* `searchTerm` - The searchterm of targeted playlist or/and user

_Body:_ None

_Response when successful:_

```json
{"searchResults": [
  {"playlists": [{
    "playlist": {
      "name": "String",
      "description": "String",
      "owner": "String",
      "image_url": "String",
      "tracks": [{
        "name": "String",
        "artist": "String",
        "genre": [
          "String"
        ],
        "platform": "String",
        "url_id": "String",
        "duration": "Number",
        "added_on": "Date"
      }
    ]
  }
 }]
},
  {"users": [{
    "user": {
      "name": "String",
      "username": "String",
      "hashed_password": "String",
      "email": "String",
      "connections":[{
          "platform": "String",
          "client_id": "String"
      },
      {
          "platform": "String",
          "client_id": "String"
      }],
      "following": ["String"],
      "subscribed_playlists": [],
      "preferred_genres": ["String"],
      "stats": {
        "tracks": [{
            "track": "String",
            "count": "Number"
        }],
        "genres": [{
            "genre": "String",
            "count": "Number"
        }]
    }
  }
 }]
}
```
-------------

##### GET RANDOM PLAYLISTS BASED ON USERID

**`GET`** `/search/:userID/random`

_Parameters:_

* `userID` - The id of targeted user

_Body:_ None

_Response when successful:_

```json
  {"playlists": [{
    "playlist": {
      "name": "String",
      "description": "String",
      "owner": "String",
      "image_url": "String",
      "tracks": [{
        "name": "String",
        "artist": "String",
        "genre": [
          "String"
        ],
        "platform": "String",
        "url_id": "String",
        "duration": "Number",
        "added_on": "Date"
      }
    ]
  }
 }]
},
  {"users": [{
    "user": {
      "name": "String",
      "username": "String",
      "hashed_password": "String",
      "email": "String",
      "connections":[{
          "platform": "String",
          "client_id": "String"
      },
      {
          "platform": "String",
          "client_id": "String"
      }],
      "following": ["String"],
      "subscribed_playlists": [],
      "preferred_genres": ["String"],
      "stats": {
        "tracks": [{
            "track": "String",
            "count": "Number"
        }],
        "genres": [{
            "genre": "String",
            "count": "Number"
        }]
    }
  }
}

```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET TRACKS FROM USER

**`GET`** `/users/:userID/tracks`

_Parameters:_

* `userID` - The id of targeted user

_Body:_ None

_Response when successful:_

```json
[
  {
    "_id": "String",
    "name": "String",
    "artist": "String",
    "genre": [
      "String"
    ],
    "platform": "String",
    "url_id": "String",
    "duration": "Number",
    "added_on": "Date"
  },
  {
    "_id": "String",
    "name": "String",
    "artist": "String",
    "genre": [
      "String"
    ],
    "platform": "String",
    "url_id": "String",
    "duration": "Number",
    "added_on": "Date"
  }
]
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET PLAYLISTS BY USER

**`GET`** `/users/:userID/playlists`

_Parameters:_

* `userID` - The id of targeted user

_Body:_ None

_Response when successful:_

```json
{
  "playlists": [
    {
      "name": "String",
      "description": "String",
      "owner": "String",
      "image_url": "String",
      "tracks": [
        {
          "name": "String",
          "artist": "String",
          "genre": [
            "String"
          ],
          "platform": "String",
          "url_id": "String",
          "duration": "Number",
          "added_on": "Date"
        }
      ]
    }
  ]
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## CREATE USER

**`POST`** `/users`

Create a new user

_Parameters:_ None

_Body:_

```json
{
  "user": {
    "name": "String",
    "username": "String",
    "hashed_password": "String",
    "email": "String"
  }
}
```

_Response when successful:_

```json
{
  "user": {
    "_id": "Sting",
    "name": "String",
    "username": "String",
    "hashed_password": "String",
    "email": "String"
  }
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage` 

-------------

## UPDATE USER

**`PUT`** `/users/:userId`

Updates a user

_Parameters:_ 
`userId` = The id of the targeted user

_Body:_

```json
{
  "user": {
    "name": "String",
    "email": "String"
  }
}
```

_Response when successful:_

```json
{
  "user": {
    "name": "String",
    "username": "String",
    "hashed_password": "String",
    "email": "String",
    "connections": [
      {
        "platform": "String",
        "access_token": "String",
        "refresh_token": "String"
      }
    ],
    "following": ["String"],
    "subscribed_playlists": ["String"],
    "preferred_genres": ["String"],
    "stats": {
      "tracks": [
        {
          "track": "String",
          "count": "Number"
        }
      ],
      "genres": [
        {
          "genre": "String",
          "count": "Number"
        }
      ]
    }
  }
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage` 

-------------

## ADD CONNECTION TO USER

**`POST`** `/users/:userId/connections`

_Parameters:_

_Body:_

```json
{
  "connection": {
    "platform": "String",
    "access_token": "String",
    "refresh_token": "String"
  }
}
```

_Response when successful:_

```json
{
  "user": {
    "name": "String",
    "username": "String",
    "hashed_password": "String",
    "email": "String",
    "connections": [
      {
        "platform": "String",
        "access_token": "String",
        "refresh_token": "String"
      }
    ],
    "following": [
      "String"
    ],
    "subscribed_playlists": [
      "String"
    ],
    "preferred_genres": [
      "String"
    ],
    "stats": {
      "tracks": [
        {
          "track": "String",
          "count": "Number"
        }
      ],
      "genres": [
        {
          "genre": "String",
          "count": "Number"
        }
      ]
    }
  }
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## LOG IN A USER

**`POST`** `/users/login`

_Parameters:_ None

_Body:_

```json
{
  "user": {
    "name": "String",
    "username": "String",
    "hashed_password": "String",
    "email": "String",
    "connections": [
      {
        "platform": "String",
        "access_token": "String",
        "refresh_token": "String"
      }
    ],
    "following": [
      "String"
    ],
    "subscribed_playlists": [
      "String"
    ],
    "preferred_genres": [
      "String"
    ],
    "stats": {
      "tracks": [
        {
          "track": "String",
          "count": "Number"
        }
      ],
      "genres": [
        {
          "genre": "String",
          "count": "Number"
        }
      ]
    }
  }
}
```

_Response when successful:_

```json
{
  "user": {
    "name": "String",
    "username": "String",
    "hashed_password": "String",
    "email": "String",
    "connections": [
      {
        "platform": "String",
        "access_token": "String",
        "refresh_token": "String"
      }
    ],
    "following": [
      "String"
    ],
    "subscribed_playlists": [
      "String"
    ],
    "preferred_genres": [
      "String"
    ],
    "stats": {
      "tracks": [
        {
          "track": "String",
          "count": "Number"
        }
      ],
      "genres": [
        {
          "genre": "String",
          "count": "Number"
        }
      ]
    }
  }
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## LOG OUT A USER

**`DELETE`** `/users/logout`

_Parameters:_ None

_Body:_ None

_Response when successful:_

Statuscode `200, successmessage`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET THE LOGGED IN USER 

**`GET`** `/users/active`

Get the logged in user

_Parameters:_ None

_Body:_ None

_Response when successful:_

```json
{
  "user": {
    "name": "String",
    "username": "String",
    "hashed_password": "String",
    "email": "String",
    "connections": [
      {
        "platform": "String",
        "access_token": "String",
        "refresh_token": "String"
      }
    ],
    "following": [
      "String"
    ],
    "subscribed_playlists": [
      "String"
    ],
    "preferred_genres": [
      "String"
    ],
    "stats": {
      "tracks": [
        {
          "track": "String",
          "count": "Number"
        }
      ],
      "genres": [
        {
          "genre": "String",
          "count": "Number"
        }
      ]
    }
  }
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET USER BY ID

**`GET`** `/users/:userID`

_Parameters:_ 

* `userID` - The id of the targeted user

_Body:_ None

_Response when successful:_

```json
{
  "user": {
    "name": "String",
    "username": "String",
    "hashed_password": "String",
    "email": "String",
    "connections": [
      {
        "platform": "String",
        "access_token": "String",
        "refresh_token": "String"
      }
    ],
    "following": [
      "String"
    ],
    "subscribed_playlists": [
      "String"
    ],
    "preferred_genres": [
      "String"
    ],
    "stats": {
      "tracks": [
        {
          "track": "String",
          "count": "Number"
        }
      ],
      "genres": [
        {
          "genre": "String",
          "count": "Number"
        }
      ]
    }
  }
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET FOLLOWING USERS BY USER ID

**`GET`** `/users/:userID/following`

_Parameters:_ 

* `userID` - The id of the targeted user

_Body:_ None

_Response when successful:_

```json
{
  "following": [
    {
    "name": "String",
    "username": "String",
    "hashed_password": "String",
    "email": "String",
    "connections": [
      {
        "platform": "String",
        "access_token": "String",
        "refresh_token": "String"
      }
    ],
    "following": [
      "String"
    ],
    "subscribed_playlists": [
      "String"
    ],
    "preferred_genres": [
      "String"
    ],
    "stats": {
      "tracks": [
        {
          "track": "String",
          "count": "Number"
        }
      ],
      "genres": [
        {
          "genre": "String",
          "count": "Number"
        }
      ]
    }
  }
  ]
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET USER BY USERNAME

**`GET`** `/users/username/:username`

_Parameters:_ 

* `username` - The username of the targeted user

_Body:_ None

_Response when successful:_

```json
{
  "user": {
    "name": "String",
    "username": "String",
    "hashed_password": "String",
    "email": "String",
    "connections": [
      {
        "platform": "String",
        "access_token": "String",
        "refresh_token": "String"
      }
    ],
    "following": [
      "String"
    ],
    "subscribed_playlists": [
      "String"
    ],
    "preferred_genres": [
      "String"
    ],
    "stats": {
      "tracks": [
        {
          "track": "String",
          "count": "Number"
        }
      ],
      "genres": [
        {
          "genre": "String",
          "count": "Number"
        }
      ]
    }
  }
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## FOLLOW PLAYLIST

**`POST`** `/users/:username/playlist`

_Parameters:_ 

* `username` - The username of the targeted user

_Body:_ None

_Response when successful:_

Statuscode `200`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## UNFOLLOW PLAYLIST

**`DELETE`** `/users/:username/playlist`

_Parameters:_ 

* `username` - The username of the targeted user

_Body:_ None

_Response when successful:_

Statuscode `200`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## CHECK IF USER FOLLOWS THE PLAYLIST

**`GET`** `/:userId/playlist/:playlistId`

_Parameters:_ 

* `userId` - The ID of the targeted user
* `playlistId` - The ID of the targeted playlist

_Body:_ None

_Response when successful:_

Statuscode `200, You follow this playlist!`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## FOLLOW USER

**`POST`** `/users/:username/follow`

_Parameters:_ 

* `username` - The username of the targeted user

_Body:_ followedUser

_Response when successful:_

Statuscode `200`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## UNFOLLOW USER

**`DELETE`** `/users/:username`

_Parameters:_ 

* `username` - The username of the targeted user

_Body:_ unFollowedUser

_Response when successful:_

Statuscode `200`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## CHECK IF USER FOLLOWS SOMEONE

**`GET`** `/:userId/following/:followedUserId`

_Parameters:_ 

* `userId` - The ID of the targeted user
* `followedUserId` - The ID of the followed user

_Body:_ None

_Response when successful:_

Statuscode `200, You already follow this user!`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET GENRES FROM TRACKS

**`GET`** `/tracks/genres`

_Parameters:_ None

_Body:_ None

_Response when successful:_

```json
{
  "genres": [
    "String"
  ]
  
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET TRACK

**`GET`** `/tracks/track/:trackID`

_Parameters:_

* `trackID` - The id of targeted track

_Body:_ None

_Response when successful:_

```json
{
  "track" : {
    "_id": "String",
    "name": "String",
    "artist": "String",
    "genres": "[String]",
    "platform": "String",
    "url_id": "String",
    "duration": "Number",
    "added_on": "Date",
}
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET TRACKS BY GENRE

**`GET`** `/tracks/genres/:genre`

_Parameters:_ 

* `genre` - The genre of the requested tracks

_Body:_ None

_Response when successful:_

```json
{
  "tracks": [
    {
      "name": "String",
      "artist": "String",
      "genre": [
        "String"
      ],
      "platform": "String",
      "url_id": "String",
      "duration": "Number",
      "added_on": "Date"
    }
  ]
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

## GET TRACK FROM SOUNDCLOUD

**`POST`** `/tracks/soundCloudTrack`

_Parameters:_ 

* `None` - None

_Body:_ SoundcloudTrack

_Response when successful:_

```json
{
  "tracks": [
    {
      "name": "String",
      "artist": "String",
      "genre": [
        "String"
      ],
      "platform": "String",
      "url_id": "String",
      "duration": "Number",
      "added_on": "Date"
    }
  ]
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------
 
## GET TOP 10 TRENDING SONGS

**`GET`** `/tracks/trending`

_Parameters:_ None

_Body:_ None

_Response when successful:_

```json
{
  "tracks": [
    {
      "genres": [
        "String"
      ],
      "_id": "String",
      "name": "String",
      "artist": "String",
      "platform": "String",
      "url_id": "String",
      "duration": "Number",
      "added_on": "String",
      "count": "Number"
    }
  ]
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------
 
## GET TRACKS BY ARTIST

**`GET`** `/tracks/artists/:artist`

_Parameters:_ 

* `artists` - The targeted artist

_Body:_ None

_Response when successful:_

```json
{
  "tracks": [
    {
      "genres": [
        "String"
      ],
      "_id": "String",
      "name": "String",
      "artist": "String",
      "platform": "String",
      "url_id": "String",
      "duration": "Number",
      "added_on": "String",
      "count": "Number"
    }
  ]
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## SET FAVORITE TRACK FOR USER

**`POST`** `/users/:userID/favoriteTrack`

_Parameters:_

* `userID` - The id of targeted user

_Body:_ 

```json
{
  "favorite_track" : {
    "_id": "String",
    "name": "String",
    "artist": "String",
    "genre": [
      "String"
    ],
    "platform": "String",
    "url_id": "String",
    "duration": "Number",
    "added_on": "Date"
  },
  }
}
```

_Response when successful:_

Statuscode `200, New favorite track has been successfully set`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET FOLLOWED PLAYLISTS

**`GET`** `/users/:userID/followedPlaylists`

_Parameters:_

* `userID` - The id of targeted user

_Body:_ 

```json
{
  "followed_playlists": "[String]"
}
```

_Response when successful:_

```json
{
  "playlists" : [{
    "_id": "String",
    "name": "String",
    "description": "String",
    "owner": "String",
    "ownerName": "String",
    "image_url": "String",
    "tracks": "[String]",
}]
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## GET STATS FROM A USER

**`GET`** `/users/:userId/stats`

_Parameters:_ 

* `userId` - The id of the current user

_Body:_ None

_Response when successful:_

```json
{
   "genres": [
        {
            "_id": "String",
            "genre": "String",
            "count": "Number"
        }
    ],
    "tracks": [
        {
            "genres": ["String"],
            "_id": "String",
            "name": "String",
            "artist": "String",
            "platform": "String",
            "url_id": "String",
            "duration": "Number",
            "added_on": "String",
            "count": "Number"
        }
    ],
    "artists": [
        {
            "artist": "String",
            "count": "Number"
        }
    ]
}
```

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## ADD A TRACK TO USER STATS AND/OR RAISE RAISE COUNT

**`PUT`** `/users/:userId/stats`

_Parameters:_ 

* `userId` - The id of the current user

_Body:_

```json
{
  "track": {
    "_id": "String",
    "name": "String",
    "artist": "String",
    "genre": [
      "String"
    ],
    "platform": "String",
    "url_id": "String",
    "duration": "Number",
    "added_on": "Date"
  }
}
```

_Response when successful:_

Statuscode `200`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## CHECK IF USER FOLLOWS SOMEONE

**`GET`** `/users/:userId/following/:followedUserId`

_Parameters:_ 

* `userId` - The id of the current user
* `followedUserId` - The id of the user that is going to be checked

_Body:_ None

_Response when successful:_

Statuscode `200`

_Response when unsuccessful:_

Statuscode `500, errormessage`

-------------

## SPOTIFY TOKEN REQUEST

**`POST`** `/users/token`

_Parameters:_ None

_Body:_ None

_Response when successful:_

Statuscode `200`

_Response when unsuccessful:_

Statuscode `500, errormessage`

