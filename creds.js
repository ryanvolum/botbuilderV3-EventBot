exports.connection = {  
     endpoint: process.env.AZURE_DOCDB_ENDPOINT,
     authKey: process.env.AZURE_DOCDB_AUTHKEY  
 };  
 
 exports.names = {  
     database: 'db',
     collection: 'Sessions'
 };