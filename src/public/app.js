window.document.onLoad = function() {
    const options = {
        zoom: 5,
        center: new google.maps.LatLng(12.9716, 77.5946), // centered US
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: false
    };

    const map = new google.maps.Map(document.getElementById('map_canvas'), options);
    console.log('Test');
}
