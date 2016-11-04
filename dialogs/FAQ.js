module.exports = function () {
    bot.dialog('/PressRoom', [
        function (session) {
            session.endDialog("Please go to the Stockton room");
        }
    ]);

    bot.dialog('/Bio', [
        function (session) {
            session.endDialog("I'm a demonstration of how bots can change the way we access information. Right now I'm talking to you on " + session.message.source + ", but I interact through Skype and Slack, presenting users with a guided conversation to access details about sessions, speakers and sponsors, along with general event info. I use some NLP to answer basic questions, but more than anything I intend to demonstrate the value in using rich controls like buttons, images and carousels along with cloud services like search to filter through an underlying dataset. ");
        }
    ]);

    bot.dialog('/AIWorldInfo', [
        function (session) {
            session.endDialog("AI World is the nation's largest AI business conference. Our mission is simple: learn how to successfully harness intelligent technologies to build competitive advantage, drive new business opportunities and accelerate innovation efforts.");
        }
    ]);

    bot.dialog('/ExpoPass', [
        function (session) {
            session.endDialog("All the expo pass benefits are listed on: http://aiworldexpo.com/expo-pass/");
        }
    ]);

    //TODO: Breakfast or lunch?
    bot.dialog('/Food', [
        function (session, entities, next) {
            if (entities && entities.entities[0] && entities.entities[0].entity) {
                if (entities.entities[0].entity === "breakfast"){
                    session.endDialog("There will be continental breakfast available starting at 8am on Tuesday, Nov 8 which is sponsored by WorkFusion in the Cyril Magnin ballroom. There will be continental breakfast available starting at 8am on Wednesday, Nov 9 available in the 4th floor lobby and outside of the Cyril Magnin ballroom");
                } else if (entities.entities[0].entity === "lunch"){
                    session.endDialog("Lunches are available on Tuesday, Nov 8 at 12:15pm and Wednesday, Nov 9 at 12:20pm. Lunches will be available outside of the Cyril Magnin ballroom");
                }
            } else {
                if(session.message.source === "skype"){
                    builder.Prompts.choice(session, "Are you interested in breakfast or lunch?", "Breakfast|Lunch", { listStyle: builder.ListStyle.button });
                } else {
                    builder.Prompts.choice(session, "Are you interested in breakfast or lunch?", "Breakfast|Lunch");
                }
            }
        },
        function (session, results) {
            if (results.response) {
                if (results.response.entity.toLowerCase() === "breakfast") {
                    session.endDialog("There will be continental breakfast available starting at 8am on Tuesday, Nov 8 which is sponsored by WorkFusion in the Cyril Magnin ballroom. There will be continental breakfast available starting at 8am on Wednesday, Nov 9 available in the 4th floor lobby and outside of the Cyril Magnin ballroom");
                } else if (results.response.entity.toLowerCase() === "lunch") {
                    session.endDialog("Lunches are available on Tuesday, Nov 8 at 12:15pm and Wednesday, Nov 9 at 12:20pm. Lunches will be available outside of the Cyril Magnin ballroom");
                }
            }
        }
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