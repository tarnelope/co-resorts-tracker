var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/keystone', function(req, res) {
    var db = req.db;
    var collection = db.get('keystonestatus');
    collection.find({},{},function(e,docs){
        res.render('keystone', {
            "keystone" : docs
        });
    });
});

module.exports = router;
