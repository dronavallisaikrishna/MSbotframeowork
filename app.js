var restify = require('restify');
var builder = require('botbuilder');
var request=require('request');

// Get secrets from server environment
var botConnectorOptions = { 
    appId: '64795e1e-49e1-4f79-81a3-a77c9801443f', 
    appPassword:'Dzcj5ZSoFiwXjHhRbzyqOL4'
};

// Create bot
var connector = new builder.ChatConnector(botConnectorOptions);
var bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session) {
    //respond with user's message
    var query = {"properties": {"templateLink": {"uri": "https://irastorageaccount.blob.core.windows.net/templates/template.json","contentVersion": "1.0.0.0"},"mode":"Incremental"}}
          request({
              url: 'https://management.azure.com/subscriptions/b9cec7a1-c948-4cd3-a08e-aac87ab0de4a/resourcegroups/botwordpress/providers/Microsoft.Resources/deployments/wordpress?api-version=2015-01-01',
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlGWERwYmZNRlQyU3ZRdVhoODQ2WVR3RUlCdyIsImtpZCI6IjlGWERwYmZNRlQyU3ZRdVhoODQ2WVR3RUlCdyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzY1MmZlYjkxLTZkOTItNGY2Yy1hZDk4LWQyZGFlYzZiZGFlNy8iLCJpYXQiOjE0OTg2MzAzMzgsIm5iZiI6MTQ5ODYzMDMzOCwiZXhwIjoxNDk4NjM0MjM4LCJhaW8iOiJZMlpnWUhnbGMvdWpVbFpjcDgvbHpjY1NQQVVXQVFBPSIsImFwcGlkIjoiYzk0Y2UxNDUtZDBkZC00OWY3LWJkOTQtYjA0YWYzMGI0MzAzIiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNjUyZmViOTEtNmQ5Mi00ZjZjLWFkOTgtZDJkYWVjNmJkYWU3LyIsIm9pZCI6IjIzY2Q1OWY3LWRkNjktNDQ2Zi1iY2JjLTkzYWFhMGI5MmIyMSIsInN1YiI6IjIzY2Q1OWY3LWRkNjktNDQ2Zi1iY2JjLTkzYWFhMGI5MmIyMSIsInRpZCI6IjY1MmZlYjkxLTZkOTItNGY2Yy1hZDk4LWQyZGFlYzZiZGFlNyIsInZlciI6IjEuMCJ9.cszZq9BIQ_gg7bpryf4P-Vd8UYPtkjyZ9zAT0kG0VeNN336YGOfthZhI9DgHg5gWOfL6BnmV_cP10Ypi5_dhJ2cgV_Fq9Dtkw-f7f_qeBslAel0Xn9u0vBV0GBIskkexRifcs1_9k324-6eZY3qJCTsKmiZ4wMoenNgHsi-iRqdqOkLPyJPp-y7vP1i2ivOE8POBgI1_AP_mkPx-FkM5OkNVMd-56rr8vlp4K2i_sGW9lijutfoP3YS8YFnEfXdmXbp82y0xDl7BymRjuJSllioPmSi9cFBxEGYWWgZpWYPpg2Pm3m18fBPw8LQBOI1vDCYDe16X5BJL4rP8puDgFw',
              },
              //body: '{\"title\": \"' + data + '\"}' //Set the body as a string
              body: JSON.stringify(query) //Set the body as a string

          }, function(error, response, body){
              if(error) {
                  console.log("response is error and is:-"+error);
                  session.send("response is error and is:-"+error);
              }
              else {
                  console.log("response is:-"+body)
                  session.send("response is:-"+body);
              }
          });
});

// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
server.post('/api/messages', connector.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
