var showSidebar = false;
var map;
var downtownLayer;
var midtownLayer;
var prevZoom;
  
var regionLayers = new Array
  (
  'http://maps.google.com/maps/ms?authuser=0&vps=6&hl=en&ie=UTF8&msa=0&output=kml&msid=213168608483106049086.0004ab220bd3c2dc132cb',
  'http://maps.google.com/maps/ms?authuser=0&vps=13&hl=en&ie=UTF8&msa=0&output=kml&msid=213168608483106049086.0004ab2284bddc1f7a01d',
  'http://maps.google.com/maps/ms?authuser=0&vps=20&hl=en&ie=UTF8&msa=0&output=kml&msid=213168608483106049086.0004ab22f63d3070eb0ee'
  );
  
function initialize() {
  var layer = new Array();
  var latlng = new google.maps.LatLng(39.050461,-94.597733);
  var myScaleControlOptions = 
    {
    position: google.maps.ControlPosition.LEFT_CENTER
    }
  var myOptions = {
    zoom: 12,
    maxZoom: 19,
    minZoom: 10,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    panControl: false,
    streetViewControl: false,
    zoomControlOptions: myScaleControlOptions,
    disableDoubleClickZoom: true
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
  for( region in regionLayers )
    {
    layer[ region ] = new google.maps.KmlLayer
      (
      regionLayers[ region ],
      { suppressInfoWindows: true, preserveViewport: true }
      );
    layer[ region ].setMap( map );
    google.maps.event.addListener( layer[ region ], 'click', function( event )
      {
      handle_layer_click( this, event );
      } );
    }
}
  
function show_sidebar()
  {
  sidebarElem = document.getElementById('sidebar');
  sidebarElem.style.right = '0em';
  showSidebar = true;
  }

function hide_sidebar()
  {
  sidebarElem = document.getElementById('sidebar');
  sidebarElem.style.right = '-18em';
  showSidebar = false;
  }

function handle_layer_click( layer, kmlEvent )
  {
  var newZoom;
  
  regionElem = document.getElementById('region');

  /* If this is a new region clicked, zoom to the clicked region */
  if( showSidebar == false
   || regionElem.innerHTML != kmlEvent.featureData.name )
    {
    prevZoom = map.getZoom();
    var bounds = layer.getDefaultViewport();
    //map.panTo( bounds.getCenter() );
    map.fitBounds( bounds );
    google.maps.event.addListenerOnce( map, 'idle', function() {
      //map.fitBounds( bounds );
    } );

    /* Determine the new zoom level, set the sidebar title */
    newZoom = map.getZoom();
    document.getElementById('region').innerHTML = kmlEvent.featureData.name;
    
    /* If zoom occurred, wait until zoom is finished to slide in sidebar */
    if( prevZoom != newZoom )
      {
      google.maps.event.addListenerOnce( map, 'idle', show_sidebar );
      }
    else
      {
      show_sidebar();
      }
    }
  /* Same region clicked, hide sidebar and return zoom level */
  else if( regionElem.innerHTML == kmlEvent.featureData.name )
    {
    newZoom = map.getZoom();
    if( prevZoom != newZoom )
      {
      map.setZoom( prevZoom );
      google.maps.event.addListenerOnce( map, 'idle', hide_sidebar ); 
      }
    else
      {
      hide_sidebar();
      }
    }
  }

function back()
  {
  map.setZoom( prevZoom );
  sidebarElem.style.right = '-18em';
  showSidebar = false;
  }
