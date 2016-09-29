module.exports = function() {    
    global.performSearch = function(speakerName, index, callback) {
        searchClient.search(index, {search: speakerName, $top: 5}, function(err, results) {
            if (err) {
                callback(err);
            } else if (results.length > 0) {                
                callback(null, results);
            } else {
                callback();
            }
        });
    }

    global.getEventsByDay = function(Day, callback) {
        searchClient.search('eventindex' , {$filter: "Day eq '" + Day + "'", $top: 10 }, function(err, results) {
            if (err) {
                callback(err);
            } else if (results.length > 0) {                
                callback(null, results);
            } else {
                callback();
            }
        });
    }
}