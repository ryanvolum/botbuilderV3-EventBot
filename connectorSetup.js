module.exports = function() {

    var restify = require('restify');
    global.builder = require('botbuilder');

    var connector = new builder.ChatConnector({
            appId: '',
            appPassword: '',
           gzipData: true
        });

    global.bot = new builder.UniversalBot(connector);

    // Setup Restify Server
    var server = restify.createServer();
    server.listen(process.env.port || 3978, function () {
        console.log('%s listening to %s', server.name, server.url);
    });
    server.post('/api/messages', connector.listen());
    bot.use(builder.Middleware.dialogVersion({ version: 0.2, resetCommand: /^reset/i }));

}