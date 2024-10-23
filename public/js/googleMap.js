function initMap(googleMapsApiKey, stores) {
  // Center map on Israel
  var israelCenter = { lat: 31.0461, lng: 34.8516 };

  // Create the map centered on Israel
  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: israelCenter
  });

  // Add markers for each store
  stores.forEach(function(store) {
      var marker = new google.maps.Marker({
          position: { lat: store.coordinates.lat, lng: store.coordinates.lng },
          map: map,
          title: store.name
      });

      var infoWindow = new google.maps.InfoWindow({
          content: `<h5>${store.name}</h5><p>${store.address}</p>`
      });

      marker.addListener('click', function() {
          infoWindow.open(map, marker);
      });
  });
}