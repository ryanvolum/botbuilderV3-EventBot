module.exports = function() {    
    global.performSearch = function(speakerName, callback) {
        searchClient.search('temp', {search: speakerName, $top: 5}, function(err, results) {
            if (err) {
                callback(err);
            } else if (results.length > 0) {
                results.url = results.imageUrl;
                
                callback(null, results);
            } else {
                callback();
            }
        });
    }
}