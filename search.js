module.exports = function() {    

    global.performSearch = function(name, index, callback) {
        searchClient.search(index, {search: name, $top: 5}, function(err, results) {
            if (err) {
                callback(err);
            } else if (results && results.length > 0) {                
                callback(null, results);
            } else {
                callback();
            }
        });
    }

    global.getEventsByTrack = function(Track, Day, callback) {
        searchClient.search('sessionsfinalindex' , {$filter: "Track eq '" + Track + "' and Day eq '" + Day +"'", $orderby: "eventID", $top: 10 }, function(err, results) {
            if (err) {
                callback(err, null);
            } else if (results && results.length > 0) {                
                callback(null, results);
            } else {
                callback();
            }
        });
    }

    global.getTrackFacets = function(day, callback) {
        var request = require('request');
        var apiKey = process.env.AZURE_SEARCH_READ_KEY ? process.env.AZURE_SEARCH_READ_KEY : localApiKey;
        request('https://aiconfsearch.search.windows.net/indexes/sessionsfinalindex/docs?api-key=' + apiKey + '&api-version=2015-02-28&$filter=Day eq \'' + day + '\'&facet=Track', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                if(result && result['@search.facets'] && result['@search.facets'].Track){
                    callback(null, result['@search.facets'].Track);
                }
            } else {
                callback(error, null);
            }
        })
    }    

    global.getEventsBySpeaker = function (speakerName, callback){
        searchClient.search('eventindex' , {$filter: "Speakers eq '" + speakerName + "'", $top: 10}, function(err, results){
            if(err) {
                callback(err);
            } else if (results && results.length > 0){
                callback(null, results);
            } else {
                callback();
            }
    });
    }
}