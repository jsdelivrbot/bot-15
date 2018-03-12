/*
AUTHOR:

@marinamcculloch

FUNCTIONALITY:

Updates three modules (banners) on the front page

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
  controller.hears(['banner update help', 'banner update', 'update banner', 'banner help', 'banner format', 'format banner'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {
            convo.say('You would like to update one of the banners on the website?\n'
                      + 'Type update then either <first banner> or <second banner> in Slack\n'
                      + ' Then enter a command in the following format: \n'
                      + 'title: <your title>/ text: <your text - keep it brief>/ '
                      + 'link: <your http link>');
            convo.next();
        });

    });

        /*
        Slack User chat with bot
        User says update second banner and Slack bot formats the message
         */

    controller.hears(['update first banner'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('What would you like me to update the first banner with?', function(response, convo) {

                var commaSplitResponse = response.text.split('/');

                var formattedString = response.text.split('/').join("\n");

                convo.ask('Cool, update with the following changes? \n ' + formattedString, function(response, convo) {

                    var confirmResponse = response.text.valueOf();

                    if (confirmResponse == 'yes') {
                        // console.log('client said yes');
                        convo.say("Confirmed! Updating.. ");
                        convo.next();
                        formatBannerSlackMessage(commaSplitResponse);
                        writeSecondPageData(titleValue, textValue, linkValue);
                    } else if (confirmResponse == 'no') {
                        console.log('client said no');
                        convo.say("Task destroyed");
                        convo.next();
                    } else {
                        convo.say("Sorry, I didn't get that. Task destroyed.");
                    }

                });
                convo.next();

            });

        });

    });

    controller.hears(['update second banner'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('What would you like me to update the second banner with?', function(response, convo) {

                var slashSplitResponse = response.text.split('/');

                var formattedString = response.text.split('/').join("\n");

                convo.ask('Cool, update with the following changes? \n ' + formattedString, function(response, convo) {

                    var confirmResponse = response.text.valueOf();

                    if (confirmResponse == 'yes') {
                        // console.log('client said yes');
                        convo.say("Confirmed! Updating.. ");
                        convo.next();
                        formatBannerSlackMessage(slashSplitResponse);
                        writeThirdPageData(titleValue, textValue, linkValue);
                    } else if (confirmResponse == 'no') {
                        console.log('client said no');
                        convo.say("Task destroyed");
                        convo.next();
                    } else {
                        convo.say("Sorry, I didn't get that. Task destroyed.");
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

//write to firebase db
function writeSecondPageData(title, text, link) {

    var ref = db.ref("second_featured_module");
    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    ref.update({
        second_title: title,
        second_text: text,
        second_link: link
    });
}

function writeThirdPageData(title, text, link) {

    var ref = db.ref("third_featured_module");
    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    ref.update({
        third_title: title,
        third_text: text,
        third_link: link
    });
}

