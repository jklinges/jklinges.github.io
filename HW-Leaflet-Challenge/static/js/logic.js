
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
// var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [32.09, 82.71],
  zoom: 1,
  accessToken: API_KEY
});


map.on('load', function () {


  map.addSource('quakes', { "type": 'geojson', "data": url });
  map.addLayer({
    'id': 'quakes-heat',
    'type': 'heatmap',
    'source': 'quakes',
    maxZoom: 15,
    'paint': {
      // Heatmap weight based on frequency and property magnitude
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'mag'],
        0,
        0,
        6,
        1
      ],
      // Heatmap color weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      'heatmap-intensity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        1,
        9,
        3
      ],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
        'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(236,222,239,0)',
        0.2,
        'rgb(208,209,230)',
        0.4,
        'rgb(166,189,219)',
        0.6,
        'rgb(103,169,207)',
        0.8,
        'rgb(28,144,153)'
      ],
      // Adjust the heatmap radius by zoom level
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        2,
        9,
        20
      ],
      // Transition from heatmap to circle layer by zoom level
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        7,
        1,
        9,
        0
      ]
    }
  },
    'waterway-label'
  );

  map.addLayer(
    {
      'id': 'quakes-point',
      'type': 'circle',
      'source': 'quakes',
      'minzoom': 7,
      'paint': {
        // Size circle radius by earthquake magnitude and zoom level
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7,
          ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
          16,
          ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
        ],
        // Color circle by earthquake magnitude
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'mag'],
          1,
          'rgb(236,222,239)',
          2,
          'rgb(208,209,230)',
          3,
          'rgb(166,189,219)',
          4,
          'rgb(103,169,207)',
          5,
          'rgb(28,144,153)',
          6,
          'rgb(1,108,89)'
        ],
        // 'circle-stroke-color': 'white',
        // 'circle-stroke-width': 1,
        // Transition from heatmap to circle layer by zoom level
        // 'circle-opacity': [
        //   'interpolate',
        //   ['linear'],
        //   ['zoom'],
        //   7,
        //   0,
        //   8,
        //   1
        // ]
      }
    },
    'waterway-label'
  );
});

/*****Blue Color for density *************************\
//     paint : {
//       'heatmap-weight' : {
//         property: 'mag',
//         type: 'exponential',
//         stops: [
//           [1,0],
//           [9,0]
//         ]
//       },
//       'heatmap-intensity': {
//         stops: [
//           [11, 1],
//           [15, 3]
//         ]
//       },
//       'heatmap-color': [
//         'interpolate',
//         ['linear'],
//         ['heatmap-density'],
//         0, 'rgba(236,222,239,0)',
//         0.2, 'rgb(208,209,230)',
//         0.4, 'rgb(166,189,219)',
//         0.6, 'rgb(103,169,207)',
//         0.8, 'rgb(28,144,153)',       
//       ],
//       'heatmap-radius': {
//         stops: [
//           [11, 15],
//           [15, 20]
//         ]
//       },
//       'heatmap-opacity': {
//         default: 1,
//         stops: [
//           [14, 1],
//           [15, 0]
//         ]
//       },
//     }
//   });
//   // console.log(waterway-label)
//   //adding circle layer
//   map.addLayer({
//     id: 'quakes-point',
//     type: 'circle',
//     source: 'quakes',
//     minzoom: 14,
//     paint: {
//       // increase the radius of the circle as the zoom level and dbh value increases
//       'circle-radius': {
//         property: 'mag',
//         type: 'exponential',
//         stops: [
//           [{ zoom: 15, value: 1 }, 5],
//           [{ zoom: 15, value: 62 }, 10],
//           [{ zoom: 22, value: 1 }, 20],
//           [{ zoom: 22, value: 62 }, 50],
//         ]
//       },
//       'circle-color': {
//         property: 'mag',
//         type: 'exponential',
//         stops: [
//           [0, 'rgba(236,222,239,0)'],
//           [1, 'rgb(236,222,239)'],
//           [2, 'rgb(208,209,230)'],
//           [3, 'rgb(166,189,219)'],
//           [4, 'rgb(103,169,207)'],
//           [5, 'rgb(28,144,153)'],
//           [6, 'rgb(1,108,89)']
//         ]
//       },
//       'circle-stroke-color': 'white',
//       'circle-stroke-width': 1,
//       'circle-opacity': {
//         stops: [
//           [14, 0],
//           [15, 1]
//         ]
//       }
//     }
//   }, 'waterway-label');
// });
/*****RED Color for Density************************** */


// ['heatmap-density'],
// 0,
// 'rgba(33,102,172,0)',
// 0.2,
// 'rgb(103,169,207)',
// 0.4,
// 'rgb(209,229,240)',
// 0.6,
// 'rgb(253,219,199)',
// 0.8,
// 'rgb(239,138,98)',
// 1,
// 'rgb(178,24,43)'
// ],

// 'circle-color': [
//   'interpolate',
//   ['linear'],
//   ['get', 'mag'],
//   1,
//   'rgba(33,102,172,0)',
//   2,
//   'rgb(103,169,207)',
//   3,
//   'rgb(209,229,240)',
//   4,
//   'rgb(253,219,199)',
//   5,
//   'rgb(239,138,98)',
//   6,
//   'rgb(178,24,43)'
// ],

