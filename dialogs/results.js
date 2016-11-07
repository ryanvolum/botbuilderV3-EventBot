module.exports = function () {

    bot.dialog('/ShowResults', [
        function (session, queryData) {
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
            var msgTitle = global.generateMessageTitle(session);
            var results = session.privateConversationData.queryResults;

            switch (session.privateConversationData.searchType) {
                case "person":
                    var buttonActions = [];
                    session.privateConversationData.fullBios = [];
                    results.forEach(function (result, i) {
                        if(result.speakerName.toLowerCase() === "chris nicholson")
                            result.Sessions = "Panel: AI Disruption: Market Opportunities & Threats";
                        //sms has limited experience, so no need for full bio or speaker's event(s) buttons'
                        if (session.message.source !== "sms") {
                            if (result.Sessions && result.Sessions.length > 0 && result.speakerName) {
                                buttonActions.push(builder.CardAction.imBack(session, result.speakerName + "'s Event(s)", "Speaker's Event(s)"));
                            }
                            if (session.message.source.toLowerCase() === "skype" && result.Description.length > 25) {
                                buttonActions.push(builder.CardAction.imBack(session, result.speakerName + "'s " + "Full Bio", "Full Bio"));
                                session.privateConversationData.fullBios.push(result.speakerName + " " + result.Description);
                            }
                        }
                        var img = result.imageURL;
                        msg.addAttachment(
                            new builder.HeroCard(session)
                                .title(result.speakerName)
                                .subtitle(result.Creds + " at " + result.Company)
                                .text(result.Description)
                                .images([builder.CardImage.create(session, img)])
                                .buttons(buttonActions)
                        );
                        buttonActions = [];
                    })
                    var tip = "By the way, you could also find speaker information by just typing in their name in the main menu!";

                    break;
                case "event":
                    sortEvents(session);
                    if (session.message.source.toLowerCase() == "skype") {
                        session.privateConversationData.fullDescription = [];

                        if (results && results.length === 1) {
                            var buttonActions = [];
                            buttonActions.push(builder.CardAction.imBack(session, "Full Description", "Full Description"));
                            session.privateConversationData.fullDescription[0] = results[0].Description;
                        }
                    }

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
                            if (session.message.source.toLowerCase() === "skype" && results.length > 0 && result.Description.length > 25) {
                                var buttonAction = [builder.CardAction.imBack(session, "Full Description " + (i + 1), "Full Description " + (i + 1))];
                                session.privateConversationData.fullDescription[i] = result.Description;
                            }
                            msg.addAttachment(
                                new builder.HeroCard(session)
                                    .title(result.Title)
                                    .subtitle(result.startTime + " to " + result.endTime + " " + result.Speakers + "\n" +
                                    (result.Track.endsWith("Child") ? '' : result.Track + '\n'))
                                    .text(result.Description)
                                    .buttons(buttonAction)
                                //.images([builder.CardImage.create(session, img)])
                            );
                        })
                    }
                    break;
                case "sponsor":
                    var result = results[0];
                    // Use default image if none provided
                    var img = result.imageURL ? result.imageURL : "";

                    //Grabs first image if their are multiple
                    if (img.includes("|")) {
                        img = img.split("|")[0];
                    }
                    //Accounts for skype rendering of (c) and (6) 
                    if (session.message.source.toLowerCase() === "skype" && result && result.Description.length > 25) {
                        var buttonAction = [builder.CardAction.imBack(session, "Full Sponsor Bio", "Full Bio ")];
                        result.Description = result.Description.replace("(c)(6)", "(c6)")
                    }
                    session.privateConversationData.fullSponsorBio = result.Description;
                    msg.addAttachment(
                        new builder.HeroCard(session)
                            .title(result.Title)
                            .text(result.Description)
                            .images([builder.CardImage.create(session, img)])
                            .buttons(buttonAction)
                    );
                    var tip = "By the way, you could have also found this sponsor's information by just typing in \'" + result.Title + "\' in the main menu!";
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