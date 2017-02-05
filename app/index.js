
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var path = require('path');
var bodyParser = require('body-parser');
// var bodyParser = require('body-parser');
// var fs = require("fs")

// Initialize and configure Express
const port = process.env.PORT || 9002;
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

var monument = require('./static/data/monument.js').monument;
router.get('/data/monument', function(req, res) {
    res.json(monument);
});
var lieuCulturel = require('./static/data/lieuCulturel.js').lieuCulturel;
router.get('/data/lieuCulturel', function(req, res) {
    res.json(lieuCulturel);
});

app.use('/static', express.static(__dirname + '/static'));

// Start the server
app.use('/', router);
app.listen(port);
console.log('Serving on port ' + port);
