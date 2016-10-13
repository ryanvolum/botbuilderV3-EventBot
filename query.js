module.exports = function () {

getPersonsEvents = function (speakerName, callback){
    var querySpec = {
        query: "SELECT * FROM c WHERE CONTAINS(c.Speakers, \"" + speakerName + "\")"
    };        
    // query documentDB
        client.queryDocuments(collLink, querySpec).toArray(function (err, results) {    
            if(err){
                callback(err);
            } else if (results){
                var s = "";
                callback(null, results);
            }         
        });
    }

    global.eventQuery = function (eventName, callback) {
        var querySpec = {
            query: "SELECT * FROM c WHERE c.Title = \"" + eventName + "\""
        };        

        // query documentDB
        client.queryDocuments(collLink, querySpec).toArray(function (err, results) {
            if(err){
                callback(err);
            } else if (results){
                var s = "";
                callback(null, results);
            }         
        });
    }

}