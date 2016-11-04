module.exports = function () {

    // a function to generate messages with button
    // facebook quick reply and standard buttons are supported
    global.generateButtonMessage = function (session, title, buttons) {
        if (useQuickReply) {
            return new builder.Message(session).text(title).sourceEvent(generateSourceEvent(buttons));
        } else {
            return new builder.Message(session).attachments([
                new builder.HeroCard(session).title(title).buttons(buttons)
            ]);
        }
    }

    // generate a quick reply button or a standard button
    global.generateButton = function (session, title, payload) {
        if (useQuickReply) {
            return generateQuickReply(truncate(title).capitalize(), payload);
        } else {
            return builder.CardAction.imBack(session, payload, truncate(title).capitalize());
        }
    }

    global.truncate = function (s) {
        return s.length > 20 ? s.slice(0, 20) : s;
    }

    // generate channel data for facebook
    // especially for generating the quick reply buttons
    global.generateSourceEvent = function (buttonActions) {
        return { facebook: { "quick_replies": buttonActions } };
    }

    // generate a facebook quick reply item
    global.generateQuickReply = function (title, payload) {
        return { "content_type": "text", "title": title, "payload": payload };
    };

    // restart the whole session
    // clean the user data, clean the callstack
    // then route back to the root dialog
    global.restart = function (session) {
        resetQuery(session);
        session.reset('/');
    }

    global.resetQuery = function (session) {
        session.privateConversationData.clickingButtons = false;
        session.privateConversationData.queryResults = null;
        session.privateConversationData.searchType = null;
        session.privateConversationData.tracksWithChildren = null;
    }

    global.restartDialog = function (session, target) {
        if (session.sessionState.callstack.length > 0) {
            session.cancelDialog(0, target);
        } else {
            session.replaceDialog(target);
        }
    }

    global.sortEvents = function (session) {
        if (session.privateConversationData.queryResults && session.privateConversationData.queryResults[0]) {
            session.privateConversationData.queryResults.sort(function (a, b) {
                a.eventID = parseInt(a.eventID);
                b.eventID = parseInt(b.eventID);
                if (a.eventID > b.eventID) {
                    return 1;
                } if (a.eventID < b.eventID) {
                    return -1;
                }
                return 0;
            })
        }
    }

    global.trackHasChildren = function (session, track) {
        if (session.privateConversationData.tracksWithChildren) {
            for (var i = 0; i < session.privateConversationData.tracksWithChildren.length; i++) {
                if (session.privateConversationData.tracksWithChildren[i] === track) {
                    return true;
                }
            }
        }
        return false;
    }

    global.performQuery = function (queryString, callback) {
        var querySpec = {
            query: queryString
        };
        // query documentDB for speaker's events
        client.queryDocuments(collLink, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);
            } else if (results) {
                var s = "";
                callback(null, results);
            } else {
                callback(null, null);
            }
        });
    }


    global.generateMessageTitle = function (session) {
        if (session.privateConversationData.searchType && session.privateConversationData.queryResults) {
            var result = session.privateConversationData.queryResults;
            var msgTitle;
            switch (session.privateConversationData.searchType) {
                case "person":
                    /*
                        if (result.length > 1) {                        
                            msgTitle = "Here are the people that best match your search:";
                        } else {   
                    */
                    if (result.length > 1) {
                        msgTitle = "Here are the people who best matches your search: ";
                    } else {
                        msgTitle = "Here is the person who best matches your search: ";
                    }
                    if (session.message.source == "sms") {
                        msgTitle += "This might take a bit :)";
                    }
                    break;
                case "event":
                    if (session.message.text.toLowerCase().endsWith("event(s)")) {
                        var name = session.message.text.substring(0, session.message.text.length - 11);
                        var results = session.privateConversationData.queryResults;
                        if (results && results.length === 1) {
                            msgTitle = "Here is the event that " + name + " is speaking at";
                        } else if (results && results.length > 1) {
                            msgTitle = "Here are the events that " + name + " is speaking at";
                        }
                    } else if (results && result.length > 1) {
                        msgTitle = "Here are the events that best match your search:";
                    } else {
                        msgTitle = "Here is the event that best matches your search:";
                    }
                    break;
                case "sponsor":
                    if (result.length > 1) {
                        msgTitle = "Here are the sponsors that best match your search:";
                    } else {
                        msgTitle = "Here is the sponsor that best matches your search:";
                    }
                    break;
            }
            return msgTitle;
        }
    }
}