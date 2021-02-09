var earthquakes;
var overlays;
var myMap;
var boundaries;

let satelliteLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/satellite-v9',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: API_KEY
});

let grayscaleLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/light-v10',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: API_KEY
});

let outdoorsLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/outdoors-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: API_KEY
});

let baseMaps = {
  "Satellite Map": satelliteLayer,
  "Grayscale Map": grayscaleLayer,
  "World Map": outdoorsLayer
};

// https://github.com/fraxen/tectonicplates
// For some reason can't get a direct URL to connect
d3.json("static/data/plateLayers.json").then(data => {
  boundaries = L.geoJSON(data.features);
});

// https://www.w3schools.com/cssref/func_hsla.asp
function magnitudeToColor(magnitude) {
  return `hsla(${30 - 9 * magnitude}, 100%, 60%, 0.8)`;
};


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(quakes => {
  earthquakes = L.geoJSON(quakes.features, {
    pointToLayer: ((feature, latlng) => (
      L.circleMarker(latlng, {
        radius: 3.0 + 2 * feature.properties.mag,
        color: `${magnitudeToColor(feature.properties.mag)}`,
        fillOpacity: 0.8
      })
    ))
  }).bindPopup(layer => ("Magnitude: " + layer.feature.properties.mag.toString()
    + "<br/>Location: " + layer.feature.properties.place));

  overlays = {
    "Earthquakes": earthquakes,
    "Techtonic Plates": boundaries
  }

  myMap = L.map("map", {
    center: [31.44, -100.45],
    zoom: 4,
    layers: [outdoorsLayer, earthquakes, boundaries]
  });

  L.control.layers(baseMaps, overlays, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div","info legend");
    var limits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var colors = `hsla(${30 - 9 * magnitude}, 100%, 60%, 0.8)`;
    var labels = [];

  var legendInfo = "<h1>Magnitude</h1>" +
    "<div class=\"labels\">" +
      "<div class\"min\">" + limits[0] + "</div>" +
      "<div class\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
  };
});
