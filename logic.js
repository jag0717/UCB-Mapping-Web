// Store our API endpoint inside queryUrl
 var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
 // "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
 // "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Create a legend to display information about our map
var legend = L.control({ position: "bottomright" });

// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      grades = [0,1,2,3,4,5];
      labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++)
      {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      console.log('div' + div);
      return div;
};

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);
  createMarkers(data.features);
});

function getColor(m)
{
  d = Math.ceil(m);   
 switch (Math.ceil(d)) {
    case 1:
      return '#55ff33'; 
    case 2:
      return '#c1ff33'; 
    case 3:
      return '#ffff33'; 
    case 4:
      return '#ffd133'; 
    case 5:
      return '#FF4500'; 
    default:
      return 'red';
  }  
}

function createMarkers(earthquakeData)
{
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
       //  console.log("Magnitude:" + feature.properties.mag + "type: "+ feature.properties.magType ); 
          return L.circleMarker(latlng, {
            radius: feature.properties.mag * 3,
            fillColor: getColor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8}).bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "<br>" + "Magnitude: "+ feature.properties.mag + "</p>");
      }
    });

    createMap(earthquakes); 
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
 
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/jagatha/cjf67rrnh2x9y2rn6xcs9dq30/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiamFnYXRoYSIsImEiOiJjamV2b3E5NHQxeW1tMnFwOW1ka21jaXN4In0." +
    "8PXpi2JOIpv0u9cSjZxDVg");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 4.4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Add the info legend to the map
  legend.addTo(myMap);
}
