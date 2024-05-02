let map;
let marker;
let infoWindow;


async function initMap() {
  // Request needed libraries.
  //@ts-ignore
  const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
    google.maps.importLibrary("marker"),
    google.maps.importLibrary("places"),
  ]);

  // Initialize the map.
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.4380986, lng: -3.8443472 },
    zoom: 15,
    mapId: "4504f8b37365c3d0",
    mapTypeControl: false,
  });



  //@ts-ignore
  const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();

  //@ts-ignore
  placeAutocomplete.id = "place-autocomplete-input";

  const card = document.getElementById("place-autocomplete-card");

  //@ts-ignore
  card.appendChild(placeAutocomplete);
  // Create the marker and infowindow
  marker = new google.maps.marker.AdvancedMarkerElement({
    map,
  });
  infoWindow = new google.maps.InfoWindow({});

  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          new google.maps.Marker({
            position: pos,
            map,
            zoom: 8,
            title: "Location found.",
          });
          console.log(position.coords + " " + position.coords.latitude + " " + position.coords.longitude)
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  // Add the gmp-placeselect listener, and display the results on the map.
  //@ts-ignore
  placeAutocomplete.addEventListener("gmp-placeselect", async ({ place }) => {
    await place.fetchFields({
      fields: ["displayName", "formattedAddress", "location"],
    });
    // If the place has a geometry, then present it on a map.
    if (place.viewport) {
      map.fitBounds(place.viewport);
    } else {
      map.setCenter(place.location);
      map.setZoom(17);
    }

    let content =
      '<div id="infowindow-content">' +
      '<span id="place-displayname" class="title">' +
      place.displayName +
      "</span><br />" +
      '<span id="place-address">' +
      place.formattedAddress +
      "</span>" +
      "</div>";
    console.log(place.formattedAddress + " " + place.location.lat() + " " + place.location.lng());
    updateInfoWindow(content, place.location);
    marker.position = place.location;
  });
}

// Helper function to create an info window.
function updateInfoWindow(content, center) {
  infoWindow.setContent(content);
  infoWindow.setPosition(center);
  infoWindow.open({
    map,
    anchor: marker,
    shouldFocus: false,
  });
}

initMap();


const hoy = new Date(Date.now());

console.log(hoy.toISOString());