
// lat long zoom level
let map = L.map('map').setView([30.1158, 78.2853],13);
let routingControl;
let iconPath;
let distance;
let markers={};
let riderCoordinates = [30.104867698463696, 78.29907060455753];
let busLottie = L.divIcon({
    html: '<div id="lottie"></div>',
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    className: '' ,
});
let homeIcon = L.icon({
    iconUrl: './home.png', 
    iconSize: [40, 40], 
    iconAnchor: [20, 40], 
});


function initLottie() {
    let lottieContainer = document.getElementById('lottie');
    if (lottieContainer) {
        lottie.loadAnimation({
            container: lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: './rickshaw.json'
        });
    }
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 16,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


let testMode = false; 
let simulatedCoordinates = [30.1158, 78.2853]; 

if (testMode) {
    setInterval(simulateLocationChange, 2000);
}
else{
navigator.geolocation.getCurrentPosition(onLocationSuccess,onLocationError,{
    enableHighAccuracy: true,
    timeout: 10000, 
    maximumAge: 0 
});

navigator.geolocation.watchPosition(onLocationChangeSuccess,onLocationChangeError,{
    enableHighAccuracy: true,
    timeout: 10000, 
    maximumAge: 0  
})
}
function simulateLocationChange() {
    simulatedCoordinates[0] += 0.0001; 
    simulatedCoordinates[1] += 0.0001; 

    onLocationChangeSuccess({
        coords: {
            latitude: simulatedCoordinates[0],
            longitude: simulatedCoordinates[1]
        }
    });
}

function onLocationChangeSuccess(position){
    const userCoordinates=[position.coords.latitude,position.coords.longitude];
    drawRoute(userCoordinates,riderCoordinates);
    distance=turf.distance(userCoordinates,riderCoordinates,{units: 'kilometers'});
    distance = distance.toFixed(2);
    initLottie();
}

function onLocationChangeError(error){
    alert('Unable to retriev your location:'+error.message)
}
function onLocationSuccess(position){
    const userCoordinates=[position.coords.latitude,position.coords.longitude];  
    const bounds = L.latLngBounds([userCoordinates, riderCoordinates]);
    map.fitBounds(bounds);
    drawRoute(userCoordinates,riderCoordinates);
    distance=turf.distance(userCoordinates,riderCoordinates,{units: 'kilometers'});
    distance = distance.toFixed(2);
    initLottie();
}

function onLocationError(error){
    alert('Unable to retrieve your location'+error.message)
}



function drawRoute(userCoordinates,riderCoordinates){
    if (routingControl) {
        routingControl.setWaypoints([
            L.latLng(userCoordinates),
            L.latLng(riderCoordinates)
        ]);
    } else {
    routingControl=L.Routing.control({
        waypoints:[
            L.latLng(userCoordinates),
            L.latLng(riderCoordinates)
        ],
        routeWhileDragging: true,

        lineOptions:{
            styles:[{color:'purple',weight: 4}]
        },
        show: false,
        createMarker: function (i, waypoint, n) {

            const markerKey = i === 1 ? 'user' : 'rider'; 

            if (markers[markerKey] && markerKey==0) {               
                markers[markerKey].setLatLng(waypoint.latLng); 
                
                const popupContent = i === 1 ? "User Location" : ("Rider is " + distance + " km away");
                markers[markerKey].setPopupContent(popupContent); 
               return markers[markerKey]
            } else {
                markers[markerKey] = L.marker(waypoint.latLng, {
                    draggable: false,
                    bounceOnAdd: false,
                    icon: i === 1 ? homeIcon : busLottie
                }).addTo(map); 
        
                const popupContent = i === 1 ? "User Location" : ("Rider is " + distance + " km away");
                if(markerKey=='rider'){
                markers[markerKey].bindPopup(popupContent,{
                    autoClose: false,  
                    closeOnClick: false  
                }).openPopup();
            }
                return markers[markerKey];
            }
            }
    
    }).addTo(map);
}
}