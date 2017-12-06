// listen to post requests about new or changed orders - and turn them into a Tweet message
var express = require('express') //npm install express
    , bodyParser = require('body-parser') // npm install body-parser
    , http = require('http')
    ;
var PORT = process.env.PORT || 8123;


const app = express()
    .use(bodyParser.urlencoded({ extended: true }))
    ;

const server = http.createServer(app);



server.listen(PORT, function listening() {
    console.log('Listening on %d', server.address().port);
});

app.get('/about', function (req, res) {
    var msg = req.body;
    console.log(msg)

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("About Tweeting REST API:");
    res.write("incoming headers" + JSON.stringify(req.headers));
    res.end();
});

var publishOrderSynchEventOverKafka = true;

app.get('/order', function (req, res) {
    console.log("handle order event");
    console.log(req.query)
    var customerName = req.query.customerName;
    console.log("Customer " + customerName)
    var result = { "summary": "tremendous success!" }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));

    if (!(publishOrderSynchEventOverKafka)) {
        // now tweet the order event
        var tweetMsg = "#ukougorderevent " + JSON.stringify(req.query);
        console.log("Tweeted: "+tweetMsg)
        tweet.postMessage(tweetMsg);
    } else {
        eventBusPublisher.publishEvent("NewUKOUGOrderEvent", {
            "eventType": "NewUKOUGOrderEvent"
            , "order": req.query
            , "module": "database-synchronizer"
            , "timestamp": Date.now()
        }, topicName);
        console.log("Published Kafka Event of type NewUKOUGOrderEvent to Event Hub ")
    }

});


eventBusPublisher = require("./EventPublisher.js");
// from the Oracle Event Hub - Platform Cluster Connect Descriptor
var topicName = "a516817-devoxx-topic";




var tweet = require("./tweet");
