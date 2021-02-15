# Data schemes

##Users

In the users-collection, all registered users will be stored with the following data:

```json
{
  "_id": "auto_id",
  "name": "String",
  "username": "String",
  "password": "String",
  "email": "String",
  "connections": [
    {
      "platform": "String",
      "client_id": "String"
    }
  ],
  "following": ["String"],
  "subscribed_playlists": ["Playlists"],
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
```

A few things should be noted about the users-collection:
* ```_id: auto_id``` is the auto generated ID by MongoDB / Mongoose
* ```password``` and the connected ```client_id``` _can_ be hashed in the future, but that will remain a low-prio task
* ```email``` is optional, since no e-mail related user stories (e.g. password resets) are of any importance
* ```subscribed_playlists``` will consist of embedded Playlists in the user-collection

## Playlists

In the playlists-collection, all user-created playlists, containing tracks, will be stored with the following data:

```json
{
  "_id": "auto_id",
  "name": "String",
  "description": "String",
  "owner": "String",
  "image_url": "String",
  "tracks": ["String"]
}
```

Some notes for the playlists-collection:
* ```_id: auto_id``` is the auto generated ID by MongoDB / Mongoose
* Both ```description``` and ```image_url``` are optional

## Tracks

In the tracks-collection, all fetched tracks will be stored with the following data (compatible with all three source-platforms):

```json
{
  "_id": "auto_id",
  "name": "String",
  "artist": "String",
  "genre": ["String"],
  "platform": "String",
  "url_id": "String",
  "duration": "Number",
  "added_on": "Date"
}
```

Some notes for the tracks-collection:
* ```_id: auto_id``` is the auto generated ID by MongoDB / Mongoose
* The ```genre``` is retrieved from Spotify and SoundCloud. YouTube does not support genres, so the field will be optional
* The ```url_id``` data may look a bit different for all platforms, but since all are stored as Strings, it makes no difference, database-wise. Examples:
    * Spotify: ```0byVagxG4X0vUxpnbZGfDD```
    * YouTube: ```dQw4w9WgXcQ```
    * SoundCloud: ```django-wagner/kali```
* The ```duration``` will be stored as a number, in milliseconds