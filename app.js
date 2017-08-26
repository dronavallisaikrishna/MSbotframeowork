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
var mobiles=['12345678','23456789','34567890','45678901','56789012']
var usernames=['mira','anis','farah','michelle','hani']
var useremails=['mira@gmail.com','anis@gmail.com','farah@gmail.com','michelle@gmail.com','hani@gmail.com']
var cities=["johor",'kedah','melaka','perak','sabah']
var billingAddress=["Ahmad Bin Gh azali, johor, Malaysia,80000","Sg Ramal Luar, kedah, Malaysia,06100","Naugaon, Melaka, Malaysia,75000","Gh azali Ahmad Bin, perak, Malaysia,32800","Sg Ramal Luar, sabah, Malaysia,89300"]
var pincodes=["80000","06100","75000","32800","89300","89260","89260","09600","09200","16020"]

// Create bot
var connector = new builder.ChatConnector(botConnectorOptions);
// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
// This is a dinner reservation bot that uses multiple dialogs to prompt users for input.
var bot = new builder.UniversalBot(connector);



bot.dialog('/',function (session,results,next) {
    console.log(session.message.text)
    if(session.message.text==="I want to know about the MaxisONE Home 30 Mbps offer"){
        session.beginDialog("30 Mbps offer");
    }
    else if(session.message.text==="I want to know about the MaxisONE Home 100 Mbps offer"){
        session.beginDialog("100 Mbps offer");
    }
    else if(session.message.text==="I want to know about the MaxisONE Home 50 Mbps offer"){
        session.beginDialog("50 Mbps offer");
    }
    else if(session.message.text==="I want to know about the MaxisONE Home 10 Mbps offer"){
        session.beginDialog("10 Mbps offer");
    }
    else if(session.message.text==="Do you have fibre coverage at my location?"){
        session.beginDialog("fiber coverage");
    }
    else{
        session.send(classifier.categorize(session.message.text))
    }
});


//100 mbps offer
bot.dialog('fiber coverage', [
    function (session,results,next) {
        builder.Prompts.text(session,"Are you an existing customer?")
    },
    function (session,results,next) {
        if(results.response.toLowerCase()==="yes"){
            session.dialogData.existancy="yes"
            // builder.Prompts.text(session,"Are you an existing customer?")
            session.beginDialog("get phone number")
        }
        else if(results.response.toLowerCase()==="no"){
            session.dialogData.existancy="no"
            // builder.Prompts.text(session,"Are you an existing customer?")
            session.beginDialog("get pincode")
        }
    },


    // function (session,results,next) {
    //     session.send("Thanks for chosing us from 30 mbps offer dialog")
    //     // session.beginDialog("activate plan")
    // }
]);

//get pincode for communication
bot.dialog("get pincode",[
   function (session,results,next) {
       builder.Prompts.text(session,"Please enter the pincode")
   },
   function (session,results,next) {
       if(pincodes.indexOf(results.response)>-1){
            session.send("We have noted your request. Our agent will contact you soon.")
           session.endDialog()
       }
       else{
           session.send("We are sorry. We don't provide service in your area.\n\nWe provide fibre services in \n\njohor \n\nkedah \n\nmelaka\n\nperak\n\nsabah")
           session.endDialog()
       }
   }
]);

//mobile number for subscription
bot.dialog("get phone number",[
   function (session,results,next) {
       builder.Prompts.text(session,"Please enter your Maxis phone no")
   },
   function (session,results,next) {
       if(mobiles.indexOf(results.response)>-1){
            session.beginDialog("submit request fibre installation")
       }
       else{
           session.send("Sorry, we do not provide coverage at your location. We provide coverage in the following cities.\n\n" +
               "We provide fibre services in \n\njohor \n\nkedah \n\nmelaka\n\nperak\n\nsabah")
           session.endDialog();
       }
   }

]);

//submit request for fibre installation
bot.dialog("submit request fibre installation",[
   function (session,results,next) {
       builder.Prompts.text(session,"Shall I submit the request for fibre installation for your registered address?")
   },
   function (session,results,next) {
       if(results.response.toLowerCase()==="no, i want the installation at a different address" || results.response.toLowerCase()==="no" || results.response.toLowerCase()==="i want the installation at a different address"){
           session.beginDialog("take new address")
       }
       else if(results.response.toLowerCase()==="yes"){
           session.beginDialog("confirm installation")
       }
   }
]);

//submit request for fibre installation
bot.dialog("confirm installation",[
   function (session,results,next) {
       builder.Prompts.text(session,"Shall I confirm the installation?")
   },
   function (session,results,next) {
       if(results.response.toLowerCase()==="yes" || results.response.toLowerCase()==="yeah" || results.response.toLowerCase()==="ok" || results.response.toLowerCase()==="yeah"){
            session.send("We have noted your request. Our agent will contact you soon for fibre installation.")
           session.endDialog();
       }
       else if(results.response.toLowerCase()==="no"){
            session.send("Hope I was helpful in solving your query. Can I help you with something else?")
           session.endDialog();
       }
   }
]);

//submit request for fibre installation
bot.dialog("take new address",[
   function (session,results,next) {
       builder.Prompts.text(session,"Please enter the address.")
   },
   function (session,results,next) {
        session.beginDialog("confirm installation")
   }
]);

//100 mbps offer
bot.dialog('100 Mbps offer', [
    function (session,results,next) {
        session.send("100 Mbps plan details are as follows.\n\n1.Complimentary unlimited iflix access.\n\n2.FREE Maxperts consultation with end-to-end-setup.\n\n" +
            "3.Unlimited voice calls to all mobile and landlines.\n\n4.FREE DECT phone.\n\n")
        session.beginDialog("activate plan")
    },
    // function (session,results,next) {
    //     session.send("Thanks for chosing us from 30 mbps offer dialog")
    //     // session.beginDialog("activate plan")
    // }
]);


//50 mbps offer
bot.dialog('50 Mbps offer', [
    function (session,results,next) {
        session.send("50 Mbps plan details are as follows.\n\n1.Complimentary unlimited iflix access.\n\n2.FREE Maxperts consultation with end-to-end-setup.\n\n" +
            "3.Unlimited voice calls to all mobile and landlines.\n\n4.FREE DECT phone.\n\n")
        session.beginDialog("activate plan")
    },
    // function (session,results,next) {
    //     session.send("Thanks for chosing us from 30 mbps offer dialog")
    //     // session.beginDialog("activate plan")
    // }
]);


//30 mbps offer
bot.dialog('30 Mbps offer', [
    function (session,results,next) {
        session.send("30 Mbps plan details are as follows.\n\n1.Complimentary unlimited iflix access.\n\n2.FREE Maxperts consultation with end-to-end-setup.\n\n" +
            "3.Unlimited voice calls to all mobile and landlines.\n\n4.FREE DECT phone.\n\n")
        session.beginDialog("activate plan")
    },
    // function (session,results,next) {
    //     session.send("Thanks for chosing us from 30 mbps offer dialog")
    //     // session.beginDialog("activate plan")
    // }
]);


//10 mbps offer
bot.dialog('10 Mbps offer', [
    function (session,results,next) {
        session.send("10 Mbps plan details are as follows.\n\n1.Unlimited voice calls to all mobile and landlines.\n\n2.FREE DECT phone.\n\n")
        session.beginDialog("activate plan")
    },
    // function (session,results,next) {
    //     session.send("Thanks for chosing us from 30 mbps offer dialog")
    //     // session.beginDialog("activate plan")
    // }
]);



bot.dialog("activate plan",[
    function (session,results,next) {
        builder.Prompts.text(session,"Do you want to activate the plan.?")
        // session.beginDialog("activate plan")
    },
    function (session, results,next) {
        if(results.response.toLowerCase()==="yes"){
            session.beginDialog("choose plan")
            // session.send("I have logged your request for 30Mbps activation. Our agent will get back to you within 72 hours with activation confirmation. Thank you!!")
            // session.endDialog()
        }
        else if(results.response.toLowerCase()==="no"){
            session.send("Hope I was helpful in solving your query. Can I help you with something else?")
            session.endDialog()
        }
        else if(results.response.toLowerCase()==="my consumption is more than 100 mbps, what do i do?"){
            response="a. 100 Mbps plan details are as follows.\n\n1.Complimentary unlimited iflix access.\n\n2.FREE Maxperts consultation with end-to-end-setup.\n\n" +
            "3.Unlimited voice calls to all mobile and landlines.\n\n4.FREE DECT phone.\n\n"+
            "b. 50 Mbps plan details are as follows.\n\n1.Complimentary unlimited iflix access.\n\n2.FREE Maxperts consultation with end-to-end-setup.\n\n" +
            "3.Unlimited voice calls to all mobile and landlines.\n\n4.FREE DECT phone.\n\n"+
            "c. 30 Mbps plan details are as follows.\n\n1.Complimentary unlimited iflix access.\n\n2.FREE Maxperts consultation with end-to-end-setup.\n\n" +
            "3.Unlimited voice calls to all mobile and landlines.\n\n4.FREE DECT phone.\n\n"+
            "d. 10 Mbps plan details are as follows.\n\n1.Unlimited voice calls to all mobile and landlines.\n\n2.FREE DECT phone.\n\n"
            session.send(response)
            session.endDialog()
            session.beginDialog("activate plan")
        }
        else{
            session.send("Please say 'yes' or 'no'")
            session.beginDialog("activate plan")
        }
        // console.log(session)
        // // console.log(session.dialogData)
        // session.dialogData.username=results.response;
        // builder.Prompts.text(session,"Hello "+results.response+". Welcome to Maxis! How may I help you today?. i can help you with 'plan/offer' details and 'simple queries'");
    }
]);

bot.dialog("choose plan",[
    function (session,results,next) {
        // session.send("")
        builder.Prompts.text(session,"You can activate one of the following plans.\n\n 1.100 Mbps plan.\n\n2.50 Mbps plan.\n\n3.30 Mbps plan.\n\n4.10 Mbps plan.\n\nPlease tell the plan name (Ex:-100 Mbps plan)")
        // session.beginDialog("activate plan")
    },
    function (session, results,next) {
        console.log("lower case string is "+results.response)
        if(results.response.toLowerCase()==="100 mbps plan" || results.response.toLowerCase()==="1" || results.response.toLowerCase()==="100 mbps plan." || results.response.toLowerCase()==="1.100 mbps plan." || results.response.toLowerCase()==="1.100 mbps plan"){
            session.dialogData.plan="100 mbps plan"
            session.send("I have logged your request for 100 mbps activation. Our agent will get back to you within 72 hours with activation confirmation. Thank you!!")
            session.endDialog()
        }
        else if(results.response.toLowerCase()==="50 mbps plan" || results.response.toLowerCase()==="2" || results.response.toLowerCase()==="50 mbps plan." || results.response.toLowerCase()==="2.50 mbps plan." || results.response.toLowerCase()==="2.50 mbps plan"){
            session.dialogData.plan="50 mbps plan"
            session.send("I have logged your request for 50 mbps activation. Our agent will get back to you within 72 hours with activation confirmation. Thank you!!")
            session.endDialog()
        }
        else if(results.response.toLowerCase()==="30 mbps plan" || results.response.toLowerCase()==="3" || results.response.toLowerCase()==="30 mbps plan." || results.response.toLowerCase()==="3.30 mbps plan." || results.response.toLowerCase()==="3.30 mbps plan"){
            session.dialogData.plan="30 mbps plan"
            session.send("I have logged your request for 30 mbps activation. Our agent will get back to you within 72 hours with activation confirmation. Thank you!!")
            session.endDialog()
        }
        else if(results.response.toLowerCase()==="10 mbps plan" || results.response.toLowerCase()==="4" || results.response.toLowerCase()==="10 mbps plan." || results.response.toLowerCase()==="4.10 mbps plan." || results.response.toLowerCase()==="4.10 mbps plan"){
            session.dialogData.plan="10 mbps plan"
            session.send("I have logged your request for 10 mbps activation. Our agent will get back to you within 72 hours with activation confirmation. Thank you!!")
            session.endDialog()
        }
        else{
            session.send("Please enter a valid plan.")
            session.beginDialog("choose plan")
        }

    }
]);

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
