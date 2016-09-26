module.exports = function() {
    var AzureSearch = require('azure-search');
    global.searchClient = AzureSearch({
        url: "https://aiconfsearch.search.windows.net",
        key:"2904527716673916366701145724579E"
    });
}