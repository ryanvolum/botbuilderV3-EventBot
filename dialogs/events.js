module.exports = function(){
    bot.dialog('/sessions', [
        function (session) {
            builder.Prompts.choice(session, "What day are you interested in?", ['Monday 11/7', 'Tuesday 11/8', 'Wednesday 11/9']);
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