var map;
var markers = [];
var infoWindow;


function initMap() {
    var losAngeles = {lat: 34.063380, lng: -118.358080};
    map = new google.maps.Map(document.getElementById('map'), {
      center: losAngeles,
      zoom: 11,
      mapTypeId: 'roadmap'
    });
    infoWindow = new google.maps.InfoWindow();
    
    searchStores();
}

function onClickListener(){
  var selectElement=document.querySelectorAll(".location-list");
  selectElement.forEach(function(element,index){
    element.addEventListener("click", function(){
      var elementIndex= index++;
      google.maps.event.trigger(markers[elementIndex], 'click');
    });
  })
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function searchStores() {
  var foundStores=[];
  var val=document.getElementById("zip-input").value;
  if(val){
    for(var store of stores){
      var postal=store["address"]["postalCode"];
      var zip=postal.substring(0,5);
      console.log(zip);
        if(zip === val.toString()){
          foundStores.push(store);
        }    
      }
  }
  else{
    foundStores=stores;
  }
  clearLocations();
  showStore(foundStores);
  showMarker(foundStores);
  onClickListener();
}

function showStore(stores) {
  var details = '';  
  for(var [index,store] of stores.entries()){
    var name = store["name"];
    var address= store["addressLines"][0];
    var phoneNumber=store["phoneNumber"];
    details +=  `
    <div class="location-list">
      <div class="store-info-container">
            <div class="address">
                <span>${name}</</span>
                <span>${address}</span>
            </div>
            <div class="body-contact">
              ${phoneNumber}
            </div>
            <div class="body-number">
              <div class="store-number">
                ${++index}
              </div>
               

            </div> 
      </div>               
    </div>
    `
    document.querySelector(".store-list").innerHTML=details;
  }
}

function showMarker(stores){
  var bounds = new google.maps.LatLngBounds();
  for(var [index,store] of stores.entries()){
    var latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]);
    var name=store["name"];
    var address=store["addressLines"][0];
    var openStatusText=store["openStatusText"];
    var contact=store["phoneNumber"];
    bounds.extend(latlng);
    createMarker(latlng,name,openStatusText,address,contact,++index);
  }
   map.fitBounds(bounds);
}

function createMarker(latlng, name, openStatusText, address,contact,index) {
  var html = `<div class="window">
                <div class="name"> ${name} </div>
                <div class="status">${openStatusText}</div>
                <div class="address"><i class="fas fa-location-arrow"></i>${address} </div>
                <div class="contact"><i class="fas fa-phone"></i>${contact}</div>
              </div>
                `
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label:index.toString()
    });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
