var restify = require('restify');
var builder = require('botbuilder');
var bayes = require('bayes')

var classifier = bayes()

// reading the data from csv file.
var csv = require("fast-csv");
csv
 .fromPath("sample.csv")
 .on("data", function(data){
     var result=String(data).split("|")
     classifier.learn(result[1],result[2])
 })
 .on("end", function(){
     console.log("reading data is done");
 });

//adding the train data to a classifier

// Get secrets from server environment
var botConnectorOptions = {
    appId: '9eb35d10-2b54-4e7e-9bda-e666af02c0be',
    appPassword:'6fhg92CJb0QoyFB3djzYRaD'
};

// Create bot
var connector = new builder.ChatConnector(botConnectorOptions);
var bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session) {
    session.send(classifier.categorize(session.message.text));
});

// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
/*here we are giving path as "/api/messages" because during the process of regi9stering bot we have given end point URL as "azure qwebapp url/api/messages" if you want to give some other url give the same url whatever you give in the endpoint excluding azure webapp url */
server.post('/api/messages', connector.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
        'directory': '.',
        'default': 'index.html'
}));

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
