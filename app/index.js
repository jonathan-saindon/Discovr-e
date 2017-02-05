
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var path = require('path');

// Initialize and configure Express
const port = process.env.PORT || 9002;
const router = express.Router();

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.use('/static', express.static(__dirname + '/static'));

// Start the server
app.use('/', router);
app.listen(port);
console.log('Serving on port ' + port);
