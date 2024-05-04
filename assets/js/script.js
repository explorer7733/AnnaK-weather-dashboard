/*My API Key (name:MoonLight) f6c9d2164ce729074aa0a044b7c73a36*/

const weatherApiKey = "f6c9d2164ce729074aa0a044b7c73a36";
const searchFormEl = document.querySelector('#search-form');
const cityInputEl = document.querySelector('#citySearch');
const weatherContainerEl = document.querySelector('#weatherTodayContainer');

/*??????create any other variables?*/

/*Create formSubmitHandler function*/
const formSubmitHandler = function (event) {
    event.preventDefault();

    let cityName = cityInputEl.value.trim();

    if (cityName) {
        getWeatherToday(cityName);

        weatherContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city name');
    };
}

/*Create function to make the API call using fetch() method */
/*need to specify state & country variables in API call */

const getWeatherToday = function (city) {
    const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`;

    fetch(queryURL)
    .then(function(responce) {
        if (responce.ok) {
            return responce.json();
        }
    })

    .then(function(data) {
        console.log(data);
        let lat = data.coord.lat;
        let lon = data.coord.lon;

        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${lat}&${lon}=${weatherApiKey}`)
        .then(function(responce) {
            if (responce.ok) {
                return responce.json();
            }
        })
        .then(function(data) {
            console.log(data);
            let cityName = data.name;
            let icon = data.icon;  /*????how add icon: "04n" / "02n" etc - sun, clouds, rain */
            let temp = data.temp;
            let wind = data.wind;
            let humidity = data.humidity;
            let forecast = data.items[0].weather[0];         
        })
    })

};

/*create function 5 days forecast - using for loop*/



/*Create function to save cities in local storage */
let citiesList = JSON.parse(localStorage.getItem('cities')) || [];

function getCitiesFromLocalStorage() {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    return cities;    
}


/*Create buttonClickHnadler function each city*/
const cityButtons = document.querySelector('#cityButton');

const buttonClickHandler = function (event) {
        event.preventDefault();


        
};


/*Add addEventListener*/
searchFormEl.addEventListener('submit', formSubmitHandler);
cityButtons.addEventListener('click', buttonClickHandler);
