module.exports = function () {

    bot.dialog('/ShowResults', [
        function (session, queryData) {
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
            var msgTitle = global.generateMessageTitle(session);
            var results = session.privateConversationData.queryResults;

            switch (session.privateConversationData.searchType) {
                case "person":
                    var result = results[0];
                    // Use default image if none provided
                    var img = result.imageURL ? result.imageURL : "https://bumberbot.blob.core.windows.net/maps/white.img";

                    var buttonActions = [];

                    //if (session.message.source !== "sms") {
                        if (session.privateConversationData.speakersEvents && session.privateConversationData.speakersEvents.length > 0 && result.speakerName) {
                                var firstName = result.speakerName.split(" ")[0];
                                buttonActions.push(builder.CardAction.imBack(session, firstName + "'s Event(s)", firstName + "'s Event(s)"));
                                if( session.message.source.toLowerCase() == "skype"){
                                    buttonActions.push(builder.CardAction.imBack(session, "Full Bio", "Full Bio"));
                                }
                        }
                    //}

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
                    sortEvents(session);
                    if (session.message.source === "sms") {
                        //msgArray is an array of messages of three entries or the greatest number under 160 chars
                        var msgArray = [];
                        var msg = "";
                        results.forEach(function (result, i) {
                            if ((i + 1) % 3 === 0 || ((msg.length + result.startTime.length + result.endTime.length + result.Title.length + 10) > 160)) {
                                msgArray.push(msg);
                                msg = "";
                            }
                            msg += result.startTime + " - " + result.endTime + ": " + result.Title + "\n\n";

                        })
                        if (msg.length > 0) {
                            msgArray.push(msg);
                        }
                    } else {
                        results.forEach(function (result, i) {
                            msg.addAttachment(
                                new builder.HeroCard(session)
                                    .title(result.Title)
                                    .subtitle((result.Track.endsWith("Child") ? '' : result.Track + '\n') + result.Day + " " + result.startTime + " to " + result.endTime + "\n" +
                                    result.Speakers)
                                    .text(result.Description)
                                //.images([builder.CardImage.create(session, img)])
                            );
                        })
                    }
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
            if (msgTitle) {
                session.send(msgTitle);
            }
            resetQuery(session);
            if (session.message.source === "sms" && msgArray) {
                msgArray.forEach(function (msg) {
                    session.send(msg);
                })
            } else {
                session.endDialog(msg);
            }
        }
    ]);


}