/**
 * class representing WeatherData
 * will do an ajax call to get the weather data
 * **/
class WeatherData {
 /**
  * @constructor
  * @param responseCity  The current city that the user is in
  * @param displayWeatherCall The reference of the callback function from LocDataTemplate
  *        that should be called once getWeatherData success
  * the binding is taken care of as well since we are doing an ajax call
  **/
   constructor(responseCity, displayWeatherCall) {
       this.city = responseCity;
       this.displayWeatherCall = displayWeatherCall;
       this.weatherDataSuccess = this.weatherDataSuccess.bind(this);
       this.weatherDataFailure = this.weatherDataFailure.bind(this);
   }
 /**
  * getWeatherData is called from the location js file for the class LocDataTemplate
  *     inside the function we have the ajax call to call the api that will give is the weather of the current city
  * **/
    getWeatherData() {
        var city = this.city;
        var ajaxWeatherOptions = {
            url: 'https://api.openweathermap.org/data/2.5/weather',
            method: 'get',
            dataType: 'json',
            data: {
                q: city,
                APPID: weatherCredentials,
            },
            success: this.weatherDataSuccess,
            error: this.weatherDataFailure
        };
        $.ajax(ajaxWeatherOptions);
    }
/**
 * weatherDataSuccess is the function called upon success
 * @param response is response that is an object
 *      we pass in the temp into the callback function of displayWeather
 * **/
    weatherDataSuccess(response){
        var currentKelvinTemp=response.main.temp;
        var currentKToF=Math.floor((currentKelvinTemp-273.15)*(9/5)+32);
        this.displayWeatherCall(currentKToF);
    }
/**
 * weatherDataFailure
 * @param response is response that is an object
 *      this is a function that will run when an error has occurred
 *      currently the function is only storing the response**/
    weatherDataFailure(response) {
        var failResponse = response;
    }
}





