//require('./localKeys.js')();
require('./globals.js')(); // global configurations
require('./capitalize.js')(); // adding capitalize method to the string prototype
require('./config.js')();
require('./connectorSetup.js')();
require('./helpers.js')();
require('./search.js')();
require('./callLUIS.js')();
require('./msgMiddleware.js')(); // message middleware


// Entry point of the bot
bot.dialog('/', [
    function (session) {
        session.privateConversationData.clickingButtons = false;
        if (session.userData.welcome != true)
        {
             session.replaceDialog('/welcome');
        }
        session.replaceDialog('/promptButtons');
    }    
]);

bot.dialog('/welcome', [
    function (session) {
        if (session.userData.welcome != true)
        {
            session.userData.welcome = true;
            session.sendTyping();       
            var msg = "Hi there! I'm a helper bot for the AI World Conference. I was built with a very specific task in mind - to help users access information quickly. I can give you information about the sessions, sponsors and people of this event. I can also answer some general questions!";
            session.send(msg);
        }
    }
]);

bot.dialog('/error', [
    function (session) {
            var msg = "Seems I slipped up - sorry!";
            session.send(msg);
            global.restartDialog(session,'/promptButtons');
        }
]);

bot.dialog('/socialMedia', [
    function (session) {
        var msg = "Tweet about the event @AIWorldExpo!"
        session.send(msg);
        global.restartDialog(session,'/promptButtons');

    }
]);

bot.dialog('/promptButtons', [
    function (session) {
        var choices = [
            "Schedule Explorer",
            "Sponsors/Expos",
            "Speaker Search",
            "Social Media"]
        if(session.message.source === "skype"){
            builder.Prompts.choice(session, "How would you like to explore AI World?", choices, { listStyle: builder.ListStyle.button });
        } else {
             builder.Prompts.choice(session, "How would you like to explore AI World?", choices);
        }
    },
    function (session, results) {
        if (results.response) {
            session.privateConversationData.clickingButtons = true;
            var selection = results.response.entity;
            // route to corresponding dialogs
            switch (selection) {
                case "Schedule Explorer":
                    session.replaceDialog('/sessions');
                    break;
                case "Speaker Search":
                    session.replaceDialog('/people');
                    break;
                case "Sponsors/Expos":
                    session.replaceDialog('/sponsors');
                    break;
                case "Social Media":
                    session.replaceDialog('/socialMedia');
                    break;
                default:
                    restart(session);
                    break;
            }
        }
    }
]);

require('./dialogs/events.js')();
require('./dialogs/people.js')(); 
require('./dialogs/sponsors.js')(); 
require('./dialogs/results.js')();
require('./dialogs/FAQ.js')();

