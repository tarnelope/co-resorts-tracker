var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('bcstatus');
    collection.find({},{},function(e,docs){
        res.render('map', {
            "beav" : docs
        });
    });
});


module.exports = router;
