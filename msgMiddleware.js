module.exports = function () {
    bot.use({
        botbuilder: function (session, next) {
            var modelUrl = 'https://api.projectoxford.ai/luis/v1/application?id=637e6cc7-7f9d-436e-84c8-31c91f4330bc&subscription-key=d20c9600f0894e28926d471cb716e6ac';
            var msg = session.message.text;

            //User clicked person's events button
            if(msg.toLowerCase().endsWith("event(s)")){
                session.privateConversationData.queryResults = session.privateConversationData.speakersEvents;
                session.privateConversationData.searchType = "event";
                session.replaceDialog('/ShowResults');

            } else if (msg.toLowerCase() === "full bio"){
                session.send(session.privateConversationData.fullBio);
            } else if (msg.toLowerCase().startsWith("full description")){
                session.send(session.privateConversationData.fullDescription[msg.substring(msg.length - 1, msg.length) - 1]);
            } else if (msg.toLowerCase() === "hi") {
                restart(session);
                
            } else if (!session.privateConversationData.clickingButtons && msg != "Schedule Explorer" && msg != "Sessions/Expos" && msg != "People Search" && msg != "Social Media" && msg != "Breakfast" && msg != "Lunch") {
                recognizeThis(msg, modelUrl, function (err, results, entities) {
                    var s = "";
                    if (results && results[0] && results[0].intent && results[0].score > .5 && results[0].intent != "None") {
                        session.replaceDialog("/" + results[0].intent, { entities });
                    } else {
                        performSearch(msg, 'Speakers', function (err, results) {
                            if (err) {
                            }
                            if (results && (results[0]['@search.score'] > .05)) {
                                //Checking relevance. >2 generally requires an exact event title match. Checking some buttons right now for some reason
                                session.privateConversationData.queryResults = results;
                                session.privateConversationData.searchType = "person";
                                session.replaceDialog('/ShowResults', { entities });
                            } else {
                                //Search sponsor collection
                                performSearch(msg, 'sponsorsindex', function (err, results) {
                                    if (err) {
                                    }
                                    if (results && (results[0]['@search.score'] > .05)) {
                                        session.privateConversationData.queryResults = results;
                                        session.privateConversationData.searchType = "sponsor";
                                        session.replaceDialog('/ShowResults');
                                    }
                                    else {
                                        next();
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                next();
            }
        }
    });
}