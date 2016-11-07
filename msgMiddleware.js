module.exports = function () {
    bot.use({
        botbuilder: function (session, next) {
            var modelUrl = 'https://api.projectoxford.ai/luis/v1/application?id=637e6cc7-7f9d-436e-84c8-31c91f4330bc&subscription-key=d20c9600f0894e28926d471cb716e6ac';
            var msg = session.message.text;

            //User clicked person's events button
            if (msg.toLowerCase().endsWith("event(s)")) {
                var person = msg.substring(0, msg.length - 11);
                //Find speaker's events and save them to privateConversationData for later use (if events button is clicked)
                var queryString = "SELECT * FROM c WHERE CONTAINS(c.Speakers, \"" + person + "\")";
                performQuery(queryString, function (err, results) {
                    if (err) {
                        console.log(err);
                    } else if (results && results[0]) {
                        session.privateConversationData.queryResults = results;
                        session.privateConversationData.searchType = "event";
                        session.replaceDialog('/ShowResults');
                    }
                });

            } else if (msg.toLowerCase().endsWith("full bio")) {
                var name = msg.substring(0, msg.length - 11);
                if (session.privateConversationData.fullBios) {
                    session.privateConversationData.fullBios.forEach(function (Bio, i) {
                        if (Bio.startsWith(name)) {
                            session.send(Bio.substring(name.length + 1, Bio.length));
                        }
                    })
                }
            } else if (msg.toLowerCase().startsWith("full description")) {
                session.send(session.privateConversationData.fullDescription[msg.substring(msg.length - 1, msg.length) - 1]);
            } else if (msg === "Full Sponsor Bio" && session.privateConversationData.fullSponsorBio && session.message.source.toLowerCase() === "skype") {
                session.send(session.privateConversationData.fullSponsorBio);
            } else if (msg.toLowerCase() === "hi" || msg.toLowerCase() === "hi" || msg.toLowerCase() === "menu" || msg.toLowerCase() === "back") {
                restart(session);
            } else if (messageIsTrack(session, msg)) {
                session.privateConversationData.Track = msg;
                session.reset('/querySessions');
            } else if (!session.privateConversationData.clickingButtons && msg != "Schedule Explorer" && msg != "Sessions/Expos" && msg != "Speaker Search" && msg != "Social Media" && msg != "Breakfast" && msg != "Lunch") {
                recognizeThis(msg, modelUrl, function (err, results, entities) {
                    var s = "";
                    if (results && results[0] && results[0].intent && results[0].score > .5 && results[0].intent != "None") {
                        session.replaceDialog("/" + results[0].intent, { entities });
                    } else {
                        performSearch(msg, 'speakerindex', function (err, results) {
                            if (err) {
                            }
                            //Checking relevance. >2 generally requires an exact event title match. Checking some buttons right now for some reason                            
                            if (results && (results[0]['@search.score'] > .05) && results[0].speakerName) {
                                if (results[0].speakerName.toLowerCase() === msg.toLowerCase()) {
                                    session.privateConversationData.queryResults = [results[0]];
                                } else {
                                    session.privateConversationData.queryResults = results;
                                }
                                session.privateConversationData.searchType = "person";
                                session.reset('/ShowResults', { entities });
                            } else {
                                var sponsor = msg.toLowerCase();
                                //accounting for some azure search confusion
                                if (sponsor === "data monsters" || sponsor === "hpc wire" || sponsor === "enterprise tech") {
                                    sponsor = sponsor.split(' ')[0] + sponsor.split(' ')[1];
                                }
                                //Search sponsor collection
                                performSearch(sponsor, 'sponsorindex', function (err, results) {
                                    if (err) {
                                    }
                                    if (results && (results[0]['@search.score'] > .1)) {
                                        session.privateConversationData.queryResults = results;
                                        session.privateConversationData.searchType = "sponsor";
                                        session.reset('/ShowResults');
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