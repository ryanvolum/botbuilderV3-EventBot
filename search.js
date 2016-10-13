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