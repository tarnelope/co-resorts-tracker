
var openRuns = {};
$.getJSON('data/keystone.json').done(function(data) {
	data.forEach(function(trail) {
		if (trail.trailStatus === "open") {
			openRuns[trail.trailName] = trail.trailDifficulty;
		}
	})
})

//keystone vector source
var vectorSource = new ol.source.GeoJSON({
	projection: 'EPSG:3857',
	url: 'data/keystoneKey.geojson'
});

//styles
var image = new ol.style.Circle({
	radius: 5,
	fill: null,
	stroke: new ol.style.Stroke({
		color: 'red',
		width: 1
	})
});

var styles = {
	'Neutral': [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 0.2)',
			width: 1
		}),
		fill: new ol.style.Fill({
			color: 'rgba(255,0,0,0.2)'
		})
	})],
	'Easy': [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'green',
			width: 2
		})
	})],
	'Intermediate': [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'blue',
			width: 2
		})
	})],
	'Advanced': [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'black',
			width: 2
		})
	})],
	'Closed': [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 0)',
			width: 2
		})
	})]
};

var styleFunction = function(feature, resolution) {
	var type = feature.getGeometry().getType();
	if (feature.getProperties().aerialway != "chair_lift") {
		var trailName = feature.getProperties().name;
		if (trailName !== undefined && trailName !== null) trailName = trailName.toUpperCase();
		var diff = feature.get('piste:difficulty');
		if (openRuns[trailName] === undefined || openRuns[trailName] === null) { //Run not open
			return styles['Closed'];
		} else {
			switch(openRuns[trailName]) {
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

var vectorLayer = new ol.layer.Vector({
	source: vectorSource,
	style: styleFunction
});

// Create a map
var map = new ol.Map({
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
		center: ol.proj.transform([-105.9137, 39.5658], 'EPSG:4326', 'EPSG:3857'),
		zoom: 13
	})
});
