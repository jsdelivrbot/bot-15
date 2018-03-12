/*
AUTHOR:

@marinamcculloch

FUNCTIONALITY:

Updates the news posts and announcement on the front page

 */

var fb = require("../../../onboardapp/app/fb.js");

var db = fb.db;

var postTitle;
var postSubTitle;
var postParagraph1;
var postParagraph2;
var postParagraph3;
var postParagraph4;

var name;
var url;

module.exports = function(controller) {

    /*
  Slack User can ask the bot for help regarding an update
   */

    controller.hears(['update post help','post help', 'post update', 'post format', 'format post'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.say('You would like to update the news posts?\n'
                + 'Type update post in Slack\n'
                + ' Then enter a command in the following format: \n'
                + 'title: <your title>/ subtitle: <your sub title>/ paragraph1: <your text>/ '
                + 'paragraph2: <your text>/ paragraph3: <your text>/ paragraph4: <your text>');

            convo.next();
        });

    });

    controller.hears(['update announcement help', 'announcement help', 'announcement format'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.say('You would like to update the announcement?\n'
                + 'Type update announcement in Slack\n'
                + ' Then enter the announcement in Slack \n'
                + ' (Keep to a few lines)');

            convo.next();
        });

    });


    /*
    Slack User chat with bot
    User says update post and Slack bot formats the message, asks which post to update and updates firebase
     */
    controller.hears(['update post'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('Please type out the post update in the correct format', function(response, convo) {

                var slashSplitResponse = response.text.split('/');

                var formattedString = response.text.split('/').join("\n");

                formatPostSlackMessage(slashSplitResponse);

                convo.ask('Cool, update with the following changes? Please say yes or no \n ' + formattedString, function(response, convo) {

                    var confirmResponse = response.text.valueOf();

                    if (confirmResponse == 'yes') {

                        convo.ask('Which post you would like to update? Please say top or middle or bottom \n ', function(response, convo) {

                            var postResponse = response.text.valueOf();

                            if (postResponse == 'top') {
                                convo.say("Confirmed! Updating.. ");
                                convo.next();
                                writeTopPostData(postTitle, postSubTitle, postParagraph1, postParagraph2, postParagraph3, postParagraph4);
                            } else if (postResponse == 'middle') {
                                convo.say("Confirmed! Updating.. ");
                                convo.next();
                                writeSecondPostData(postTitle, postSubTitle, postParagraph1, postParagraph2, postParagraph3, postParagraph4);
                            } else if (postResponse == 'bottom') {
                                convo.say("Confirmed! Updating.. ");
                                convo.next();
                                writeThirdPostData(postTitle, postSubTitle, postParagraph1, postParagraph2, postParagraph3, postParagraph4);
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
    User says update front main and Slack bot formats the message
     */
    controller.hears(['update announcement'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('What would you like me to update the announcement to?', function(response, convo) {

                var responseString = response.text;

                convo.ask('Cool, update with the following changes? Please say yes or no \n ' + responseString, function(response, convo) {

                    var confirmResponse = response.text.valueOf();
                    console.log('response string ' + responseString);

                    if (confirmResponse == 'yes') {
                        convo.say("Confirmed! Updating.. ");
                        convo.next();
                        writeFrontPageAnnouncement(responseString);
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

    controller.hears(['add link to front page'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('Type in name: (Capgemini Website), http url: (http://www.capgemini.com)', function(response, convo) {

                var commaSplitResponse = response.text.split(',');

                formatLinkSlackMessage(commaSplitResponse);

                convo.ask('Cool, update with the following changes? Please say yes or no \n ' + commaSplitResponse, function(response, convo) {

                    var confirmResponse = response.text.valueOf();

                    if (confirmResponse == 'yes') {
                        convo.say("Confirmed! Updating.. ");
                        convo.next();
                        addLinkToFrontPage(name, url);
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


/*
This function formats an incoming Slack message by
separating the message into 4 parts "Title, SubTitle, Paragraph 1 - 4"
 */
function formatPostSlackMessage(message) {
    //title
    var title = message[0];
    var titleToString = title.toString();
    var titleAndValue = titleToString.split(': ');
    postTitle = titleAndValue[1];

    //subtitle
    var subtitle = message[1];
    var subtitleToString = subtitle.toString();
    var subtitleAndValue = subtitleToString.split(': ');
    postSubTitle = subtitleAndValue[1];

    //paragraph 1
    var para = message[2];
    var paraToString = para.toString();
    var paraValue = paraToString.split(': ');
    postParagraph1 = paraValue[1];

    //paragraph 2
    var para2 = message[2];
    var para2ToString = para2.toString();
    var paraValue2 = para2ToString.split(': ');
    postParagraph2 = paraValue2[1];

    //paragraph 3
    var para3 = message[2];
    var para3ToString = para3.toString();
    var paraValue3 = para3ToString.split(': ');
    postParagraph3 = paraValue3[1];

    //paragraph 4
    var para4 = message[2];
    var para4ToString = para4.toString();
    var paraValue4 = para4ToString.split(': ');
    postParagraph4 = paraValue4[1];
}

function writeTopPostData(postTitle, subtitle, para1, para2, para3, para4) {

    var ref = db.ref("front_page").child('first_post');

    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    ref.update({
        title: postTitle,
        description: subtitle,
        paragraph_1: para1,
        paragraph_2: para2,
        paragraph_3: para3,
        paragraph_4: para4
    });
}

function writeSecondPostData(postTitle, subtitle, para1, para2, para3, para4) {

    var ref = db.ref("front_page").child('second_post');

    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    ref.update({
        title: postTitle,
        description: subtitle,
        paragraph_1: para1,
        paragraph_2: para2,
        paragraph_3: para3,
        paragraph_4: para4
    });
}

function writeThirdPostData(postTitle, subtitle, para1, para2, para3, para4) {

    var ref = db.ref("front_page").child('third_post');

    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    ref.update({
        title: postTitle,
        description: subtitle,
        paragraph_1: para1,
        paragraph_2: para2,
        paragraph_3: para3,
        paragraph_4: para4
    });
}

function writeFrontPageAnnouncement(a) {

    var ref = db.ref("front_page").child('announcement');

    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    ref.update({
        announcement_value: a
    });
}

/**
 * Function to add new link to database
 * */
function addLinkToFrontPage(name, url) {

    var ref = db.ref("front_links");

    ref.push().set({
        name : name,
        url : url
    });

}
