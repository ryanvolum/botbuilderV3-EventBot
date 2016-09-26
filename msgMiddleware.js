module.exports = function() {
    bot.use({
        botbuilder: function (session, next) {

            var msg = session.message.text;
            performSearch(msg, function(err, results) {
                if(err) {
                }               
                if(results) {
                    //Checking relevance. >2 generally requires an exact event title match
                    if (results[0]['@search.score'] > 2) {
                        
                        results[0].location = results[0].locationName;
                        results[0].url = results[0].imageUrl;
                        
                        var tempArray = [];
                        tempArray.push(results[0]);

                        for(var i = 1; i < results.length; i++){
                            if(results[i]['@search.score'] > .6){
                                results[i].location = results[i].locationName;
                                results[i].url = results[i].imageUrl;  
                                tempArray.push(results[i]);                                  
                            }
                        }


                        global.restartDialog(session,'/ShowResults');   
                    } else {
                        // No sufficiently good results to reset query and restart
                        global.restartDialog(session,'/');
                    }                    
                } else {
                    // No results to reset query and restart
                    next();
                }
            });
        }
    });
}