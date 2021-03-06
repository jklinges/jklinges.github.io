// Data Sources:

var geoJsonLayer;
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json

// Initialize LayerGroups and Define Varibles in Mapbox:
// Choices include dark, light, satellite, topography, oceanbase, worldimaginery

var WorldEarthquakes = new L.LayerGroup();
var TectoncPlates = new L.LayerGroup();
var heatLayer = new L.LayerGroup();

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

 var lightGray = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY    
});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-streets-v11",
    accessToken: API_KEY
});

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var Esri_OceanBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
    maxZoom: 17
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var Stamen_TonerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

var baseMaps = {
    "Dark Map": darkmap,
    "Light Gray": lightGray,
    "Light Map": lightMap,
    "Satellite Map": satellite,
    "Topography Map": OpenTopoMap,
    "Esri Ocean Base": Esri_OceanBasemap,
    "Esri World Imagery": Esri_WorldImagery,
    "Toner-Sea w/ Names" : Stamen_Toner,
    "Toner Background" : Stamen_TonerBackground,
    "Grey-sea w/ Names" : Stamen_TonerLite
};

// Create an overlays, map layers and overlay layers
var overlays = {
    "Earth Quake Magnitude": WorldEarthquakes,
    "Tectonic Plates": TectoncPlates,
    "Heat Map": heatLayer,
};

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightMap, WorldEarthquakes]
});

L.control.layers(baseMaps, overlays).addTo(myMap);

// Parse dealer location 

d3.json(queryUrl, function (data) {

    data.features.forEach((element) => {
        color = "red";
        // Conditionals for countries points
        if (element.properties.mag > 6) {
            color = "#67001f";
        } else if (element.properties.mag > 5) {
            color = "#980043";
        } else if (element.properties.mag > 4) {
            color = "#ce1256";
        } else if (element.properties.mag > 3) {
            color = "#e7298a";
        } else if (element.properties.mag > 2) {
            color = "#df65b0";
        } else if (element.properties.mag > 1) {
            color = "#c994c7";
        } else if (element.properties.mag > 0) {
            color = "#d4b9da";
        } else if (element.properties.mag > -1) {
            color = "#e7e1ef";
        }
        //   var geoJsonLayer = 
        // Add circles to map
        L.circle([element.geometry.coordinates[1], element.geometry.coordinates[0]], {
            fillOpacity: 0.7,
            color: color,
            fillColor: color,
            radius: element.properties.mag * 6000,
        }).bindPopup(`
        <h2>${element.properties.place}</h2><hr>
        <h4>${new Date(element.properties.time)}</h4>
        <p><b> Quake Magnitude: ${element.properties.mag} </b></p>
        <p><b> # who felt quake: ${element.properties.felt} </b></p>
        `).addTo(WorldEarthquakes);
        //.addTo(WorldEarthquakes); ;
        // geoJsonLayer.addLayer(WorldEarthquakes);
        // Adjust radius
        //adding data to layerGroup
    })
    //adding layer to map
    WorldEarthquakes.addTo(myMap);

    heatArray = []

    data.features.forEach((element) => {

        heatArray.push([element.geometry.coordinates[1], element.geometry.coordinates[0]])

    })

    L.heatLayer(heatArray, {
        minOpacity: 0.2,
        radius: 24,
        blur: 14,
        gradient: {0.9:'Red', 0.8: '#ff5f00', 0.7: 'Orange', 0.6: 'Yellow', 0.5: 'lime', 0.4: 'Aqua', 0.3: 'DarkBlue', 0.2: 'DarkBlue', 0.1: 'Purple'}
    }).addTo(heatLayer);
    heatLayer.addTo(myMap)

    d3.json(tectonicPlatesUrl, function (plateData) {
        //Create a GeoJson Layer from the plate data
        L.geoJson(plateData, {
            color: "#0087af",
            weight: 2
            //add plateData to LayerGroup
        }).addTo(TectoncPlates)
        //add layer to map
        TectoncPlates.addTo(myMap)
    })


    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<strong>EarthQuake Magnitude</strong>'],
            categories = ['6.0 or greater', '5-5.9', '4-4.9', '3-3.9', '2-2.9', '1-1.9', '0-0.9', '-1-(-0.1)'],
            // colors= ["Maroon", "Purple", "#5f0000", "red", "Fuchsia", "Olive", "Teal", "Green"]"#ff0000"
            colors = ["#67001f", "#980043", "#ce1256", "#e7298a", "#df65b0", "#c994c7", "#d4b9da", "#e7e1ef"];
        div.innerHTML = ""
        for (var i = 0; i < categories.length; i++) {

            labels.push(
                '<div class="circle" style="height:20px; width:20 px; background: ' + (colors[i] ? colors[i] : '+') + '"></div> ' +
                (categories[i] ? categories[i] : '+'));
            console.log(categories[i])
            console.log(colors[i])

        }
        div.innerHTML = labels.join('<br>');
        return div;

    };

    // Create map legend
    legend.addTo(myMap);

});