var http = require('http');
var serveStaticFiles = require('ecstatic')({ root: __dirname + '/www' });
var port = process.env.PORT || 8000;

http.createServer(function (req, res) {
    serveStaticFiles(req, res);
}).listen(port);

console.log('Listening on http://localhost:%d', port);
