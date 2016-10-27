module.exports = function() {

    var restify = require('restify');
    global.builder = require('botbuilder');

    var connector = new builder.ChatConnector({
            appId: process.env.MICROSOFT_APP_ID ? process.env.MICROSOFT_APP_ID : localAppId,
            appPassword: process.env.MICROSOFT_APP_PASSWORD ? process.env.MICROSOFT_APP_PASSWORD : localAppPassword,
           gzipData: true
        });

    global.bot = new builder.UniversalBot(connector);

    // Setup Restify Server
    var server = restify.createServer();
    server.listen(process.env.port || 80, function () {
        console.log('%s listening to %s', server.name, server.url);
    });
    server.post('/api/messages', connector.listen());
    bot.use(builder.Middleware.dialogVersion({ version: 0.2, resetCommand: /^reset/i }));

}