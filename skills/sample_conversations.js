/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's conversation system.

In this example, Botkit hears a keyword, then asks a question. Different paths
through the conversation are chosen based on the user's response.

*/

module.exports = function(controller) {

    controller.hears(['color'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {
            convo.say('This is an example of using convo.ask with a single callback.');

            convo.ask('What is your favorite color?', function(response, convo) {

                convo.say('Cool, I like ' + response.text + ' too!');
                convo.next();

            });
        });

    });
  

  
  


    controller.hears(['question'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            // create a path for when a user says YES
            convo.addMessage({
                    text: 'How wonderful.',
            },'yes_thread');

            // create a path for when a user says NO
            // mark the conversation as unsuccessful at the end
            convo.addMessage({
                text: 'Cheese! It is not for everyone.',
                action: 'stop', // this marks the converation as unsuccessful
            },'no_thread');

            // create a path where neither option was matched
            // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
            convo.addMessage({
                text: 'Sorry I did not understand. Say `yes` or `no`',
                action: 'default',
            },'bad_response');

            // Create a yes/no question in the default thread...
            convo.ask('Do you like cheese?', [
                {
                    pattern:  bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.gotoThread('yes_thread');
                    },
                },
                {
                    pattern:  bot.utterances.no,
                    callback: function(response, convo) {
                        convo.gotoThread('no_thread');
                    },
                },
                {
                    default: true,
                    callback: function(response, convo) {
                        convo.gotoThread('bad_response');
                    },
                }
            ]);

            convo.activate();

            // capture the results of the conversation and see what happened...
            convo.on('end', function(convo) {

                if (convo.successful()) {
                    // this still works to send individual replies...
                    bot.reply(message, 'Let us eat some!');

                    // and now deliver cheese via tcp/ip...
                }

            });
        });

    });

  
  
    /* 
  Marina 
  */
  
  controller.hears(['update help', 'website help', 'website update help', 'update website help'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {
            
            convo.say('You would like to update the website?\n' 
                      + 'Type update in Slack\n'
                      + ' Then enter a command in the following format: \n'
                      + 'update module: <your module>, title: <your title>, text: <your text - keep it brief>, '     
                      + 'link: <your http link>');
          
          
            convo.next();
            
        

        });

    });
  
  controller.hears(['update'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {
            
            //convo.say('Tell me what you would like me to update');
          
            convo.ask('What would you like me to update?', function(response, convo) {

                convo.say('Cool, I will update ' + response.text + '!');
                convo.next();

            });
          
            //convo.next();
          
          // wait for response
          
          // return website updated message, success
          
          // send update to NJ channel (or send this update from website itself? - probs)

        });

    });
  
  
};
