
// Everything needed to immport and initial configurations:
require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");

// storing command line arguments
var nodeArg = process.argv;
// initializing the user input as a string
var userInput = "";

// inspect nodeArg starting at index 3
for (var i = 3; i < nodeArg.length; i++) {
    // if nodeArg has index greater than 3, concatinate adding '+' between the words
    if (i > 3 && i < nodeArg.length) {
        userInput += '+' + nodeArg[i];
    } else {
        userInput += nodeArg[i];
    }
}

// switch statement to evaluate user input
switch (nodeArg[2]) {
    case "movie-this":
        movieThis(userInput);
        break;
    case "concert-this":
        concertThis(userInput);
        break;
    case "spotify-this-song":   
        spotifyThis(userInput); 
        break;
    case "do-what-it-says":
        // takes no args
        doWhatItSays();
        break;
    default:
        console.log('** Type a request using the following examples below as a guide: **' +
        'node liri concert-this <band name> \n' +
        'node liri spotify-this-song <song name> \n' +
        'node liri movie-this <movie name> \n' +
        'node liri do-what-it-says \n'
        );
        process.exit();
    }

// concertThis is the function that uses axios to call the Bands in Town Artist Events API, uses the user input, and then prints out information about an upcoming event
function concertThis(artist) {
    if(!artist) {
        console.log("Please enter an artist or band for this search. In the meantime here is the information for The Lumineers...");
        axios.get("https://rest.bandsintown.com/artists/the+lumineers/events?app_id=codingbootcamp").then(function(response) {
        // getting info from Bands in Town Artist Events API and printing to console...
            var conResp = response.data[0];
            var concertDate = moment(conResp.datetime).format('MM-DD-YYYY');
            var concertInfoTL = (`
                Venue Name: ${conResp.venue.name}
                Venue City: ${conResp.venue.city}
                Date of this Event: ${concertDate}
            `);
            console.log(concertInfoTL);
            process.exit();
        });
    }
    var queryURL1 = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    
    axios.get(queryURL1).then(function(response) {
        if (response.data.length === 0 || response.data.includes("warn=Not found")) {
            console.log("No concert information is available for: " + artist + ". Please try another!");
        } else {
            // getting info from Bands in Town Artist Events API and printing to console...
            var conResp = response.data[0];
            var concertDate = moment(conResp.datetime).format('MM-DD-YYYY');
            var concertInfo = (`
            Venue Name: ${conResp.venue.name}
            Venue Location: ${conResp.venue.city}, ${conResp.venue.country}
            Date of this Event: ${concertDate}
            `);
            console.log(concertInfo);
            // process.exit();
        }
    });
}

// spotifyThis is the function that calls the spotify API from the user input to print out information about a song
function spotifyThis(song) {
    if (!song) {
        console.log("Please enter a song for this search.");
        process.exit();
        // I can't get the below code to work but I don't want to give up on it either... I've been digging through the spotify documentation like crazy to try to figure it out, I've tried many variations of the code below for several hours and I'm stuck...might need some help... not sure why this one is so tough...

        // console.log("Please enter a song for this search. In the meantime here is the information for The Sign by Ace of Base...");
        // spotify.search({ type: 'track', query: 'The Sign' }).then(function(response) {
        //     var songAB = response.tracks.items;
        //     console.log(songAB);
        //     for (var i = 0; i < songAB.length; i++) {
        //         var songInfoAB = (`
        //         Song Title: ${songAB[10].name}
        //         Artist(s): ${songAB[10].artists[0].name}
        //         Album: ${songAB[10].album.name}
        //         Preview URL: ${songAB[10].preview_url}
        //         `);
        //         console.log(songInfoAB);
        //     }
        // });
        
    }
    spotify.search({type: "track", query: song, limit: 5}).then(function(response) {
        if (response.tracks.items.length === 0) {
            console.log("Sorry, even Spotify couldn't find this song. Please try another song.");
            process.exit();
        }
        
        var song = response.tracks.items;
        for (var i = 0; i < song.length; i++) {
            var songInfo = (`
            Song Title: ${song[i].name}
            Artist(s): ${song[i].artists[0].name}
            Album: ${song[i].album.name}
            Preview URL: ${song[i].preview_url}
            `);
            console.log(songInfo);
            // below caps the number of responses to 5 because spotify will give the first 20 or so...it's too many in my opinion! (changed my mind and used the spotify documentation and used limit: 5 in the ajax call)
            // if (i === 4) {
            //     break;
            // }
            // process.exit();
        }
    }).catch(function(error) {
        console.log(error);
    });
}

// movieThis is the function that calls the OMDB API based on user input and prints out information about that movie
function movieThis(movie) {
    if (!movie) {
        console.log("Please enter a movie for this search. In the meantime here is the information for Mr. Nobody...");
        // right now this works sometimes and other times doesn't work and I think it has to do with my process.exit()'s throughout, but the fact that my application works perfectly sometimes and other times will hit some of my user input validation console log's is very confusing... I don't understand what's going on...
        axios.get("http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=c10bfc5e").then(function(response) {
            // getting info from OMDB and printing to console...
            var movieInfoMN = (`
            Title: ${response.data.Title}
            Year: ${response.data.Year}
            Rated: ${response.data.Rated}
            IMDB Score: ${response.data.Ratings[0].Value}
            Rotten Tomatoes Score: ${response.data.Ratings[1].Value}
            This movie was produced in this country: ${response.data.Country}
            Languages: ${response.data.Language}
            Plot: ${response.data.Plot}
            Actors: ${response.data.Actors}
            `);
            console.log(movieInfoMN);
            process.exit();
            });
    }
        

    var queryURL3 = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=c10bfc5e";

    axios.get(queryURL3).then(function(response) {
        if (response.data.Error) {
            console.log(`${response.data.Error}`);
            console.log("Hmm...try another movie title.");
            process.exit();
        }

        // getting info from OMDB and printing to console...
        var movieInfo = (`
        Title: ${response.data.Title}
        Year: ${response.data.Year}
        Rated: ${response.data.Rated}
        IMDB Score: ${response.data.Ratings[0].Value}
        Rotten Tomatoes Score: ${response.data.Ratings[1].Value}
        This movie was produced in this country: ${response.data.Country}
        Languages: ${response.data.Language}
        Plot: ${response.data.Plot}
        Actors: ${response.data.Actors}
        `);
        console.log(movieInfo);
        process.exit();
    });
}

// the doWhatItSays function takes the random.txt file, reads it, and takes the text inside it as input for the functions inside this application so that Liri will work all the same
function doWhatItSays() {
    
    // read from random.txt
    fs.readFile("random.txt","utf8", function(err, data) {
        var entries = data.split(',');
        switch (entries[0]) {
            case "movie-this":
                movieThis(entries[1]);
                break;
            case "concert-this":
                concertThis(entries[1]);
                break;
            case "spotify-this-song":   
                spotifyThis(entries[1]); 
                break;
            default:
                console.log(`I'm sorry I don't know what to run. Make sure the random.txt file has the correct formatting. Choose an option below, follow the guide, and insert it into the random.txt file. Then you can run the command line 'node liri.js do-what-it-says to get the proper response.` +
                `spotify-this-song,"<song title>"` +
                `movie-this,"<movie-title>"` +
                `concert-this,<artist/band name (note-without quotations!)>
                `);
        }
    }); 
}
