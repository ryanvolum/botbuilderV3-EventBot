module.exports = function () {

    global.performQuery = function (session) {
        var queryStatement = "SELECT * FROM c WHERE CONTAINS(c.Speakers, \"" + speakerName + "\")";

        var querySpec = {
            query: queryStatement
        };        

        // query documentDB
        client.queryDocuments(collLink, querySpec).toArray(function (err, results) {
            if (err) {
                    session.replaceDialog('/error');
                    return;
            } else if (results && results.length === 0) {
                session.send(`There's nothing for ${generateTitle(session, 'results')}.`);
                session.replaceDialog('/RandomRecommended');
            } else {
                // show the results
                session.privateConversationData.queryResults = sortedQueryResults(results);
                session.privateConversationData.resultPage = 0;
                session.replaceDialog('/ShowResults', { querySpec: querySpec });
            }
        });
    }

}