$(document).ready(function() {
  onReady();
});

function onReady() {
    const options = {
       zoom: 10,
       center: new google.maps.LatLng(12.9716, 77.5946),
       mapTypeId: google.maps.MapTypeId.TERRAIN,
       mapTypeControl: false
   };

   // init map
   const map = new google.maps.Map(document.getElementById('map_canvas'), options);
   const response = $.get('http://localhost:3000/api/ride/findAll', function(data) {
      data.rides.forEach((ride, index)=> {
          const marker = new google.maps.Marker({
              position: new google.maps.LatLng(ride.lat, ride.lon),
              map: map
          });

          const infoWindow = new google.maps.InfoWindow({
            content: JSON.stringify({'Vehicle No: ': index + 1, 'Color': ride.color, 'Available': ride.is_available})
          });

          marker.addListener('click', function() {
            infoWindow.open(map, marker);
          });
      });
   });
}
