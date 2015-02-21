var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var urls = [
	{
		'resort': 'keystone',
		'url': 'http://www.keystoneresort.com/ski-and-snowboard/terrain-status.aspx#/TerrainStatus'
	}, {
		'resort': 'beaverCreek',
		'url': 'http://www.beavercreek.com/the-mountain/terrain-status.aspx#/TerrainStatus'
	},
	{
		'resort': 'breck',
		'url': 'http://www.breckenridge.com/mountain/terrain-status.aspx'
	},
	{
		'resort': 'vail',
		'url': 'http://www.vail.com/mountain/current-conditions/whats-open-today.aspx'
	}
];

var urlsLength = urls.length;
var count = 1;

module.exports = function(grunt) {
	grunt.registerTask('scrape', function() {

		var done = this.async();
		
		urls.forEach(function(resortObj) {
			
			var resortName = resortObj.resort;
			var fileName = './public/data/' + resortName + '.json';

			var now = new Date();
			var allTrails = [
				{
					"date": getFormattedDate(now),
					"time": getFormattedTime(now)
				}
			];

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
								trailDifficulty = "easy";
							} else if (data.hasClass('moreDifficult')) {
								trailDifficulty = "intermediate";
							} else {
								trailDifficulty = "advanced";
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

						grunt.log.writeln("Scraped!");
						if (count === urlsLength) {
							done();
						} else {
							count++;
						}
					});
				} else {
					done();	
				}
			});
		});
	});
};

function getFormattedDate(currentDate) {
	var dd = currentDate.getDate();
	var monthSingleDigit = currentDate.getMonth() + 1,
	    mm = monthSingleDigit < 10 ? '0' + monthSingleDigit : monthSingleDigit;
	var yy = currentDate.getFullYear().toString().substr(2);

	var formattedDate = mm + '/' + dd + '/' + yy;
	return formattedDate;
}

function getFormattedTime(currentDate) {
	var hour = currentDate.getHours(),
		h = hour < 10 ? '0' + hour : hour;
	var min = currentDate.getMinutes(),
		m = min < 10 ? '0' + min : min;
	var sec = currentDate.getMinutes(),
		s = sec < 10 ? '0' + sec : sec;
	
	var time = hour + ":"  
	               + min + ":" 
	               + sec;
	
	return time;
}