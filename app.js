'use strict'
require('babel-register'); 
var server = require('./server').default;

var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening on', port);
});