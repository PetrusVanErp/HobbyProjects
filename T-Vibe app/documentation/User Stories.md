# User Stories

The system administrator basically has tasks that your average system admin has. So we are going to show you a more in depth look into what the T-Vibe user can do.
To be able to show what a T-Vibe user can do in a more in depth way we created user stories. For each user story, the sprint number, and whether the user story is completed or not, also included in each row. 

| US# | User Story | Sprint | Done |
|------|-----------|--------|------|
| 6 | As a T-Vibe user, I want to be able to connect my existing Spotify account, so that I can import my music from the API of the platform. |1 | :heavy_check_mark: |
| 1 | As a T-Vibe user, I want to create a playlist, so that I can add tracks to it. |1 |:heavy_check_mark: |
| 13 | As a T-Vibe user, I want to be able to see the tracks that I added to my playlist. |1 |:heavy_check_mark: |
| 14 | As a T-Vibe user, I want to edit a playlist so that I can remove or add a new track to it. |1 |:heavy_check_mark: |
| 15 | As a T-Vibe user, I want to see an overview of all my playlists so that I select the playlist with tracks that I would like to listen to. |1 |:heavy_check_mark: |
| 3 | As a T-Vibe user, I want to be able to register and login to an account, so that I can have a personal experience. |1 |:heavy_check_mark: |
| 22 | As a T-Vibe user, I want to be able to connect my existing SoundCloud account, so that I can import my music from the API of the platform. |2 |:heavy_check_mark: |
| 2 | As a T-Vibe user, I want to listen to a radio-station that generates a song list based on a genre, so that I can discover new music. |2 |:heavy_check_mark: | 
| 12 | As a T-Vibe user, I want to be able to follow the playlists of other users, so that I can discover and experience a wider range of music. |2 |:heavy_check_mark:|
| 27 | As a T-Vibe user, I want to be able to search for playlists, so that I can follow playlists from other users. |2 |:heavy_check_mark: |
| 5 | As a T-Vibe user, I want to be able to follow other users, so that I can follow their music interests. |2 |:heavy_check_mark:|
| 28 | As a T-Vibe user, I want to be able to search for users, so that I can follow other users. |2 |:heavy_check_mark: |
| 4 | As a T-Vibe user, I want a personal page with my most listened genres, artists and tracks, so that I can share those with my followers. |2 |:heavy_check_mark: | 
| 7 | As a T-Vibe user, I want to be able to follow my friend’s activity, so that I know what type of content they like. |3 |:heavy_check_mark: |
| 23 | As a T-Vibe user, I want to be able to connect my existing YouTube account, so that I can import my music from the API of the platform. | |:x: |
| 16 | As a T-Vibe user, I want to be able to sort the tracks in my playlist so that I can determine the order of the tracks in my playlist. |2 |:heavy_check_mark: | 
| 8 | As a T-Vibe user, I want to be able to change my personal information and preferences, so that I can change incorrect information about me as a user. |2 |:heavy_check_mark: |
| 11 | As a T-Vibe user, I want to be able to select my favourite song, that overrides my most listened song, so that I can create a more accurate profile. |3 |:heavy_check_mark: |
| 26 | As a T-Vibe user, I want to be able to change my password, so that I can secure my account better. |3 |:heavy_check_mark: |
| 25 | As a T-Vibe user, I want to be able to add an icon to a playlist so that I can personalize my playlist more. | |:x:|
| 10 | As a T-Vibe user, I want to be able to see song suggestions when a friend is listening to a specific genre, so that I can discover new genres. |3 |:heavy_check_mark: |
| 9 | As a T-Vibe user, I want to listen to a radio-station that generates a song list based on trending songs, so that I can listen to the current trending songs. |3 |:heavy_check_mark: |
| 24 | As a T-Vibe user, I want to listen to a radio-station that generates a song list based on another song based on input, so that I can discover new music. |3 |:heavy_check_mark: |
| 20 | As a T-Vibe user, I want to listen to a radio-station that generates a song list based on trending artists, so that I can listen to the current trending artists. |3 |:heavy_check_mark: |
| 21 | As a T-Vibe user, I want to listen to a radio-station that generates a song list based on trending genres, so that I can listen to the current trending genres. |3 |:heavy_check_mark: |
| 17 | As a T-Vibe user, I want to retrieve my settings and preferences from my Spotify-account, so that it’s all synced. | |:x: | 
| 18 | As a T-Vibe user, I want to retrieve my settings and preferences from my SoundCloud-account, so that it’s all synced. | |:x: | 
| 19 | As a T-Vibe user, I want to retrieve my settings and preferences from my YouTube-account, so that it’s all synced. | |:x: | 
| 29 | As a T-Vibe user, I want to be able to see all my friends in an overview, so that I can track which users I am following. |3 |:heavy_check_mark: |
| 30 | As a T-Vibe user, I want to be able to look at a friends profile page, so that I can see his/her favorite tracks, artists and genres. |3 |:heavy_check_mark: |

## Acceptance criteria
All user stories need to be in line with de DoD (Definition of Done). 
The numbers are according to the user stories shown above.

| US#.AC# | Acceptance criteria |
|-----------|---------------------|
| 6.1 | A user should not have to login every time they want to listen to a song or add a song to his/her playlist. |
| 6.2 | There should be a settings page with a connection button to Spotify. |
| 6.3 | Check if you are connected to Spotify (UI). |
| 1.1 | Add track by using a SoundCloud, Youtube or Spotify url. |
| 1.2 | Get redirected to the page with the playlist. |
| 1.3 | You can only add tracks from platforms to which you are connected. |
| 1.4 | Add description to playlist. |
| 13.1 | Show name, platform of origin (icon), artist and date added. |
| 13.2 | If you click on a track, an iFrame should pop up. |
| 13.3 | Search for a track in a playlist. |
| 14.1 | Add track by using a SoundCloud, Youtube or Spotify url. |
| 14.2 | You can only add tracks from platforms to which you are connected. |
| 14.3 | Get redirected to the page with the playlist. |
| 14.4 | Add description to playlist. |
| 15.1 | Show only the playlists that the user either follows or created. |
| 15.2 | Show the first 4 tracks in the playlist. |
| 15.3 | If you click on the View-button of a playlist, the user goes to the clicked playlist. |
| 3.1 | Fill in registration form with username, firstname, lastname, password and confirm password. |
| 3.2 | Fill in login form using correct username and password. |
| 3.3 | When you succesfully logged in you should be redirected to the homepage. |
| 3.4 | When you succesfully registrated as a user you should be redirected to the login page. |
| 3.5 | There should be a welcome page for users who are not logged in yet. |
| 22.1 | A user should not have to login every time they want to listen to a song or add a song to his/her playlist. |
| 22.2 | There should be a settings page with a connection button to SoundCloud. |
| 22.3 | Check if you are connected to SoundCloud (UI). |
| 2.1 | Show a list of random genres. |
| 2.2 | If you click on a genre, a playlist with tracks based on that genre will be generated. |
| 12.1 | There is a follow-button on the selected playlist-page ( -> US3). |
| 27.1 | You can search for playlists in the search bar of the header. |
| 27.2 | There is a search results page with the results of a playlist search. |
| 27.3 | If you click on a playlist in the search results page, the selected playlist will be shown ( -> US3). |
| 5.1 | There is a follow-button on the selected user-page ( -> US4). |
| 28.1 | You can search for users in the search bar of the header. |
| 28.2 | There is a search results page with the results of a user search. |
| 28.3 | If you click on a user in the search results page, the selected user will be shown ( -> US4). |
| 4.1 | The emailadres of the current user will be shown in the profile-page. |
| 4.2 | The firstname of the current user will be shown in the profile-page. |
| 4.3 | The lastname of the current user will be shown in the profile-page. |
| 4.4 | The top 10 songs of the current user will be shown in the profile-page. |
| 4.5 | The top 10 genres of the current user will be shown in the profile-page. |
| 4.6 | The top 10 artists of the current user will be shown in the profile-page. |
| 16.1 | There is an up-arrow as button to move the track up in the playlist.  |
| 16.2 | There is an down-arrow as button to move the track down in the playlist.  |
| 16.3 | The first track in the playlist does not have an up-arrow button.  |
| 16.4 | The last track in the playlist does not have an down-arrow button.  |
| 8.1 | The emailadres of the current user can be updated. |
| 8.2 | The firstname of the current user can be updated. |
| 8.3 | The lastname of the current user can be updated. |
| 7.1 | You can see a box on the home screen, where the user you follow and music-track he/she is listening to, are defined in. |
| 7.2 | As soon as you unfollow a user you should not be able to see what music they are listening to when they are listening to it on the homescreen anymore. |
| 11.1 | On the profile page of the logged in user, there should be a button and text field so that the user can tell others what their favorite song is. |
| 26.1 | There is a textfield where you can enter your current password.|
| 26.2 | There is a textfield where you can enter your new password. |
| 26.3 | The user has to know their current password in order for them to change their password. |
| 10.1 | When a friend of the logged in user is online and listening to a song, the logged in user should see a song suggestion based on the genre of the song that their friend is listening to. |
| 10.2 | There is an I-frame with the suggested song beneath the song that a friend is currently playing. |
| 9.1 | A playlist with suggested tracks will be created based on the user stats (songs) of all users on T-Vibe. |
| 9.2 | There is an I-frame with the random track chosen from the playlist. |
| 24.1 | There should be a textfield on the homescreen that asks the user to give a valid song url |
| 24.2 | A playlist with suggested tracks based on that song will be generated. |
| 24.3 | There is an I-frame with the random track chosen from the playlist. |
| 20.1 | A playlist with suggested tracks will be created based on the user stats (artist) of all users on T-Vibe. |
| 20.2 | There is an I-frame with the random track chosen from the playlist. |
| 21.1 | A playlist with suggested tracks will be created based on the user stats (genres) of all users on T-Vibe. |
| 21.2 | There is an I-frame with the random track chosen from the playlist. |
| 29.1 | There should be a unfollow button for each friend. |
| 29.2 | There should be a view profile button for each friend. |
| 29.3 | For each friend, the username should be shown. |
| 29.4 | As soon as you unfollow a friend, said friend should not be shown in the list anymore. |
| 30.1 | The firstname of your friend should be shown on his/her profile page. |
| 30.2 | The lastname of your friend should be shown on his/her profile page. |
| 30.3 | The email address of your friend should be shown on his/her profile page. |
| 30.4 | The top 10 genres of your friend should be shown on his/her profile page. |
| 30.5 | The top 10 tracks of your friend should be shown on his/her profile page. |
| 30.6 | The top 10 artists of your friend should be shown on his/her profile page. |
| 30.7 | The favorite song of your friend should be shown on his/her profile page. |



