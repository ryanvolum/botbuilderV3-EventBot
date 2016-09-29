module.exports = function() {

    var restify = require('restify');
    global.builder = require('botbuilder');

    var connector = new builder.ChatConnector({
            appId: 'dc9f3d2d-070b-42be-b706-bb76ef35a3f4',
            appPassword: '7ppi0ZkjrL2FOVyZAaWSUar',
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