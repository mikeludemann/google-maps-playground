var map, infoWindow, marker;

function initMap() {

  var cologne = new google.maps.LatLng(50.93333, 6.95);

  map = new google.maps.Map(document.getElementById('map'), {

    scaleControl: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    mapTypeId: 'roadmap',
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.LEFT_TOP
    },
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    overviewMapControl: true,
    panControl: false,
    rotateControl: true,
    fullscreenControl: true,
    center: cologne,
    zoom: 5

  });

  // var clickHandler = new ClickEventHandler(map, origin);

  infoWindow = new google.maps.InfoWindow({
    maxWidth: 400,
    maxHeight: 400
  });
  
  infoWindow.setContent(createInfoWindowContent(cologne, map.getZoom()));
  infoWindow.setPosition(cologne);
  //infoWindow.open(map);

  /*
  map.addListener('zoom_changed', function() {

    infoWindow.setContent(createInfoWindowContent(cologne, map.getZoom()));
    infoWindow.open(map);

  });
  */

  function createInfoWindowContent(latLng, zoom) {

    var scale = 1 << zoom;

    return [
      'Cologne, Germany',
      'LatLng: ' + latLng,
      'Zoom level: ' + zoom
    ].join('<br>');

  }

  marker = new google.maps.Marker({
    map: map,
    position: cologne
  });

  marker.addListener('click', function() {

    map.setZoom(17);
    map.setCenter(marker.getPosition());
    
    infoWindow.open(map, marker);

  });

  /*
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(position) {

      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);

    }, function() {

    handleLocationError(true, infoWindow, map.getCenter());

    });

      } else {

        handleLocationError(false, infoWindow, map.getCenter());

      }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'The Geolocation service failed.' : 'Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
  */

  var ClickEventHandler = function(map, origin) {

    this.origin = origin;
    this.map = map;
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);
    this.placesService = new google.maps.places.PlacesService(map);
    this.infowindow = new google.maps.InfoWindow;
    this.infowindowContent = document.getElementById('infowindow-content');
    this.infowindow.setContent(this.infowindowContent);

    this.map.addListener('click', this.handleClick.bind(this));

  };

  ClickEventHandler.prototype.handleClick = function(event) {

    console.log('You clicked on: ' + event.latLng);

    if (event.placeId) {

      console.log('You clicked on place:' + event.placeId);

      event.stop();
      this.calculateAndDisplayRoute(event.placeId);
      this.getPlaceInformation(event.placeId);

    }

  };

  ClickEventHandler.prototype.calculateAndDisplayRoute = function(placeId) {

    var me = this;

    this.directionsService.route({
      origin: this.origin,
      destination: {placeId: placeId},
      travelMode: 'WALKING'
    }, function(response, status) {

      if (status === 'OK') {

        me.directionsDisplay.setDirections(response);

      } else {

        window.alert('Directions request failed due to ' + status);

      }

    });

  };

  ClickEventHandler.prototype.getPlaceInformation = function(placeId) {

    var me = this;

    this.placesService.getDetails({placeId: placeId}, function(place, status) {

      if (status === 'OK') {

        me.infowindow.close();
        me.infowindow.setPosition(place.geometry.location);
        me.infowindowContent.children['place-icon'].src = place.icon;
        me.infowindowContent.children['place-name'].textContent = place.name;
        me.infowindowContent.children['place-id'].textContent = place.place_id;
        me.infowindowContent.children['place-address'].textContent = place.formatted_address;
        me.infowindow.open(me.map);

      }
      
    });
    
  };

}
