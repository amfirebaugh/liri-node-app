
// Everything needed to immport and initial configurations:
require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var now = moment();

// storing command line arguments
var nodeArg = process.argv;
// initializing the user input as a string
var userInput = "";

// inspect nodeArg starting at index 3
for (var i = 3; i < nodeArg.length; i++) {
    // if nodeArg has index greater than 3, concatinate adding '+' between the words
    if (i > 3 && i < nodeArg.length) {
        userInput+= '+' + nodeArg[i];
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
        console.log('USER INPUT FORMATTING: \n' +
        '** Type a request using the following examples below as a guide: **' +
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
            process.exit();
        }
    });
}

//* `spotify-this-song`
// `node liri.js spotify-this-song '<song name here>'`

//    * This will show the following information about the song in your terminal/bash window

//      * Artist(s)
//      * The song's name
//      * A preview link of the song from Spotify
//      * The album that the song is from

//    * If no song is provided then your program will default to "The Sign" by Ace of Base.


function spotifyThis(song) {
    if (!song) {
        console.log("Please enter a song for this search. In the meantime here is the information for ...");
        process.exit();
    }
    spotify.search({type: "track", query: song}).then(function(response) {
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
            // below caps the number of responses to 5 because spotify will give the first 20 or so...it's too many in my opinion!
            if (i === 4) {
                break;
            }
        }
    }).catch(function(error) {
        console.log(error);
    });
}


// movieThis is the function that calls the OMDB API based on user input and prints out information about that movie
function movieThis(movie) {
    if (!movie) {
        console.log("Please enter a movie for this search. In the meantime here is the information for Mr. Nobody...");
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

    });
}




//* `do-what-it-says`
// * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

//      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.

//      * Edit the text in random.txt to test out the feature for movie-this and concert-this.

function doWhatItSays() {
    
    // read from random.txt
    fs.readFile("random.txt","utf8", function(err, data) {
        var entries = data.split(',');
        // function call based on random.txt
        switch (entries[0]) {
        case "movie-this":
            movieSearch(entries[1]);
            break;
        case "concert-this":
            bandSearch(entries[1]);
            break;
        case "spotify-this-song":   
            musicSearch(entries[1]); 
            break;
        default:
            console.log("Please use one of the application commands.");
        }
    }); 
}



// ### BONUS

// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// * Make sure you append each command you run to the `log.txt` file. 
// * Do not overwrite your file each time you run a command.