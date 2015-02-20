(function() {
	console.log("local data is " + resort);

	var keyName = '../data/keystoneKey.geojson';
	var dailyJSON = '../data/keystone.json';
	var mapCenter = [-105.9137, 39.5658];

	switch (resort) {
		case "Keystone":
			keyName = '../data/keystoneKey.geojson';
			dailyJSON = '../data/keystone.json';
			mapCenter = [-105.9137, 39.5658];
			break;
			/*BELOW DATA IS NOT UP TO DATE YET*/
		case "Beaver Creek":
			keyName = '../data/bcKey.geojson';
			dailyJSON = '../data/beaverCreek.json';
			mapCenter = [-106.5179, 39.5826];
			break;
	}


	var openRuns = {};
	$.getJSON(dailyJSON).done(function(data) {
		data.forEach(function(trail) {
			if (trail.trailStatus === "open") {
				openRuns[trail.trailName] = trail.trailDifficulty;
			}
		})
	})

	//keystone vector source
	var vectorSource = new ol.source.GeoJSON({
		projection: 'EPSG:3857',
		url: keyName
	});

	var styles = {
		'Neutral': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'rgba(0, 0, 0, 0.2)',
				width: 2
			}),
			fill: new ol.style.Fill({
				color: 'rgba(255,0,0,0.2)'
			})
		})],
		'Easy': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'green',
				width: 3
			})
		})],
		'Intermediate': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'blue',
				width: 3
			})
		})],
		'Advanced': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'black',
				width: 3
			})
		})],
		'Closed': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'red',
				width: 3
			})
		})]
	};

	var styleFunction = function(feature, resolution) {
		if (feature.getProperties().aerialway != "chair_lift") {
			var trailName = feature.getProperties().name;
			if (trailName !== undefined && trailName !== null) trailName = trailName.toUpperCase();
			var diff = feature.get('piste:difficulty');
			if (openRuns[trailName] === undefined || openRuns[trailName] === null) { //Run not open
				return styles['Closed'];
			} else {
				switch (openRuns[trailName]) {
					case "easy":
						return styles['Easy'];
						break;
					case "intermediate":
						return styles['Intermediate'];
						break;
					case "advanced":
						return styles['Advanced'];
						break;
					default:
						return styles['Neutral'];
						break;
				}
			}
		} else {
			return styles['Neutral'];
		}
	};

	var selectClick = new ol.interaction.Select({
		condition: ol.events.condition.click
	});

	var vectorLayer = new ol.layer.Vector({
		source: vectorSource,
		style: styleFunction
	});
	
	/**
	 * Elements that make up the popup.
	 */
	var container = document.getElementById('popup');
	var content = document.getElementById('popup-content');
	var closer = document.getElementById('popup-closer');


	/**
	 * Add a click handler to hide the popup.
	 * @return {boolean} Don't follow the href.
	 */
	closer.onclick = function() {
	  overlay.setPosition(undefined);
	  closer.blur();
	  return false;
	};


	/**
	 * Create an overlay to anchor the popup to the map.
	 */
	var overlay = new ol.Overlay({
	  element: container
	});

	// Create a map
	var map = new ol.Map({
		overlays: [overlay],
		target: 'map',
		layers: [
			new ol.layer.Tile({
				source: new ol.source.MapQuest({
					layer: 'osm'
				})
			}),
			vectorLayer
		],
		view: new ol.View({
			center: ol.proj.transform(mapCenter, 'EPSG:4326', 'EPSG:3857'),
			zoom: 13
		})
	});

	map.addInteraction(selectClick);
	
	map.on('click', function(evt) {
		var coordinate = evt.coordinate;
		var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
			return feature;
		});
		if (feature !== undefined && feature !== null) {
			content.innerHTML = '<p>'+ feature.get('name').toUpperCase() +'</p><p>'+feature.get('piste:difficulty').substr(0,1).toUpperCase()+ feature.get('piste:difficulty').substr(1)+'</p>';
			overlay.setPosition(coordinate);
		}
	});

})();
