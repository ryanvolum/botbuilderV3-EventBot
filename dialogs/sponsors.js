module.exports = function(){
    bot.dialog('/sponsors', [
        function (session) {
            builder.Prompts.choice(session, "How would you like to explore the AI conference?", ['Sessions', 'People', 'Sponsors/Expos']);
        },
        function (session, results) {
            if (results.response) {
                var selection = results.response.entity;
                // route to corresponding dialogs
                switch (selection) {
                    case "Sessions":
                        session.replaceDialog('/sessions');
                        break;
                    case "People":
                        session.replaceDialog('/people');
                        break;
                    case "Sponsors/Expos":
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