module.exports = function(){
    bot.dialog('/people', [
        function (session) {
            builder.Prompts.text(session, "Type in the name of the person you are searching for:");
        },
        function (session, results) {
            var name = results.response;
                performSearch(name, function(err, results) {
                    if(err) {
                    }               
                    if(results) {

                        //Checking relevance. >2 generally requires an exact event title match. Checking some buttons right now for some reason
                        if (results[0]['@search.score'] > .5) {
                            session.privateConversationData.queryResults = results;  
                            session.privateConversationData.searchType = "person";
                            session.replaceDialog('/ShowResults');     
                        } else {
                            // No sufficiently good results to reset query and restart
                            replaceDialog('/');
                        }                    
                    } else{}
                });
//            var name = results.response;
//            session.endDialog("You searched for " + name + "!");
        }
    ]);
}