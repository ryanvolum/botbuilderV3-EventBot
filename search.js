module.exports = function() {    

    global.performSearch = function(name, index, callback) {
        searchClient.search(index, {search: name, $top: 5}, function(err, results) {
            if (err) {
                callback(err);
            } else if (results.length > 0) {                
                callback(null, results);
            } else {
                callback();
            }
        });
    }

    global.getEventsByTrack = function(Track, Day, callback) {
        searchClient.search('mondaysessionindex' , {$filter: "Track eq '" + Track + "' and Day eq '" + Day +"'", $top: 10 }, function(err, results) {
            if (err) {
                callback(err);
            } else if (results && results.length > 0) {                
                callback(null, results);
            } else {
                callback();
            }
        });
    }

    global.getTrackFacets = function(day, callback) {
        var request = require('request');
        var apiKey = '';
        request('https://aiconfsearch.search.windows.net/indexes/mondaysessionindex/docs?api-key=' + apiKey + '&api-version=2015-02-28&$filter=Day eq \'Monday\'&facet=Track', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                if(result && result['@search.facets'] && result['@search.facets'].Track){
                    callback(null, result['@search.facets'].Track);
                }
            } else {
                callback(error, null);
            }
        })    
        /*
        searchClient.search('eventindex' , {$filter: "Day eq '" + day + "'", $facet: "'Track'"}, function(err, results) {
            if (err) {
                callback(err);
            } else if (results && results.length > 0) {                
                callback(null, results);
            } else {
                callback();
            }
        });
        */
    }

    global.getEventsBySpeaker = function (speakerName, callback){
        searchClient.search('eventindex' , {$filter: "Speakers eq '" + speakerName + "'", $top: 10}, function(err, results){
            if(err) {
                callback(err);
            } else if (results.length > 0){
                callback(null, results);
            } else {
                callback();
            }
    });
    }
}