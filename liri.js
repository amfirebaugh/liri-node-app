
// Everything needed to immport and initial configurations:
require("dotenv").config();
var fs = require('fs');
var axios = require('axios');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
// var now = moment();

// Make it so liri.js can take in one of the following commands:


//* `concert-this`
// `node liri.js concert-this <artist/band name here>`

//    * This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:

//      * Name of the venue
//      * Venue location
//      * Date of the Event (use moment to format this as "MM/DD/YYYY")



//* `spotify-this-song`
// `node liri.js spotify-this-song '<song name here>'`

//    * This will show the following information about the song in your terminal/bash window

//      * Artist(s)
//      * The song's name
//      * A preview link of the song from Spotify
//      * The album that the song is from

//    * If no song is provided then your program will default to "The Sign" by Ace of Base.



//* `movie-this`
// `node liri.js movie-this '<movie name here>'`

//    * This will output the following information to your terminal/bash window:

//      ```
//        * Title of the movie.
//        * Year the movie came out.
//        * IMDB Rating of the movie.
//        * Rotten Tomatoes Rating of the movie.
//        * Country where the movie was produced.
//        * Language of the movie.
//        * Plot of the movie.
//        * Actors in the movie.
//      ```

//    * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

//    * You'll use the `axios` package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use `trilogy`.

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

    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=c10bfc5e";

    axios.get(queryURL).then(function(response) {
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



// test for command line args
var nodeArg = process.argv;

// declare string as empty or else you get an 'undefined' as first element in array
var userInput = '';

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
        bandSearch(userInput);
        break;
    case "spotify-this-song":   
        musicSearch(userInput); 
        break;
    case "do-what-it-says":
        // takes no args
        doWhatItSays();
        break;
    default:
        console.log('SCRIPT USAGE: \n' +
        'node liri concert-this <band name> \n' +
        'node liri spotify-this-song <song name> \n' +
        'node liri movie-this <movie name> \n' +
        'node liri do-what-it-says \n' +
        '##### please format your request based on the examples above #####');
        process.exit();
    }

// ### BONUS

// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// * Make sure you append each command you run to the `log.txt` file. 
// * Do not overwrite your file each time you run a command.