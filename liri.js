var fs = require('fs');
var request = require('request');
// var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var action = process.argv[2];
var search = "";

for (var i = 3; i < process.argv.length; i++) {
    search += process.argv[i] + " ";
};

function errorFunction(respError) {
    if (respError) {
        return console.log("Error occured: ", respError);
     }
};

function my_tweets() {
    var client = new Twitter(keys.twitterKeys);
    var params = {
        screen_name: '@newtypecentral',
        count: 20
        };

    client.get('statuses/user_timeline', params, function(respError, tweets, response) {

        errorFunction();

        console.log("=========================================================================================================");
        console.log("=================== Tweetings ===========================================================================");
        console.log("=========================================================================================================");

        for (i = 0; i < tweets.length; i++) {
            console.log(i + 1 + ". Statement:", tweets[i].text);

            if (i + 1 > 9) {
                console.log("    Timestamp: ", tweets[i].created_at + "\n");
            } else {
                console.log("   Timestamp: ", tweets[i].created_at + "\n");
            }
        };
    });
};

function spotify_this_song(search) {
    if (search == "") {
        search = "Lips like Sugar";
    }

    var spotify = new Spotify(keys.spotifyKeys);
    var searchLimit = "";

    if (isNaN(parseInt(process.argv[3])) == false) {
        searchLimit = process.argv[3];

        console.log("\nYou requested to return: " + searchLimit + " songs");
        userSong = "";

        for (var i = 4; i < process.argv.length; i++) {
            userSong += process.argv[i] + " ";
          };
    } else {
        searchLimit = 1;
        }

    spotify.search({ type: 'track', query: search, limit: searchLimit }, function(respError, response) {
        errorFunction();
        var songResp = response.tracks.items;

        for (var i = 0; i < songResp.length; i++) {
            console.log("=====================================================================================================");
            console.log("=============== Spotifyings =========================================================================");
            console.log("=====================================================================================================");
            console.log(("Artist: " + songResp[i].artists[0].name));
            console.log(("Song title: " + songResp[i].name));
            console.log(("URL Preview: " + songResp[i].preview_url));
            console.log(("Album name: " + songResp[i].album.name));
        }
    })
};

function movie_this(userMovie) {
    if (userMovie == "") {
        userMovie = "Amelie";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + userMovie.trim() + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(respError, response, body) {
        errorFunction();
        if (JSON.parse(body).Error == 'Movie not found!' ) {
            console.log("Your movie: " + userMovie + ", doesn't exist")
        } else {
            movieBody = JSON.parse(body);

            console.log("=====================================================================================================");
            console.log("======================== Movie-ings =================================================================");
            console.log("=====================================================================================================");
            console.log("Movie: " + movieBody.Title);
            console.log("Year: " + movieBody.Year);
            console.log("Rating: " + movieBody.imdbRating);

            if (movieBody.Ratings.length < 2) {
                console.log("To bad your movie sucks so much that there's no info for it")
            } else {
                console.log("Rating: " + movieBody.Ratings[[1]].Value);
            }
            console.log("Country: " + movieBody.Country);
            console.log("Language: " + movieBody.Language);
            console.log("Plot: " + movieBody.Plot);
            console.log("Actors: " + movieBody.Actors);
        };
    });
};

function do_what_it_says() {
    fs.readFile("random.txt", "utf8", function(respError, data) {
        var random = data.split(',');
        errorFunction();
        if (random[0] == "spotify_this_song") {
            spotify_this_song(random[1]);
        } else if (random[0] == "movie_this") {
            movie_this(random[1]);
        } else {
            my_tweets();
        }
    });
};

switch (action) {
    case "my_tweets":
        my_tweets();
        break;
    case "spotify_this_song":
        spotify_this_song(search);
        break;
    case "movie_this":
        movie_this(search);
        break;
    case "do_what_it_says":
        do_what_it_says();
        break;
    default:
        console.log("Yo! " + action + " is useful. node liri.js my_tweets, node liri.js spotify_this_song, node liri.js movie_this, OR node liri.js do_what_it_says.");
};
