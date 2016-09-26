module.exports = function(){
    bot.dialog('/sessions', [
        function (session) {
            builder.Prompts.choice(session, "What day are you interested in?", ['Monday November 7th', 'Tuesday November 8th', 'Wednesday November 9th']);
        },
        function (session, results) {
            if (results.response) {
                var selection = results.response.entity;
                // route to corresponding dialogs
                switch (selection) {
                    case "Monday November 7th":
                        session.replaceDialog('/sessions');
                        break;
                    case "Tuesday November 8th":
                        session.replaceDialog('/people');
                        break;
                    case "Wednesday November 9th":
                        session.replaceDialog('/sponsors');
                        break;
                    default:
                        session.reset('/');
                        break;
                }
            }
        }
    ]);
}