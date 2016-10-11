module.exports = function() {
    var AzureSearch = require('azure-search');
    global.searchClient = AzureSearch({
        url: "https://aiconfsearch.search.windows.net",
        key: "2904527716673916366701145724579E"
    });

    var DocumentDBClient = require('documentdb').DocumentClient
    , config = require('./creds')
    , databaseId = config.names.database
    , collectionId = config.names.collection
    , dbLink
    , collLink = 'dbs/' + databaseId + '/colls/' + collectionId;

    var host = config.connection.endpoint;
    var masterKey = config.connection.authKey;

    global.client = new DocumentDBClient( host, { masterKey: masterKey });
    global.collLink = collLink;
}



