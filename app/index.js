
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var path = require('path');
// var bodyParser = require('body-parser');
// var fs = require("fs")

// Initialize and configure Express
const port = process.env.PORT || 9002;
const router = express.Router();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use('/static', express.static(__dirname + '/public'));
// Start the server
app.use('/', router);
app.listen(port);
console.log('Serving on port ' + port);
