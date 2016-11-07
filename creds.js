exports.connection = {  
     endpoint: process.env.AZURE_DOCDB_ENDPOINT ? process.env.AZURE_DOCDB_ENDPOINT : localEndpoint,
     authKey: process.env.AZURE_DOCDB_AUTHKEY ? process.env.AZURE_DOCDB_AUTHKEY : localAuthKey  
 };  
 
 exports.names = {  
     database: 'db',
     collection: 'sessionsFinal'
 };