/*
AUTHOR:

@marinamcculloch

FUNCTIONALITY:

Updates the banner on the info page

 */

var fb = require("../../../onboardapp/app/fb.js");

var db = fb.db;

var titleValue;
var textValue;
var linkValue;

module.exports = function(controller) {


    /*
     Slack User can ask the bot for help regarding an update
      */

    controller.hears(['info banner help', 'info update banner', 'info banner format', 'format banner info'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            bot.startConversation(message, function(err, convo) {
                convo.say('You would like to update the info banner on the website?\n'
                    + 'Type update info banner in Slack\n'
                    + ' Then enter a command in the following format: \n'
                    + 'title: <your title>/ text: <your text - keep it brief>/ '
                    + 'link: <your http link>');
                convo.next();
            });
        });

    });

    /*
    Slack User chat with bot
    User says update info banner and Slack bot formats the message
     */
    controller.hears(['update info banner'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('What would you like me to update the banner with?', function(response, convo) {

                var slashSplitResponse = response.text.split('/');

                var formattedString = response.text.split('/').join("\n");

                convo.ask('Cool, update with the following changes? Please say yes or no \n ' + formattedString, function(response, convo) {

                    var confirmResponse = response.text.valueOf();

                    if (confirmResponse == 'yes') {
                        convo.say("Confirmed! Updating.. ");
                        convo.next();
                        formatBannerSlackMessage(slashSplitResponse);
                        writeInfoBannerData(titleValue, textValue, linkValue);
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

/*
This function formats an incoming Slack message by
separating the message into 4 parts "Title, Text, Link"
 */

function formatBannerSlackMessage(message) {
    //title
    var title = message[0];
    var titleToString = title.toString();
    var titleAndValue = titleToString.split(': ');
    titleValue = titleAndValue[1];

    //text
    var text = message[1];
    var textToString = text.toString();
    var textAndValue = textToString.split(': ');
    textValue = textAndValue[1];

    //link
    var link = message[2];
    var linkToString = link.toString();
    var linkAndValue = linkToString.split(': ');
    linkValue = linkAndValue[1];
}

function writeInfoBannerData(title, text, link) {

    var ref = db.ref("info_module");
    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    ref.update({
        info_title: title,
        info_text: text,
        info_link: link
    });
}