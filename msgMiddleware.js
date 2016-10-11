module.exports = function() {
    bot.use({
        botbuilder: function (session, next) {
            var modelUrl = 'https://api.projectoxford.ai/luis/v1/application?id=637e6cc7-7f9d-436e-84c8-31c91f4330bc&subscription-key=d20c9600f0894e28926d471cb716e6ac';
            var msg = session.message.text;
            var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=637e6cc7-7f9d-436e-84c8-31c91f4330bc&subscription-key=d20c9600f0894e28926d471cb716e6ac');

        if(!session.privateConversationData.clickingButtons){
            recognizeThis(msg, modelUrl, function (err, results, entities){
               var s = ""; 
               if(results && results[0] && results[0].intent){
                   if(results[0].score > .5 && results[0].intent != "None"){
                       session.replaceDialog("/" + results[0].intent, {entities});
                   } else {
                performSearch(msg, 'temp', function(err, results) {
                    if(err) {
                    }               
                    if(results) {
                        //Checking relevance. >2 generally requires an exact event title match. Checking some buttons right now for some reason
                        if (results[0]['@search.score'] > .05) {
                            session.privateConversationData.queryResults = results;  
                            session.privateConversationData.searchType = "person";
                            session.replaceDialog('/ShowResults', {entities});     
                            
                        } else {
                            // No sufficiently good results to reset query and restart
                            next();
                        }                    
                    } else {
                        performSearch(msg, 'sponsorsindex', function(err, results) {
                            if(err) {
                            }               
                            if(results) {
                                //Checking relevance. >2 generally requires an exact event title match. Checking some buttons right now for some reason
                                if (results[0]['@search.score'] > .05) {
                                    session.privateConversationData.queryResults = results;  
                                    session.privateConversationData.searchType = "sponsor";
                                    session.replaceDialog('/ShowResults');     
                                } else {
                                    // No sufficiently good results to reset query and restart
                                    session.replaceDialog('/');
                                }                    
                            } 
                            else {
                                next();
                            }
                        });
                    }
                });
                }
               }
            });   
        } else {
            next();
        }
        }
    });
}