module.exports = function(){
    bot.dialog('/sessions', [
        function (session) {
            builder.Prompts.choice(session, "What day are you interested in?", ['Monday November 7th', 'Tuesday November 8th', 'Wednesday November 9th']);
        },
        function (session, results) {
            if (results.response) {

                var selection = results.response.entity.split(" ");
                var Day = selection[0];

                getEventsByDay(Day, function(err, results){
                    if(err){

                    } else if (results){
                        session.privateConversationData.queryResults = results;
                        session.privateConversationData.searchType = "event";
                        session.replaceDialog('/ShowResults')
                    } else {
                        session.endDialog();
                    }

                })
            }
        }
    ]);
}