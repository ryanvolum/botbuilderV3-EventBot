module.exports = function() {

    bot.dialog('/ShowResults', [
        function (session, queryData) {
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
            var msgTitle = global.generateMessageTitle(session);
            var results = session.privateConversationData.queryResults;

            switch(session.privateConversationData.searchType){
                case "person":
                    var result = results[0];
                    // Use default image if none provided
                    var img = result.imageURL ? result.imageURL : "https://bumberbot.blob.core.windows.net/maps/white.img"; 
                    var eventOne = session.privateConversationData.speakersEvents[0];
                    //I'm here
                    var buttonActions = [];
                    
                    for(var i = 0; i < session.privateConversationData.speakersEvents.length; i++){
                        buttonActions.push(builder.CardAction.postBack(session, session.privateConversationData.speakersEvents[i], session.privateConversationData.speakersEvents[i]));
                    }

                        msg.addAttachment(
                            new builder.HeroCard(session)
                            .title(result.speakerName)
                            .subtitle(result.Creds + " at " + result.Company)
                            .text(result.Description)
                            .images([builder.CardImage.create(session, img)])
                            .buttons(buttonActions)
                        );
                    break;
                case "event":
                    //var img = result.imageURL ? result.imageURL : "https://bumberbot.blob.core.windows.net/maps/white.img"; 
                    results.forEach(function (result, i){
                        msg.addAttachment(
                        new builder.HeroCard(session)
                        .title(result.Title)
                        .subtitle(result.Track + '\n' + result.Day + " " + result.startTime + " to " + result.endTime)
                        .text(result.Description) 
                        //.images([builder.CardImage.create(session, img)])
                        );
                    })

                    break;
                case "sponsor":
                    var result = results[0];
                    // Use default image if none provided
                    var img = result.imageURL ? result.imageURL : "https://bumberbot.blob.core.windows.net/maps/white.img"; 
                    msg.addAttachment(
                        new builder.HeroCard(session)
                        .title(result.Company)
                        .subtitle(result.Website)
                        .text(result.Description)
                        .images([builder.CardImage.create(session, img)])
                    );
                break;
            }
            if(msgTitle){
                session.send(msgTitle);
            }
            session.endDialog(msg);
    }
    ]);


}