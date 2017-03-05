var express = require('express');
var app = express();

var routes = require('./routes');
const port = process.env.PORT || 9002;

app.use('/', express.static(__dirname + '/public'));
app.use('/', routes);

app.listen(port);
console.log('Serving on port ' + port);
