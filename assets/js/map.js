markers = [];
polylines = [];

function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: {
			lat: 0,
			lng: 0,
		},
		zoom: 2,
	});

	var searchBox = new google.maps.places.SearchBox(
		document.getElementById("pac-input"),
	);
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(
		document.getElementById("pac-input"),
	);
	google.maps.event.addListener(searchBox, "places_changed", function () {
		searchBox.set("map", null);
		
		var places = searchBox.getPlaces();
		var bounds = new google.maps.LatLngBounds();
		var i, place;
		
		for (i = 0; (place = places[i]); i++) {
			(function (place) {
				var marker = new google.maps.Marker({
					position: place.geometry.location,
				});
				marker.bindTo("map", searchBox, "map");
				google.maps.event.addListener(marker, "map_changed", function () {
					if (!this.getMap()) {
						this.unbindAll();
					}
				});
				bounds.extend(place.geometry.location);
			})(place);
		}
		map.fitBounds(bounds);
		searchBox.set("map", map);
		map.setZoom(Math.min(map.getZoom(), 12));
	});

	google.maps.event.addListener(map, "click", (event) => {
		images[imageSelected].points[pointSelected].mapCoords = event.latLng;
		rePoints();
	});

	const l1 = new google.maps.Polyline({
		path: line,
		geodesic: true,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 2,
	});

	l1.setMap(map);

	var lineHeading = google.maps.geometry.spherical.computeHeading(
		line.getPath().getAt(0),
		line.getPath().getAt(1),
	);
	var newPt0 = google.maps.geometry.spherical.computeOffset(
		line.getPath().getAt(0),
		20000000,
		lineHeading,
	);
	line.getPath().insertAt(0, newPt0);
	var newPt1 = google.maps.geometry.spherical.computeOffset(
		line.getPath().getAt(1),
		20000000,
		lineHeading + 180,
	);
	line.getPath().push(newPt1);
}

function rePoints() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setVisible(false);
		if (polylines[i] != undefined) {
			polylines[i].setVisible(false);
		}
	}
	markers = [];
	polylines = [];
	for (imageCount = 0; imageCount < images.length; imageCount++) {
		for (pointCount = 0; pointCount < images[imageCount].points.length; pointCount++) { 
			if (
				typeof images[imageCount].points[pointCount] !== "undefined" &&
				typeof images[imageCount].points[pointCount].mapCoords !== "undefined" &&
				images[imageCount].points[pointCount].mapCoords != null
			) {
				iconUrl = "./assets/images/blue-pin.png";
				strokeColor = "blue";
				if (imageCount == imageSelected && pointCount == pointSelected) {
					iconUrl = "./assets/images/red-pin.png";
					strokeColor = "red";
				}
				addMarker(
					images[imageCount].points[pointCount].mapCoords,
					map,
					iconUrl,
				);
				angle = findAngle(images[imageCount].points[pointCount].imgXCoord);
				addLine(
					images[imageCount].points[pointCount].mapCoords,
					angle,
					strokeColor,
				);
			}
		}
	}
}

function addMarker(location, map, iconUrl) {
	markers.push(
		new google.maps.Marker({
			position: location,
			icon: iconUrl,
			map: map,
		}),
	);
}

function addLine(rpoint, deg, color) {
	org = {
		x: rpoint.lng(),
		y: rpoint.lat(),
	};

	pnt1 = {
		x: rpoint.lng(),
		y: rpoint.lat() + 40,
	};

	line = [
		{ lat: rpoint.lat(), lng: rpoint.lng() },
		{
			lat: rotatePoint(pnt1, org, -deg).y,
			lng: rotatePoint(pnt1, org, -deg).x,
		},
	];

	polylines.push(
		new google.maps.Polyline({
			path: line,
			geodesic: true,
			strokeColor: color,
			strokeOpacity: 1.0,
			strokeWeight: 2,
			map: map,
		}),
	);
}

function rotatePoint(point, origin, angle) {
	var angleRad = (angle * Math.PI) / 180.0;
	return {
		x:
			Math.cos(angleRad) * (point.x - origin.x) -
			Math.sin(angleRad) * (point.y - origin.y) +
			origin.x,
		y:
			Math.sin(angleRad) * (point.x - origin.x) +
			Math.cos(angleRad) * (point.y - origin.y) +
			origin.y,
	};
}

google.maps.event.addDomListener(window, "load", initMap);
