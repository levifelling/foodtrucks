$(document).on('pageshow', function() {
  var layer = new L.StamenTileLayer("toner-lite");
  var map = new L.Map('map', {
    center: new L.LatLng(44.799, -91.464),
    zoom: 12
  });
  map.addLayer(layer)

  trucks = new L.geoJson(null, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
	    '<a href="' + feature.properties.links + '">' + feature.properties.name + '</a>'+
        '<p>Hours: ' + feature.properties.start_time + ' - ' + feature.properties.end_time + '</p>',
        {
          clickable: true
        }
      )
    }
  });
  trucks.addTo(map);

  $.ajax({
    dataType: "json",
    url: "http://foodtrucks1.version-three.com/default-endpoint",
    success: function(data) {
      addToMap(data[0]);
    }
  }).error(function(err) {
    console.log(err)
  });
});

function addToMap(data) {
  $.each(data, function(key, value) {
    if (value.lat) {
      trucks.addData({
        "type": "Feature",
        "properties": {
          "name": value.name,
          "start_time": value.start_time,
          "end_time": value.end_time,
          "links": value.links,
          "id": key
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            value.lng,
            value.lat
          ]
        }
      });
    }
  });
}