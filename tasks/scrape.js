var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

/* GET users listing. */
exports.scrape = function(req, res) {
	
	var allTrails = [];	
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
		allTrails = [];
		
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

			  		res.render('scrape', {runs: allTrails});
				});

			}
		});
	})
};
