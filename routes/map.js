var express = require('express');
var router = express.Router();

router.use(express.static(__dirname + '/public'));
// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('keystonestatus');
    collection.find({},{},function(e,docs){
        res.render('map', {
            "keystone" : docs
        });
    });
});

router.get('/keystone', function(req, res) {
    var db = req.db;
    var collection = db.get('keystonestatus');
    collection.find({},{},function(e,docs){
        res.render('map', {
            trails : docs,
			title: "Keystone"
        });
    });
});

router.get('/bc', function(req, res) {
    var db = req.db;
    var collection = db.get('bcstatus');
    collection.find({},{},function(e,docs){
        res.render('map', {
            trails : docs,
			title: "Beaver Creek"
        });
    });
});

router.get('/vail', function(req, res) {
    var db = req.db;
    var collection = db.get('vailstatus');
    collection.find({},{},function(e,docs){
        res.render('map', {
            trails : docs,
			title: "Vail"
        });
    });
});

router.get('/breck', function(req, res) {
    var db = req.db;
    var collection = db.get('breckstatus');
    collection.find({},{},function(e,docs){
        res.render('map', {
            trails : docs,
			title: "Breckenridge"
        });
    });
});




module.exports = router;
