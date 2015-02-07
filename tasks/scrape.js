var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var urls = [{
	'resort': 'keystone',
	'url': 'http://www.keystoneresort.com/ski-and-snowboard/terrain-status.aspx#/TerrainStatus'
}, {
	'resort': 'beaverCreek',
	'url': 'http://www.beavercreek.com/the-mountain/terrain-status.aspx#/TerrainStatus'
}];

module.exports = function(grunt) {
	grunt.registerTask('scrape_keystone', 'KEYSTONE', function() {

			var done = this.async();

			urls.forEach(function(resortObj) {

					var fileName = './data/' + resortObj.resort + '.json';
					var allTrails = [];

					request(resortObj.url, function(error, response, html) {

						if (!error) {

							var $ = cheerio.load(html);
							var trailName, trailStatus, trailDifficulty;

							$('.firstCol').map(function() {

								var trail = {
									trailName: "",
									trailStatus: "",
									trailDifficulty: ""
								};

								var data = $(this);

								trailName = data.next().text().toUpperCase();

								if (trailName !== "TRAIL" && trailName !== "TYPE") {
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

							fs.writeFile(fileName, JSON.stringify(allTrails, null, 4), function(err) {
								if (err) {
									throw err;
								}
								console.log("Scraped!");
							});
						} else {
							done();
						}
					});
				});
				
			});
	};