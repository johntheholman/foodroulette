class MapData {
    
    constructor(longitude, latitude) {
        /** The constructor for the MapData class takes in the Longitude and Latitude of the given user from the location.js file. We then set those as variables in the constructor so that any of the methods below may access this information. 
        * @constructor 
        */
        this.longitude = longitude;
        this.latitude = latitude;

        /** Binding needed for accessing this.longitude/this.langitude in displayMap inner function
         */
        // this.displayMap = this.displayMap.bind(this);
    }

    /** The displayMap method makes the call out to the API and places the result into the DOM element with a class of 'map'.
     * It calls the specific coordinates for the restaurant coordinates that are returned from the Yelp API and then pass those in as the center point of the map.
    * There is also a variable to be able to set the zoom of the map (this is currently hardcoded at the default value.
    */
    displayMap() {
        mapboxgl.accessToken = mapCredentials;
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/johntheholman/cjrhga5256ww32snyx4x8vwm3',
            center: [this.latitude,this.longitude],
            zoom: 13.6
        });
        var geojson = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [this.latitude, this.longitude]
                },
            }]
        };
        /** Add the markers to the actual map */
        geojson.features.forEach(function(marker) {

        /** Create an HTML element for each marker */
        var el = document.createElement('div');
        el.className = 'marker';

        /** Make the final marker and add it to the center point of the map */
        new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
        });
    }
}