# Sprint planning : Sprint 2
Attendees: Diégo Cup | Pepijn van Erp | Vu Le | Ruben Pruijssers <br> 
Product Owner: Bart van der Wal <br>
Date: November 30th 2020
## Goal

## Meetings

## Additional tasks
- Notes (TODOs) bij routes in server verbeteren
- Check current tests
- Add validation to playlist- and register-page
- Example population for the database, filled with tracks
- Planning poker

## User stories

## Advice
| US# | Userstory |
|------|-----------|
| 22 | As a T-Vibe user, I want to be able to connect my existing SoundCloud account, so that I can import my music from the API of the platform. |
| 2 | As a T-Vibe user, I want to listen to a radio-station that generates a song list based on a genre, so that I can discover new music. | 
| 12 | As a T-Vibe user, I want to be able to follow the playlists of other users, so that I can discover and experience a wider range of music. |
| 27 | As a T-Vibe user, I want to be able to search for playlists, so that I can follow playlists from other users. |2 |:x: |
| 5 | As a T-Vibe user, I want to be able to follow other users, so that I can follow their music interests. |
| 28 | As a T-Vibe user, I want to be able to search for users, so that I can follow other users. |2 |:x: |
| 4 | As a T-Vibe user, I want a personal page with my most listened genres, artists and tracks, so that I can share those with my followers. | 

## Remarks from Product Owner
- When searching for playlists, a default is to show the most popular playlists with a maximum number.
Paging is optional when searching for playlists.
In case of empty search results, show notification on the UI.
- Create wireframes of the search screens (playlist and user).
- Top 10 songs, artists, genres at the bottom of the profile page. The profile page is different from the wireframe.
- Remove 'username' acceptance criteria from user story 4.
- Maybe a separate user story for increasing the count of each top 10 list.
- If you receive a 30 sec sample from Spotify, you will receive an on-boarding message.
- Log in to Spotify instead of redirecting the same screen, go to a new tab.
- Give an update to Bart during the Sprint: next Monday 14:00.
- Think about how the top 10 songs, genres and artists will be updated.

# Product backlog
| US# | User Story | Sprint | Done |
|------|-----------|--------|------|
| 6 | As a T-Vibe user, I want to be able to connect my existing Spotify account, so that I can import my music from the API of the platform. |1 | :heavy_check_mark: |
| 1 | As a T-Vibe user, I want to create a playlist, so that I can add tracks to it. |1 |:heavy_check_mark: |
| 13 | As a T-Vibe user, I want to be able to see the tracks that I added to my playlist. |1 |:heavy_check_mark: |
| 14 | As a T-Vibe user, I want to edit a playlist so that I can remove or add a new track to it. |1 |:heavy_check_mark: |
| 15 | As a T-Vibe user, I want to see an overview of all my playlists so that I select the playlist with tracks that I would like to listen to. |1 |:heavy_check_mark: |
| 3 | As a T-Vibe user, I want to be able to register and login to an account, so that I can have a personal experience. |1 |:heavy_check_mark: |
| 22 | As a T-Vibe user, I want to be able to connect my existing SoundCloud account, so that I can import my music from the API of the platform. |2 |:x: |
| 2 | As a T-Vibe user, I want to listen to a radio-station that generates a song list based on a genre, so that I can discover new music. |2 |:x: | 
| 12 | As a T-Vibe user, I want to be able to follow the playlists of other users, so that I can discover and experience a wider range of music. |2 |:x: |
| 27 | As a T-Vibe user, I want to be able to search for playlists, so that I can follow playlists from other users. |2 |:x: |
| 5 | As a T-Vibe user, I want to be able to follow other users, so that I can follow their music interests. |2 |:x: |
| 28 | As a T-Vibe user, I want to be able to search for users, so that I can follow other users. |2 |:x: |
| 4 | As a T-Vibe user, I want a personal page with my most listened genres, artists and tracks, so that I can share those with my followers. |2 |:x: | 
| 7 | As a T-Vibe user, I want to be able to follow my friend’s activity, so that I know what type of content they like. | |:x: |
| 23 | As a T-Vibe user, I want to be able to connect my existing YouTube account, so that I can import my music from the API of the platform. | |:x: |
| 16 | As a T-Vibe user, I want to be able to sort the tracks in my playlist so that I can determine the order of the tracks in my playlist. | |:x: | 
| 8 | As a T-Vibe user, I want to be able to change my personal information and preferences, so that I can change incorrect information about me as a user. | |:x: |
| 11 | As a T-Vibe user, I want to be able to select my favourite song, that overrides my most listened song, so that I can create a more accurate profile. | |:x: |
| 26 | As a T-Vibe user, I want to be able to change my password, so that I can secure my account better. | |:x: |
| 25 | As a T-Vibe user, I want to be able to add an icon to a playlist so that I can personalize my playlist more. | |:x: |
| 10 | As a T-Vibe user, I want to be able to see song suggestions when a friend is listening to a specific genre, so that I can discover new genres. | |:x: |
| 9 | As a T-Vibe user, I want to listen to a radio-station that generates a song list based on trending songs, so that I can listen to the current trending songs. | |:x: |
| 24 | As a T-Vibe user, I want to listen to a radio-station that generates a song list based on another song based on input, so that I can discover new music. | |:x: |
| 20 | As a T-Vibe user, I want to listen to a radio-station that generates a song list based on trending artists, so that I can listen to the current trending artists. | |:x: |
| 21 | As a T-Vibe user, I want to listen to a radio-station that generates a song list based on trending genres, so that I can listen to the current trending genres. | |:x: |
| 17 | As a T-Vibe user, I want to retrieve my settings and preferences from my Spotify-account, so that it’s all synced. | |:x: | 
| 18 | As a T-Vibe user, I want to retrieve my settings and preferences from my SoundCloud-account, so that it’s all synced. | |:x: | 
| 19 | As a T-Vibe user, I want to retrieve my settings and preferences from my YouTube-account, so that it’s all synced. | |:x: | 

### Acceptance criteria

| US#.AC# | Acceptance criteria |
|-----------|---------------------|
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
| 4.1 | The username of the current user will be shown in the profile-page. |
| 4.2 | The emailadres of the current user will be shown in the profile-page. |
| 4.3 | The firstname of the current user will be shown in the profile-page. |
| 4.4 | The lastname of the current user will be shown in the profile-page. |
| 4.5 | The top 10 songs of the current user will be shown in the profile-page. |
| 4.6 | The top 10 genres of the current user will be shown in the profile-page. |
| 4.7 | The top 10 artists of the current user will be shown in the profile-page. |
