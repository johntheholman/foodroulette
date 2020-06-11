/**
 * class representing the Location
 * **/

class LocDataTemplate {
/**
 * @constructor
 * stores the values that will later be used in the functions below
 * **/
    constructor() {
        this.ip = 0;
        this.latitude = 0;
        this.longitude = 0;
        this.zip = 0;
        this.city = '';
        this.getLocation();
        this.addEventHandlers = this.addEventHandlers.bind(this);
        this.getIp = this.getIp.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.onResponseSuccess = this.onResponseSuccess.bind(this);
        this.displayWeather = this.displayWeather.bind(this);
    }
/**
 * addEventHandlers
 * calls the function getLocation when the button with id of accept is triggered
 * **/
    addEventHandlers() {
        $('#accept').click(this.removeHomePage);
    }

    removeHomePage() {
        history.pushState({page: '?page=2'}, document.title, "?page=2");
        $('.landing_page').hide();
        $('.display_category_options_page').removeClass('hide');
    }
/**
 * getIP
 * Get the IP address of the user once they load the landing page
 * **/
    getIp() {
        $.getJSON('https://jsonip.com?callback=?', (data) => {
            this.ip = data.ip;
            this.addEventHandlers();
        });
    }
/**
 * getLocation
 * Once the user clicks on accept we are sending their IP to the API to get their location
 * */
    getLocation() {
    var linkToYelp = null;

    window.addEventListener('popstate', function(event) {
        if (event.state) {
            if (location.search.match('/?page=1')){
                $('.landing_page').show();
                $('.display_category_options_page').addClass('hide');

            } else if (location.search.match('/?page=2')){
                $('.landing_page').hide();
                $('.display_category_options_page').removeClass('hide');
                $('.display_restaurant_data_page').addClass('hide');
                $('.spinner').addClass('hide');
                $('.categ-button').removeClass('disableClick');
                $('.full_restaurant_page').addClass('hide');
                $('.carousel-inner').empty();
                $('#yesButton').attr('disabled', false);
                $('.footer').addClass('hide');
            } else if (location.search.match('/?page=3')){
                $('.full_restaurant_page').addClass('hide');
                var pathArray = location.search.split('/');
                var foodType = pathArray[1];
                var loc = pathArray[2];
                linkToYelp = new YelpData();
                linkToYelp.foodSearchByUrl(foodType,loc);
            } else if(location.search.match('/?business')) {
                $('.landing_page').hide();
                var businessID = location.search;
                businessID = businessID.substring(businessID.indexOf('=') + 1);
                linkToYelp = new YelpData();
                linkToYelp.specificBusinessLookup(businessID);
            }
        }
    }, false);

        if(location.search.match('/?business')) {
            $('.landing_page').hide();
            var businessID = location.search;
            businessID = businessID.substring(businessID.indexOf('=') + 1);
            linkToYelp = new YelpData();
            linkToYelp.specificBusinessLookup(businessID);
        } else if (location.search.match('/?page=1')){

        } else if (location.search.match('/?page=2')){
            $('.landing_page').hide();
            $('.display_category_options_page').removeClass('hide');
        } else if (location.search.match('/?page=3')){
            $('.spinner').removeClass('hide');
            $('.landing_page').hide();
            $('.display_category_options_page').removeClass('hide');
            $('.full_restaurant_page').addClass('hide');

            var pathArray = location.search.split('/');
            var foodType = pathArray[1];
            var loc = pathArray[2];
            loc = decodeURI(loc);

            var linkToWeather = new WeatherData(loc,this.displayWeather);
            linkToWeather.getWeatherData();

            linkToYelp = new YelpData();
            linkToYelp.foodSearchByUrl(foodType,loc);
            linkToYelp.clickHandler();
            return;

        } else {
            history.pushState({page: '?page=1'}, document.title, "?page=1");
        }

        this.addEventHandlers();
         $('.spinner').removeClass('hide');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                $.ajax({
                    url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&zoom=18&addressdetails=1',
                    dataType: 'json',
                    success: this.onResponseSuccess,
                    error: this.failedToGetLocation
                });
            }, (error) => {
                if(error.code == error.PERMISSION_DENIED){
                    this.locationDenied();
                }
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }
 /**
  * onResponseSuccess
  * If the API call is successful we then grab the following data: City, Zip, Latitude, Longitude
  * The city will get passed into the WeatherData instantiation along with the reference for the callback function
  * The city, lattitude and longitude are passed into the instantiation of the YelpData
  * **/
    onResponseSuccess(response) {
     $('.spinner').addClass('hide');
        this.city = response.address.city;

         if(this.city == null) {
             this.locationDenied();
         } else {
             this.city = response.address.city;
             this.zip = response.address.postcode;
             this.latitude = response.lat;
             this.longitude = response.lon;
             var linkToWeather = new WeatherData(this.city,this.displayWeather);
             linkToWeather.getWeatherData();
             var linkToYelp = new YelpData(this.city, this.latitude, this.longitude);
             linkToYelp.clickHandler();
         }

    }
/**
 * If the API Call is unsuccessful let us know via the console
 * later will add an error message for the failure
 * **/
    failedToGetLocation(response) {
        
    }

/**
 * Linking to the map data within map.js and then hides the restaurant page and then displays the following page
 * **/


/**
 * displayWeather
 * this function will display the weather onto the DOM
 * @param weather is passed in from the weatherDataFunctionSuccess
 * the function below gets passed in as a reference call
 * **/
    displayWeather(weather) {
        var weatherOutput=$('<div>').addClass('temp_display').text(weather  +`\xB0 F`);
        var cityOutput=$('<div>').addClass('city_display').text(this.city);
        $('.weather_display').append(cityOutput,' ',weatherOutput);
    }

    locationDenied () {
        let cityFound = false;
        let citiesArray = [];
        $( '#cityInput' ).autocomplete({
            delay: 200,
            minLength: 2,
            source: function(request, response) {
                var value = $('#cityInput').val()
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: 'https://johntheholman.github.io/food_data/cities.json',
                    success: (results) => {
                        citiesArray = results;
                        var cityResults = $.ui.autocomplete.filter(results, request.term);
                        response(cityResults.slice(0, 20));
                    }
                });
            },
            
        });


        $('.spinner').addClass('hide');
        $('#accept').hide();
        $('.disclaimer').hide();
        $('#inputContainer').removeClass('hide');
        $('#cityInput').keydown(function(event){
            if(event.keyCode==13){
                $('#cityInputButton').trigger('click');
                var userCityVal = $('#cityInput').val();
                if (userCityVal == '') {
                    $('.cityInputText').addClass('alert alert-danger').attr('role','alert').attr('style','color:#721c24').text('You must enter a city in order to proceed.');
                    return
                }
            }
        });
        $('#cityInputButton').click((event) => {
            if (!$('#cityInput').val()){
                $('.cityInputText').addClass('alert alert-danger').attr('role','alert').attr('style','color:#721c24').text('You must enter a city in order to proceed.');
                return
            }

            var userCityVal = $('#cityInput').val();
            for (var index = 0; index < citiesArray.length; index++) {
                if(citiesArray[index].toUpperCase() == userCityVal.toUpperCase()){
                    cityFound = true;
                }
            }

            if(!cityFound){
                $('.cityInputText').addClass('alert alert-danger').attr('role','alert').attr('style','color:#721c24').text('City not found, please enter a valid city!');
                return;
            }
            this.city = userCityVal;
            var linkToWeather = new WeatherData(this.city,this.displayWeather);
            linkToWeather.getWeatherData();
            var linkToYelp = new YelpData(this.city, this.latitude, this.longitude);
            linkToYelp.clickHandler();
            $('.landing_page').remove();
            $('.display_category_options_page').removeClass('hide');
            $('#inputContainer').hide();
        });
    }
}