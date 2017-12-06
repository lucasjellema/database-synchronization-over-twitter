var express = require('express')
  , http = require('http');

var fs = require('fs');

var Twit = require('twit');
const { twitterconfig } = require('./twitterconfig');
var T = new Twit({
  consumer_key: twitterconfig.consumer_key,
  consumer_secret: twitterconfig.consumer_secret,
  access_token: twitterconfig.access_token_key,
  access_token_secret: twitterconfig.access_token_secret,
  timeout_ms: 60 * 1000,
});

var tracks = { track: ['ukougorderevent'] };
let tweetStream = T.stream('statuses/filter', tracks)
tweetstream(tracks, tweetStream);

function tweetstream(hashtags, tweetStream) {
  console.log("Started tweet stream for hashtag #" + JSON.stringify(hashtags));

  tweetStream.on('connected', function (response) {
    console.log("Stream connected to twitter for #" + JSON.stringify(hashtags));
  })
  tweetStream.on('error', function (error) {
    console.log("Error in Stream for #" + JSON.stringify(hashtags) + " " + error);
  })
  tweetStream.on('tweet', function (tweet) {
    processTweetEvent(tweet);
  });
}


function processTweetEvent(tweet) {
  // find out which of the original hashtags { track: ['oraclecode', 'javaone', 'oow17'] } in the hashtags for this tweet; 
  //that is the one for the tagFilter property
  // select one other hashtag from tweet.entities.hashtags to set in property hashtag
  var tagFilter = "ukougorderevent";

  console.log("tweet text " + tweet.extended_tweet.full_text.substring(16));
  var order = JSON.parse(tweet.extended_tweet.full_text.substring(16));

  console.log("Order from Tweet is " + order);
  console.log("Order from Tweet is " + JSON.stringify(order));
  order.id = order.orderId;
  ordersAPI.insertOrderIntoDatabase(order, null, null, function (request, response, order, rslt) {
    console.log("back from insert with result " + rslt);
  })
}

var bodyParser = require('body-parser') // npm install body-parser
var utils = require("./proxy-utils.js");
var ordersAPI = require("./orders-api.js");

var app = express();
var server = http.createServer(app);

var PORT = process.env.PORT || 3000;
var APP_VERSION = '0.0.5.1';

//CORS middleware - taken from http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-node-js
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', true);
  next();
}

server.listen(PORT, function () {
  console.log('Server running, version ' + APP_VERSION + ', Express is listening... at ' + PORT + " for Orders Data API");
});

app.use(bodyParser.json()); // for parsing application/json
app.use(allowCrossDomain);


app.use(express.static(__dirname + '/public'))
app.get('/about', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write("Version " + APP_VERSION + ". No Data Requested, so none is returned; try /departments or /sessions or something else");
  res.write("Supported URLs:");
  res.write("/order-api/orders , /order-api/orders/id ");
  res.write("incoming headers" + JSON.stringify(req.headers));
  res.end();
});

ordersAPI.registerListeners(app);

