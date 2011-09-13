function Location( entry )
    {
    var self = this;
    this.name = $(entry).find('name').text();
    this.street_address = $(entry).find('street_address').text();
    this.city = $(entry).find('city').text();
    this.state = $(entry).find('state').text();
    this.zip = $(entry).find('zip').text();
    
    this.InfoWindow = new google.maps.InfoWindow( { content: this.name } );
  
    geoCode.geocode( { address: this.street_address + ', ' + this.city + ', ' + this.zip }, function( response, status ) {
        if( status == google.maps.GeocoderStatus.OK )
            {
            self.marker = new google.maps.Marker( { position: response[ 0 ].geometry.location, map: map, title: self.name } );
            google.maps.event.addListener( self.marker, 'click', function( event ) {
                self.InfoWindow.open( map, self.marker );
                } );
            }
        } );
    }


Location.prototype.remove = function()
    {
    this.marker.setMap( null );
    }
    
    
Location.prototype.show = function()
    {
    map.setCenter( this.marker.getPosition() );
    this.InfoWindow.open( map, this.marker );
    }