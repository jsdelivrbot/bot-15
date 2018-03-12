/*
AUTHOR:

@marinamcculloch

FUNCTIONALITY:

Updates the posts and announcement on the induction page

 */

var fb = require("../../../onboardapp/app/fb.js");

var db = fb.db;

var name;
var url;

module.exports = function(controller) {


    /*
 Slack User can ask the bot for help regarding an update
  */

    controller.hears(['update induction help','induction help', 'induction format', 'format induction'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.say('You would like to update one of the induction posts?\n'
                + 'Type update induction page in Slack\n'
                + ' Then enter the content in the Slack and wait for a response \n');
            convo.next();

        });

    });

    controller.hears(['update tip help', 'tip help', 'tip format'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.say('You would like to update the Tip module?\n'
                + 'Type update tip in Slack\n'
                + ' Then enter the tip in Slack \n'
                + '(Keep to a couple of lines)');

            convo.next();
        });

    });


    /*
    Slack User chat with bot
    User says update induction, Slack bot updates firebase
     */
    controller.hears(['update induction page'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('What induction content would you like me to post?', function(response, convo) {

                var responseString = response.text;

                convo.ask('Cool, update with the following changes? Please say yes or no \n ' + responseString, function(response, convo) {

                    var confirmResponse = response.text.valueOf();

                    if (confirmResponse == 'yes') {

                        convo.ask('Which induction module you would like to update? Please say Your Induction, Details or Remember \n ', function(response, convo) {

                            var postResponse = response.text.valueOf();

                            if (postResponse == 'Your Induction') {
                                convo.say("Confirmed! Updating.. ");
                                convo.next();
                                writeInductionData(responseString);
                            } else if (postResponse == 'Details') {
                                convo.say("Confirmed! Updating.. ");
                                convo.next();
                                writeDetailsData(responseString);
                            } else if (postResponse == 'Remember') {
                                convo.say("Confirmed! Updating.. ");
                                convo.next();
                                writeRememberData(responseString);
                            } else {
                                convo.say("Sorry, I didn't get that. Task destroyed.");
                                convo.next();
                            }
                        });

                        convo.next();
                    } else if (confirmResponse == 'no') {
                        console.log('client said no');
                        convo.say("Task destroyed");
                        convo.next();
                    } else {
                        convo.say("Sorry, I didn't get that. Task destroyed.");
                        convo.next();
                    }

                });

                convo.next();
            });

        });

    });


    /*
    Slack User chat with bot
    User says update tip and Slack bot formats the message
     */
    controller.hears(['update tip'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('What would you like me to update the Tip module to?', function(response, convo) {

                var responseString = response.text;

                convo.ask('Cool, update with the following changes? Please say yes or no \n ' + responseString, function(response, convo) {

                    var confirmResponse = response.text.valueOf();
                    console.log('response string ' + responseString);

                    if (confirmResponse == 'yes') {
                        convo.say("Confirmed! Updating.. ");
                        convo.next();
                        writeInductionTip(responseString);
                    } else if (confirmResponse == 'no') {
                        console.log('client said no');
                        convo.say("Task destroyed");
                        convo.next();
                    } else {
                        convo.say("Sorry, I didn't get that. Task destroyed.");
                        convo.next();
                    }
                });
                convo.next();

            });

        });

    });

    /*
    Slack - Ask to add Link
     */

    controller.hears(['add link to induction page'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('Type in name: (Capgemini Website), http url: (http://www.capgemini.com)', function(response, convo) {

                var commaSplitResponse = response.text.split(',');

                formatLinkSlackMessage(commaSplitResponse);

                convo.ask('Cool, update with the following changes? Please say yes or no \n ' + commaSplitResponse, function(response, convo) {

                    var confirmResponse = response.text.valueOf();

                    if (confirmResponse == 'yes') {
                        convo.say("Confirmed! Updating.. ");
                        convo.next();
                        addLinkToInfoPage(name, url);
                    } else if (confirmResponse == 'no') {
                        console.log('client said no');
                        convo.say("Task destroyed");
                        convo.next();
                    } else {
                        convo.say("Sorry, I didn't get that. Task destroyed.");
                        convo.next();
                    }
                });
                convo.next();

            });

        });

    });
};


/** /
 * Format the message
 * @param message
 */
function formatLinkSlackMessage(message) {
    //title
    var linkName = message[0];
    var linkToString = linkName.toString();
    var nameAndValue = linkToString.split(': ');
    name = nameAndValue[1];

    //subtitle
    var linkUrl = message[1];
    var linkUrlToString = linkUrl.toString();
    var urlAndValue = linkUrlToString.split(': ');
    url = urlAndValue[1];
}

/**
 * Write updates from Slack messages to Database
 * */
function writeInductionData(content) {

    var ref = db.ref("induction_page").child('your_induction_section');

    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    ref.update({
        description: content
    });
}

function writeDetailsData(content) {

    var ref = db.ref("induction_page").child('details_section');

    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    ref.update({
        description: content
    });

}

function writeRememberData(content) {

    var ref = db.ref("induction_page").child('remember_section');

    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    ref.update({
        description: content
    });

}


function writeInductionTip(tip) {

    var ref = db.ref("induction_page").child('tip');

    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    ref.update({
        tip_value: tip
    });
}

/**
 * Function to add new link to database
 * */
function addLinkToInfoPage(name, url) {

    var ref = db.ref("induction_links");

    ref.push().set({
        name : name,
        url : url
    });

}