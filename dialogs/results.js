module.exports = function() {

    bot.dialog('/ShowResults', [
        function (session, queryData) {
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
            var msgTitle = global.generateMessageTitle(session);
            var result = session.privateConversationData.queryResults[0];

            // Use default image if none provided
            var img = result.imageURL ? result.imageURL : "https://bumberbot.blob.core.windows.net/maps/white.img"; 
            msg.addAttachment(
                new builder.HeroCard(session)
                .title(result.speakerName)
                .subtitle(result.Creds + " at " + result.Company)
                .text(result.Description)
                .images([builder.CardImage.create(session, img)])
            );
            if(msgTitle){
                session.send(msgTitle);
            }
            session.send(msg);
            session.endDialog(0);
    }
    ]);


}