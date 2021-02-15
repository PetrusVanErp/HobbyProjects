# Research Spotify API
Research done by: Diégo Cup
<br>
Date: November 13th 2020
<br>
Reviewed by:

## Purpose
This research is meant to explore the Spotify API and how it can be used in our project. Because none of the group members know how this API works, a research has to be performed to. This research will highlight the aspects of the Spotify API that can be used in our project. By naming the pros and cons of this API, we can determine potential risks when using it.
In order to sure that the Spotiy API can be used in our project effectively, a prototype has to be made. This prototype will cover all the functionalities of the API we want to use in our project.

The outcome of this research will be determined by the results of the pros/cons stocktaking and the usability of the constructed prototype. These aspects are divided below into sub-questions.

## Main and sub questions
### Main question
Which aspects of the Spotify API can be used for this project?
### Sub questions
What are some technical pros and cons about the Spotify API?<br>
How can these aspects be implemented (in this project)?
## Elaboration
### What are some technical pros and cons about the Spotify API?
Pros:<br>
1. The requests to the Spotify API are easily constructed en can be made very specific if necessary
2. The player widget of Spotify can be used to play tracks/playlists

Cons:<br>
1. The user has to connect the T-Vibe application to his/her Spotify account before it can be used
2. In order to send requests to the Spotify API, a token is required (a.k.a. the user has to be logged in)
3. The MP3-file of a track cannot be retrieved from the API

The use of the Spotify API definitely has some advantages. For example: you can easily set up requests to get the data you want. If you want to retrieve all possible genres from the API, you can simply send a request to the genres route.Alot of functionalities of T-Vibe can be completed with this API.<br>
One of the disadvantages of this API is that the user has to be logged in to connect with it. A token has to be attached to every request, otherwise the request won't work. This token can only be generated when the user has connected the T-Vibe application to his/her Spotify account. These disadvantages make it a little bit trickier to use the Spotify API. Additional steps have to be performed to be able to use it. 
### How can these aspects be implemented (in this project)?
I've made a prototype of a small functionality that can be used in the T-Vibe application. In this prototype the user can post a link of a track and press a 'Search'-button. When performing this action, the user connects to the Spotify API with a client ID and client secret (these have to be specified in the source code first!) and the application then sends a request for that specific track, retrieves the data and displays it on the screen. Only the name of the track, the name of the artist, the name of the album and the album cover are being displayed. 
This is a link to the prototype: [Prototype](src)

## Conclusion
When comparing all the pros and cons and reviewing the prototype I noticed that even though there are some problems and difficulties when using the Spotify API, the functionality it offers is extremely valuable to the T-Vibe application. The data this API offers is exactly the data we need to implement our application. Also the prototype didn't take long to construct. Mainly because there are alot tutorials to follow regarding the Spotify API. I'm positive that we can use the Spotify API in our application and that it can lead to a succesful product.

## Pages to remember!
Using the searchbar API from Spotify
https://developer.spotify.com/documentation/web-api/reference/search/search/
<br> Register application https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app
<br>