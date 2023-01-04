let drawingManager;
let lastShape;
let map;
let shift_draw = false
const degrees_to_radians = 57.2958
const r = 3963.0 // radius of the earth in statute miles
let bounds
let center
let ne
let lat1
let lon1
let lat2
let lon2
let distnce

export default {
  initialize(coord, lat, lng, rad) {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: new google.maps.LatLng(lat, lng),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      zoomControl: true
    });
    let defaultCircle = []
    let cityCircle = []

    if (coord === "") {
      defaultCircle = {
        strokeWeight: 1,
        strokeOpacity: 1,
        fillOpacity: 0.2,
        editable: true,
        clickable: true,
        strokeColor: '#3399FF',
        fillColor: '#3399FF',
        map,
        center: {lat: lat, lng: lng},
        radius: rad * 1000, //10 * 1000,
      }
      
      cityCircle = new google.maps.Circle(defaultCircle);
    } else {
      defaultCircle = {
        paths: coord,
        strokeWeight: 1,
        strokeOpacity: 1,
        fillOpacity: 0.2,
        editable: true,
        clickable: true,
        strokeColor: '#3399FF',
        fillColor: '#3399FF',
      }

      cityCircle = new google.maps.Polygon(defaultCircle);
      cityCircle.setMap(map);
    }

    let shapeOptions = {
      strokeWeight: 1,
      strokeOpacity: 1,
      fillOpacity: 0.2,
      editable: true,
      clickable: true,
      strokeColor: '#3399FF',
      fillColor: '#3399FF'
    };

    let m1 = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: map,
      title: 'Aloha!'
    });

    drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControlOptions: {
        drawingModes: ['circle', 'polygon']
      },
      rectangleOptions: shapeOptions,
      polygonOptions: shapeOptions,
      circleOptions: shapeOptions,
      map: map,
      markerOptions: {
        icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      },
    });

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {    
      if (lastShape != undefined) {
        lastShape.setMap(null);
      }

      if (shift_draw == false) {
        cityCircle.setMap(null)
        drawingManager.setDrawingMode(null);
      }

      lastShape = e.overlay;
      lastShape.type = e.type;
      
      if (lastShape.type == google.maps.drawing.OverlayType.CIRCLE) {      
        let lastBounds = lastShape.getBounds();
        bounds = lastShape.getBounds();    

        calculate(lastShape)    
        console.log('new_circle')

        if (lastBounds.contains(m1.getPosition())) {
          console.log('Inside bounds')
        } else {
          console.log('Outside bounds')
        }
      } else {
        google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
          bounds = polygon.getPath().getArray().map(coord => {
            return {
              lat: coord.lat(),
              lng: coord.lng()
            }
          });
          
          $('#coord').val(JSON.stringify(bounds));
          $('#center-lat').val(lat);
          $('#center-lng').val(lng);
          console.log('bounds ', bounds);
          console.log('lat ', lat);      
          console.log('lng ', lng);      
        });        
      }

      addListener(lastShape)
    });

    $(document).bind('keydown', function(e) {
      if (e.keyCode == 16 && shift_draw == false) {
        map.setOptions({
          draggable: false,
          disableDoubleClickZoom: true
        });
        shift_draw = true;
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
      }
    });

    $(document).bind('keyup', function(e) {
      if (e.keyCode == 16) {
        map.setOptions({
          draggable: true,
          disableDoubleClickZoom: true
        });
        shift_draw = false
        drawingManager.setDrawingMode(null);
      }
    });

    $("#clear-map").bind("click",function(){
      if (lastShape != undefined) {
        lastShape.setMap(null)
        lastShape = undefined
      }
      cityCircle.setMap(null)
      // cityCircle = new google.maps.Circle(defaultCircle);
      
      addListener(cityCircle)
      $('#coord').val('');
      $('#center-lat').val('');
      $('#center-lng').val('');
      $('#center-radius').val('');

      console.log('clear')
    }); 
    
    addListener(cityCircle)
  }
}

const calculate = (data) => {
  bounds = data.getBounds();
  center = bounds.getCenter();
  ne = bounds.getNorthEast();
  lat1 = center.lat() / degrees_to_radians; 
  lon1 = center.lng() / degrees_to_radians;
  lat2 = ne.lat() / degrees_to_radians;
  lon2 = ne.lng() / degrees_to_radians;

  // distance = circle radius from center to Northeast corner of bounds
  distnce = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));          
  $('#center-lat').val(center.lat());
  $('#center-lng').val(center.lng());
  $('#center-radius').val(distnce);

  console.log('lat ', center.lat());      
  console.log('lng ', center.lng());      
  console.log('radius ', distnce);      
}

const addListener = (data) => {
  google.maps.event.addListener(data, 'radius_changed', function() {
    calculate(data)
    console.log('center changed',);  
  });  

  google.maps.event.addListener(data, 'center_changed', function() {
    calculate(data)
    console.log('radius changed');  
  });       
}