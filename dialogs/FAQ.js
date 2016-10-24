module.exports = function(){
    bot.dialog('/PressRoom', [
        function (session) {
            session.endDialog("Please go to the Stockton room");
        }
    ]);

    bot.dialog('/Bio', [
        function (session) {
            session.endDialog("I'm a bot, which really means I'm just an app with a new interface (well, lots of them). Right now I'm talking to you on " + session.message.source + ", but you can talk to me via sms, Skype, or Slack! I'm built on the Microsoft Bot Framework and use natural language processing, Azure Search and Node.js to process human language :)");
        }
    ]);

    bot.dialog('/ExpoPass', [
        function (session) {
            session.endDialog("All the expo pass benefits are listed on: http://aiworldexpo.com/expo-pass/");
        }
    ]);

    //TODO: Breakfast or lunch?
    bot.dialog('/Food', [
        function (session, entities) {
            if(entities.entities[0].entity === "breakfast"){
                session.endDialog("There will be continental breakfast available starting at 8am on Tuesday, Nov 8 which is sponsored by WorkFusion in the Cyril Magnin ballroom. There will be continental breakfast available starting at 8am on Wednesday, Nov 9 available in the 4th floor lobby and outside of the Cyril Magnin ballroom");
            } else if (entities.entities[0].entity === "lunch"){
                session.endDialog("Lunches are available on Tuesday, Nov 8 at 12:15pm and Wednesday, Nov 9 at 12:20pm. Lunches will be available outside of the Cyril Magnin ballroom");
            }
        }

            /*
            if(!entities){
                builder.Prompts.choice(session, "Are you interested in breakfast or lunch?", "Breakfast|Lunch")
            } else {
                
            }

        },
        function (session, entities, results){
            if(entities[0].entity === "Breakfast"){
                session.endDialog("breakfastmessage");
            } else if (entities[0].entity === "Lunch"){
                session.endDialog("LunchMEssage");
            }
        }
        */
    ]);

    bot.dialog('/TechSolutionsTheater', [
        function (session) {
            session.endDialog("The AI Technology Solutions Theater is being held in Tuesday from 1:30 to 6:00pm in the Fillmore room.");
        }
    ]);

    bot.dialog('/Address', [
        function (session) {
            session.endDialog("AI World is being held at the Parc 55 Hilton on the 4th floor");
        }
    ]);

    bot.dialog('/Management', [
        function (session) {
            session.endDialog("Please go to the registration desk and they will help you.");
        }
    ]);

    bot.dialog('/Recording', [
        function (session) {
            session.endDialog("The conference is not being taped via audio or video.");
        }
    ]);

    bot.dialog('/Presentations', [
        function (session) {
            session.endDialog("The presentations will be made available about one week after the conference to AI World conference attendees");
        }
    ]);

    bot.dialog('/SpeakerBadge', [
        function (session) {
            session.endDialog("Please go to the Stockton room");
        }
    ]);

}