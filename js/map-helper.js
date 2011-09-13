var markers = Array();
var prevZoom;
var showSidebar = false;
var selectedMarker = -1;

var map;
var geoCode;

var regionLayers = new Array
  (
  'http://maps.google.com/maps/ms?authuser=0&vps=6&hl=en&ie=UTF8&msa=0&output=kml&msid=213168608483106049086.0004ab220bd3c2dc132cb',
  'http://maps.google.com/maps/ms?authuser=0&vps=13&hl=en&ie=UTF8&msa=0&output=kml&msid=213168608483106049086.0004ab2284bddc1f7a01d',
  'http://maps.google.com/maps/ms?authuser=0&vps=20&hl=en&ie=UTF8&msa=0&output=kml&msid=213168608483106049086.0004ab22f63d3070eb0ee'
  );
    

function fill_data( data )
    {
    /* Remove any markers from a previous region */
    remove_markers();

    var address;
    var entries = $(data).find('entry');
    if( entries.length > 0 )
        {
        $('.markers').html( '<ul id="places"></ul>' );
        entries.each( function() {
            var marker = new Location( this )
            markers.push( marker );
            html  = '<li><h3><a href="#" onClick="marker_show(' + (markers.length - 1 ) + '); return false;">' + marker.name + '</a></h3>' + '\n'; 
            html += marker.street_address + '<br/>' + '\n';
            html += marker.city + ', ' + marker.state + ', ' + marker.zip + '\n';
            html += '</li>';
            $('ul#places').append( html );
            } );
        }
    else
        {
        $('.markers').html('No places found.');
        }
    }


function go_back()
    {
    sidebar_hide();
    
    var newZoom = map.getZoom();
    if( prevZoom != newZoom )
        {
        map.setZoom( prevZoom );
        }
    }
  

function handle_layer_click( layer, kmlEvent )
    {
    var newZoom;

    regionElem = document.getElementById('region');

    /* If this is a new region clicked, zoom to the clicked region */
    if( showSidebar == false
     || regionElem.innerHTML != kmlEvent.featureData.name )
        {
        $.post('/~jdlayman/love-kc/ajax/get_places.php', { id: kmlEvent.featureData.id }, function(data) { fill_data(data) });

        prevZoom = map.getZoom();
        var bounds = layer.getDefaultViewport();
        map.fitBounds( bounds );

        /* Determine the new zoom level, set the sidebar title */
        newZoom = map.getZoom();
        document.getElementById('region').innerHTML = kmlEvent.featureData.name;
    
        /* If zoom occurred, wait until zoom is finished to slide in sidebar */
        if( prevZoom != newZoom )
            {
            google.maps.event.addListenerOnce( map, 'idle', sidebar_show );
            }
        else
            {
            sidebar_show();
            }
        }
    /* Same region clicked, hide sidebar and return zoom level */
    else if( regionElem.innerHTML == kmlEvent.featureData.name )
        {
        go_back();
        }
    }


function initialize()
    {
    $('.markers').ajaxError( function(event, request, settings) { alert("ajax error" + settings.url); });
    var layer = new Array();
    var latlng = new google.maps.LatLng(39.050461,-94.597733);
    var myScaleControlOptions = 
        {
        position: google.maps.ControlPosition.LEFT_CENTER
        }
    var myOptions = 
        {
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
    geoCode = new google.maps.Geocoder();
  
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


function marker_show(marker)
    {
    for( i=0; i < markers.length; i++ )
        {
        if( i == marker )
            {
            markers[ i ].show();
            }
        else
            {
            markers[ i ].InfoWindow.close();
            }
        }
    }
    

function remove_markers()
    {
    var marker;
  
    while( markers.length )
        {
        marker = markers.pop();
        marker.remove();
        }
    }


function sidebar_hide()
    {
    $('#sidebar').css( 'right', '-18em' );
    showSidebar = false;
    remove_markers();
    }
    

function sidebar_show()
    {
    $('#sidebar').css( 'right', '0em' );
    showSidebar = true;
    }
