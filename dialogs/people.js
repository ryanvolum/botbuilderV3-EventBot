module.exports = function(){
    bot.dialog('/people', [
        function (session) {
             builder.Prompts.text(session, "Type in the name of the person you are searching for:");
        },
        function (session, results) {
            var name = results.response;
            performSearch(name, 'temp', function(err, results) {
                if(err) {
                }               
                if(results) {

                    if (results[0]['@search.score'] > .5) {
                        session.privateConversationData.queryResults = results;  
                        session.privateConversationData.searchType = "person";
                        
                        getPersonsEvents(name, function (err, results){
                            if(err){
                                console.log(err);
                            }
                                session.privateConversationData.speakersEvents = [];
                                for(var i = 0; i < results.length; i++){
                                    session.privateConversationData.speakersEvents[i] = results[i].Title;
                                }
                        session.replaceDialog('/ShowResults');     
                        });
                    } else {
                        // No sufficiently good results to reset query and restart
                        session.replaceDialog('/');
                    }                    
                } else{}
            });
        }
    ]);
}

getPersonsEvents = function (speakerName, callback){
    var querySpec = {
        query: "SELECT * FROM c WHERE CONTAINS(c.Speakers, \"" + speakerName + "\")"
    };        
    // query documentDB
    client.queryDocuments(collLink, querySpec).toArray(function (err, results) {    
        if(err){
            callback(err);
        } else if (results){
            var s = "";
            callback(null, results);
        }         
    });
}
