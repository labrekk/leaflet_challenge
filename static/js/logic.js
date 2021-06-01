// Create map object
var myMap = L.map("mapid", {
  center: [37.7749, -122.4194],
  zoom: 2
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson?";

function radiusFind (magnitude) {
  return magnitude * 5
}

function colorMarker (depth) {
  if (depth > 90 ) {
    return "#3AB341"
  }
  if (depth > 70) {
    return "#00eede"
  }
  if (depth > 50) {
    return "#0073ee"
  }
  if (depth > 30) {
    return "#ee9c00"
  }
  if (depth > 10) {
    return "#d600ee"
  }
  else {
    return "#ea782c"
  }
}

  // Binding a popup to each layer 
//   see day 2 web mapping

d3.json(url).then(function (data) {
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng)

    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Magnitude: " + feature.properties.mag +  "</p><p>Depth: " + feature.geometry.coordinates[2] );
    },
      
    // Style markers
    style: function (feature, layer) {
      return {
        radius: radiusFind(feature.properties.mag),
        opacity: 0,
        fillOpacity: .75, 
        color: colorMarker(feature.geometry.coordinates[2])
      }
    }
  
  }).addTo(myMap);
  
})
// Set up the legend.

var legend = L.control({
  position: "bottomright"
  });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#3AB341",
      "#00eede",
      "#0073ee",
      "#ee9c00",
      "#d600ee",
      "#ea782c"];


    // For loop - assign color
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<div class = 'color-text-combo'><i style='background: "
        + colors[i]
        + "'></i> "
        + grades[i]
        + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "</div><br>" : "+");
    }
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
