#### FriendsActivityComponent
Receives message "FRIEND_ONLINE_MESSAGE" from server:
```json
{
  "type": "FRIEND_ONLINE_MESSAGE",
  "username": "String"
}
```
Receives message "LISTENING_TRACK_MESSAGE" from server:
```json
{
  "type": "FRIEND_ONLINE_MESSAGE",
  "username": "String",
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
Receives message "FRIEND_OFFLINE_MESSAGE" from server:
```json
{
  "type": "FRIEND_OFFLINE_MESSAGE",
  "username": "String"
}
```
Receives message "FOLLOWING_ONLINE_MESSAGE" from server:
```json
{
  "type": "FOLLOWING_ONLINE_MESSAGE",
  "username": "String"
}
```
Receives message "FOLLOWER_REMOVED_MESSAGE" from server:
```json
{
  "type": "FOLLOWER_REMOVED_MESSAGE",
  "username": "String"
}
```
#### PlaylistComponent
Sends message "LISTENING_MESSAGE" to server:
```json
{
   "type": "LISTENING_MESSAGE",
   "username": "String",
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

#### RadioComponent
Sends message "LISTENING_MESSAGE" to server:
```json
{
   "type": "LISTENING_MESSAGE",
   "username": "String",
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

#### LoginComponent
Sends message "LOGIN_MESSAGE" to server:
```json
{
  "type": "LOGIN_MESSAGE",
  "username": "String"
}
```

#### HeaderComponent
Sends message "LOGOUT_MESSAGE" to server:
```json
{
  "type": "LOGOUT_MESSAGE",
  "username": "String"
}
```

#### FriendsPageComponent
Sends message "ADDED_FOLLOWER_MESSAGE" to server:
```json
{
  "type": "ADDED_FOLLOWER_MESSAGE",
  "username": "String"
}
```
Sends message "REMOVED_FOLLOWER_MESSAGE" to server:
```json
{
  "type": "REMOVED_FOLLOWER_MESSAGE",
  "username": "String"
}
```

#### Server
Receive message "LOGOUT_MESSAGE" from HeaderComponent:
```json
{
  "type": "LOGOUT_MESSAGE",
  "username": "String"
}
```
Receive message "LISTENING_MESSAGE" from PlaylistComponent:
```json
{
   "type": "LISTENING_MESSAGE",
   "username": "String",
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
Receive message "LISTENING_MESSAGE" from RadioComponent:
```json
{
   "type": "LISTENING_MESSAGE",
   "username": "String",
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
Receive message "LOGIN_MESSAGE" from LoginComponent:
```json
{
  "type": "LOGIN_MESSAGE",
  "username": "String"
}
```

Sends message "FRIEND_ONLINE_MESSAGE" to FriendsActivityComponent:
```json
{
  "type": "FRIEND_ONLINE_MESSAGE",
  "username": "String"
}
```
Sends message "FOLLOWING_ONLINE_MESSAGE" to FriendsActivityComponent:
```json
{
  "type": "FOLLOWING_ONLINE_MESSAGE",
  "username": "String"
}
```
Sends message "FRIEND_OFFLINE_MESSAGE" to FriendsActivityComponent:
```json
{
  "type": "FRIEND_OFFLINE_MESSAGE",
  "username": "String"
}
```
Sends message "LISTENING_TRACK_MESSAGE" to FriendsActivityComponent:
```json
{
   "type": "LISTENING_TRACK_MESSAGE",
   "username": "String",
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
Sends message "FOLLOWER_REMOVED_MESSAGE" to FriendsActivityComponent:
```json
{
  "type": "FOLLOWER_REMOVED_MESSAGE",
  "username": "String"
}
```