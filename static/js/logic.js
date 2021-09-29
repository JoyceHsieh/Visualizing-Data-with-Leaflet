var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var platesjson = "static/js/PB2002_plates.json";
// var plateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  

  createFeatures(data.features);
});



// Create an empty list to hold earthquake circle data
var earthquakeCircles = [];

// Define color function to change circle color
function getColor(d) {
    if (d=="0-1"|d < 1) return "rgba(183,243,77)";
    else if (d=="1-2"|d < 2) return "rgba(225,243,77)";
    else if (d=="2-3"|d < 3) return "rgba(243,219,77)";
    else if (d=="3-4"|d < 4) return "rgba(243,186,77)";
    else if (d=="4-5"|d < 5) return "rgb(240,167,107)";
    else return "rgb(240,107,107)"  }

// Create a function to covert timestamp to date
function covertTimestamp(time) {
    var date = new Date(time).toLocaleDateString("en-US");
    return date;
  }

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(mag) {
    return mag * 20000;
  }
  
  
  function createFeatures(earthquakeData) {
    console.log(earthquakeData);
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    for (var i = 0; i < earthquakeData.length; i++) {
      var location = [
        earthquakeData[i].geometry.coordinates[1],
        earthquakeData[i].geometry.coordinates[0],
      ];
  
      earthquakeCircles.push(
        L.circle(location, {
          stroke: false,
          fillOpacity: 4,
          color: "black",
          weight: 3,
          fillColor: getColor(earthquakeData[i].properties.mag),
          radius: markerSize(earthquakeData[i].properties.mag),
        }).bindPopup(
          "<h1>" +
            earthquakeData[i].properties.place +
            "</h1>" +
            "<hr>" +
            "<h3>Magnitude: " +
            earthquakeData[i].properties.mag +
            "</h3>" +
            "<h3>Date: " +
            covertTimestamp(earthquakeData[i].properties.time) +
            "</h3>"
        )
      );
    }
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakeCircles);
  }
  


  function createMap(earthquakeCircles) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
    });


    var earthquakeLayer = L.layerGroup(earthquakeCircles);
    var platesLayer = L.layerGroup();

    // Add plates data to plates layer
  d3.json(platesjson).then( function (Pdata) {
      console.log(Pdata);
    L.geoJSON(Pdata, {
      style: {
        color: "orange",
        fillOpacity: 0,
      }
    }).addTo(platesLayer);

  });

  

    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Satellite": googleSat,
      "Topographic Map": topo
    };
  
   

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakeLayer,
      Plates: platesLayer,
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [44.9778, -93.265],
        zoom: 5,
        layers: [street, earthquakeLayer],
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  



  // Add a legend
//   var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function () {
//     var div = L.DomUtil.create("div", "info legend");
//     // var limits = geojson.options.limits;
//     // var colors = geojson.options.colors;
//     var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

//     // labels.forEach(function(label){
//     //     div.innerHTML =
//     //       '<i style="background:' +
//     //       getColor(label) +
//     //       '"></i> ' +
//     //       label ;
//     // })


//     for (var i = 0; i < labels.length; i++) {
//         div.innerHTML +=
//           '<i style="background:' +
//           getColor(labels[i]) +
//           '"></i> ' +
//           labels[i] +
//           (labels[i] ? "<br>" : "");
//       }
//       return div;
//   };
//   legend.addTo(myMap);




}
  
