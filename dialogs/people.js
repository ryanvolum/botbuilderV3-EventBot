module.exports = function () {
    bot.dialog('/people', [
        function (session) {
            builder.Prompts.text(session, "Type in the name of the person you are searching for:");
        },
        function (session, results) {
            var name = results.response;
            //search for person
            performSearch(name, 'speakerindex', function (err, results) {
                if (err) {
                }
                if (results && results[0]['@search.score'] && results[0]['@search.score'] > .5) {
                    session.privateConversationData.queryResults = results;
                    session.privateConversationData.searchType = "person";

                    //for Skype
                    if(session.message.source.toLowerCase() === "skype"){
                        session.privateConversationData.fullBio = results[0].Description;
                    }
                    //Find speaker's events and save them to privateConversationData for later use (if events button is clicked)
                    var queryString = "SELECT * FROM c WHERE CONTAINS(c.Speakers, \"" + name + "\")";
                    performQuery(queryString, function (err, results) {
                        if (err) {
                            console.log(err);
                        } else if (results && results[0]) {
                            session.privateConversationData.speakersEvents = results;
                        }
                        session.replaceDialog('/ShowResults');
                    });
                } else {
                    // No sufficiently good results to reset query and restart
                    session.send("I couldn't find a speaker by that name");
                    session.replaceDialog('/promptButtons');
                }
            });
        }
    ]);
}

