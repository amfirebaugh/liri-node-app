# Liri Node App

This Node.js app takes in a few select command line arguments, calls API's to request information, and prints out a response for the user with  relevant information.

## Usage / Commands

In the command line you can type "node liri.js", then enter, and the application will provide you the below response, providing the formatting guide:

```
** Type a request using the following examples below as a guide: **
   node liri.js concert-this <band name>
   node liri.js spotify-this-song <song name>
   node liri.js movie-this <movie name>
   node liri.js do-what-it-says
```

## Examples:

```
node liri.js concert-this Creedence Clearwater Revival
```
![image of concert-this](/images/concertThis_band.JPG)

If you forget to enter an artist or band name here's what will happen:

![image of concert-this noinput](/images/concertThis_noInput.JPG)

```
node liri.js spotify-this-song Bad Moon Rising
```
![image of spotify-this-song](/images/spotifyThis_song.JPG)

If you forget to enter a song name here's what will happen:

![image of spotify-this-song noinput](/images/spotifyThis_noInput.JPG)

```
node liri.js movie-this Forest Gump
```
![image of movie-this](/images/movieThis_title.JPG)

If you forget to enter a movie title here's what will happen:

![image of movie-this noinput](/images/movieThis_noInput.JPG)

```
node liri.js do-what-it-says
```
![image of do-what-it-says default](/images/doWhatItSays_spotify.JPG)

### Do What It Says

To Change what this function does, you must alter the random.txt file. If you empty this file and run "node liri.js do-what-it-says" then the response will provide instructions on how to format the text inside the random.txt file to make sure this function provides the desired responses. Those instructions look like:

```
I'm sorry I don't know what to run. Make sure the random.txt file has the correct formatting. Choose an option below, follow the guide, and insert it into the random.txt file. Then you can run the command line 'node liri.js do-what-it-says' to get the proper response.
    spotify-this-song,"<song title>"
    movie-this,"<movie-title>"
    concert-this,<artist/band name (note-without quotations!)>
```
If you correctly change the random.txt file you can get various responses. Here are a few more examples of this function:

![image of do-what-it-says concert](/images/doWhatItSays_concert.JPG)

![image of do-what-it-says movie](/images/doWhatItSays_movie.JPG)
