var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res){
	//Url we will scrape from
	var urls = [{
		'resort': 'keystone',
		'url': 'http://www.keystoneresort.com/ski-and-snowboard/terrain-status.aspx#/TerrainStatus'
	}, {
		'resort': 'beaverCreek',
		'url': 'http://www.beavercreek.com/the-mountain/terrain-status.aspx#/TerrainStatus'
	}];

	
	urls.forEach(function(resortObj) {
		
		var fileName = 'output'+resortObj.resort+'.json';
		var allTrails = [];
		
		request(resortObj.url, function(error, response, html) {
			
			if (!error) {
			
				var $ = cheerio.load(html);
				var trailName, trailStatus, trailDifficulty;
			
				$('.firstCol').map(function() {
				
					var trail = {trailName: "", trailStatus: "", trailDifficulty: "" };
				
					var data = $(this);
				
					trailName = data.next().text().toUpperCase();
					if (trailName != "TRAIL" && trailName != "TYPE") {
						trail.trailName = trailName;
			
						if (data.hasClass('easiest')) {
							trailDifficulty = "easiest";
						} else if (data.hasClass('moreDifficult')) {
							trailDifficulty = "moreDifficult";
						} else {
							trailDifficulty = "mostDifficult";
						}
						trail.trailDifficulty = trailDifficulty;
			
						if (data.next().next().hasClass('yesStatus')) {
							trailStatus = "open";
						} else {
							trailStatus = "closed";
						}
						trail.trailStatus = trailStatus;
				
						allTrails.push(trail);
					}
				});
				
				fs.writeFile(fileName, JSON.stringify(allTrails, null, 4), function (err) {
				  if (err) throw err;
				  console.log("Scraped!")
				});
			}
		});
		
		res.send('ENDED');
	})
});




app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;