/*
AUTHOR:

@marinamcculloch

FUNCTIONALITY:

Updates the faq page

 */

var fb = require("../../../onboardapp/app/fb.js");

var db = fb.db;

var faqs;

module.exports = function(controller) {

    controller.hears(['^faq','^faqs'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {
            if (!err) {
                convo.say('it did work.');
                convo.activate();
                getFAQ();


            }
        });

    });

};

function getFAQ() {

    var ref = db.ref("faq_page");

    ref.once("value", function(snapshot) {
        console.log(snapshot.val());
    });

    //print to Slack

}