var express = require('express');
var app = express();

var routes = require('./routes');
const port = process.env.PORT || 9002;

app.use('/static', express.static(__dirname + '/static'));
app.use('/', routes);

app.listen(port);
console.log('Serving on port ' + port);
