module.exports = function(){
    bot.dialog('/sponsors', [
        function (session) {
            builder.Prompts.text(session, "Search the sponsor you're interested in:");
        },
        function (session, results) {
            var sponsor = results.response;
                performSearch(sponsor, 'sponsorsindex', function(err, results) {
                    if(err) {
                    }               
                    if(results) {
                        //Checking relevance. >2 generally requires an exact event title match. Checking some buttons right now for some reason
                        if (results[0]['@search.score'] > .1) {
                            session.privateConversationData.queryResults = results;  
                            session.privateConversationData.searchType = "sponsor";
                            session.replaceDialog('/ShowResults');     
                        } else {
                            // No sufficiently good results to reset query and restart
                            session.replaceDialog('/');
                        }                    
                    } else{}
                });
//            var name = results.response;
//            session.endDialog("You searched for " + name + "!");
        }
    ]);
}