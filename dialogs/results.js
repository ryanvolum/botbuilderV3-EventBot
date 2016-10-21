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
                    //I'm here
                    var buttonActions = [];
                    
                    if(session.privateConversationData.speakersEvents && session.privateConversationData.speakersEvents.length > 0){
                        for(var i = 0; i < session.privateConversationData.speakersEvents.length; i++){
                            var speakerEvent = session.privateConversationData.speakersEvents[i].replace(/(\r\n|\n|\r)/gm,"");
                            buttonActions.push(builder.CardAction.postBack(session, speakerEvent, speakerEvent));
                        }
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
                    var img = result.imageURL ? result.imageURL : ""; 
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
            resetQuery(session);
            session.endDialog(msg);
    }
    ]);


}