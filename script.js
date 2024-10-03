
// lat long zoom level
let map = L.map('map').setView([30.1158, 78.2853],13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 16,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



navigator.geolocation.getCurrentPosition(onLocationSuccess,onLocationError,{
    enableHighAccuracy: true,
    timeout: 10000, 
    maximumAge: 0 
});

function onLocationSuccess(position){
    const userCoordinates=[position.coords.latitude,position.coords.longitude];
    console.log(userCoordinates);
    
    L.marker(userCoordinates).addTo(map).bindPopup('You are here').openPopup();

    let riderCoordinates = [30.104867698463696, 78.29907060455753];

    L.marker(riderCoordinates).addTo(map).bindPopup('Rider is here..').openPopup();
    const bounds = L.latLngBounds([userCoordinates, riderCoordinates]);
    console.log(bounds);
    map.fitBounds(bounds);
    drawRoute(userCoordinates,riderCoordinates);
}

function onLocationError(error){
    alert('Unable to retrieve your location'+error.message)
}

// function drawRoute(userCoordinates,riderCoordinates){
// const latlngs=[userCoordinates,riderCoordinates];
// const polyline = L.polyline(latlngs,{color:'red'}).addTo(map);
// }

function drawRoute(userCoordinates,riderCoordinates){
    L.Routing.control({
        waypoints:[
            L.latLng(userCoordinates),
            L.latLng(riderCoordinates)
        ],
        routeWhileDragging: true,
        lineOptions:{
            styles:[{color:'purple',weight: 4}]
        }
    }).addTo(map);
}