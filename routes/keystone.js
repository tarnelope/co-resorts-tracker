var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('keystonestatus');
    collection.find({},{},function(e,docs){
        res.render('keystone', {
            "keystone" : docs
        });
    });
});


module.exports = router;
