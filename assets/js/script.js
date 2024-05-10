/*My API Key (name:MoonLight) f6c9d2164ce729074aa0a044b7c73a36*/

const weatherApiKey = "f6c9d2164ce729074aa0a044b7c73a36";
const searchFormEl = document.querySelector('#search-form');
const cityInputEl = document.querySelector('#citySearch');
const weatherContainerEl = document.querySelector('#weatherTodayContainer');

/*Create formSubmitHandler function*/
const formSubmitHandler = function (event) {
    event.preventDefault();

    let cityName = cityInputEl.value.trim();

    if (cityName) {
        let cityList = JSON.parse(localStorage.getItem('city'));
        if (!Array.isArray(cityList)) {
            cityList = [];
        }
        generateButtons(cityName);
        getWeather(cityName);
        cityList.push(cityName);
        localStorage.setItem('city', JSON.stringify(cityList));
        weatherContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city name');
    };
}

/*Create function to make the API call using fetch() method */

const getWeather = function (city) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`;

    fetch(queryURL)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        }
        )

        .then(function (data) {
            console.log(data);
            let lat = data.coord.lat;
            let lon = data.coord.lon;

            const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;

            fetch(forecastURL)
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Weather data not found');
                    }
                    return response.json();
                }
                )

                .then(function (data) {

                    renderForecast(data, city);
                })
                .catch(function (error) {
                    console.error('error fetching weather data', error);
                })
        })
};

/*Create today weather forecast function*/
const createTodayWeatherCard = function (day, city) {

    const formattedDate = day.dt_txt.split(' ')[0];
    let todayWeatherCardContainer = $('#weatherTodayContainer');

    /*add card*/
    const cardBody = $('<div>').addClass('card-body');
    const card = $('<div>').addClass('card w-75 mx-auto mb-3');
    const header = $('<div>').text(`${city} (${formattedDate})`).addClass('card-header h3');
    /*add icon and source for icon*/
    const icon = $('<img>').addClass('icon');
    icon.attr('src', `https://openweathermap.org/img/w/${day.weather[0].icon}.png`);

    const temp = $('<div>').addClass('card-text').text(`Temp: ${day.main.temp}`);
    const wind = $('<div>').addClass('card-text').text(`Wind: ${day.wind.speed}`);
    const humidity = $('<div>').addClass('card-text').text(`Humidity: ${day.main.humidity}`);

    cardBody.append(header, icon, temp, wind, humidity);
    card.append(cardBody);
    todayWeatherCardContainer.append(card);
}

/*Create cards and 5-days forecast function using for loop*/
const createForecastCard = function (day, cardsContainer) {

    const formattedDate = day.dt_txt.split(' ')[0];

    /*add card*/
    const cardBody = $('<div>').addClass('card-body');
    const card = $('<div>').addClass('card w-75 mx-auto mb-3');
    const icon = $('<img>').addClass('icon');
    icon.attr('src', `https://openweathermap.org/img/w/${day.weather[0].icon}.png`);
    const date = $('<div>').addClass('card-header p').text(formattedDate);
    const temp = $('<div>').addClass('card-text').text(`Temp: ${day.main.temp}`);
    const wind = $('<div>').addClass('card-text').text(`Wind: ${day.wind.speed}`);
    const humidity = $('<div>').addClass('card-text').text(`Humidity: ${day.main.humidity}`);

    cardBody.append(date, icon, temp, wind, humidity);
    card.append(cardBody);
    cardsContainer.append(card);
}

/*add button*/
const generateButtons = function (city) {
    console.log(city);

    let cardsContainer = $('#cityButton');
    const button = $('<button>').addClass('btn').attr('id', city).text(city);
    button.on('click', buttonClickHandler);
    cardsContainer.append(button);
}

function renderForecast(forecastData, city) {
    console.log(forecastData);

    let cardsContainer = $('#fiveDaysForecast');
    cardsContainer.empty();

    let todayWeatherCardContainer = $('#weatherTodayContainer');
    todayWeatherCardContainer.empty();

    const todayDate = new Date().toISOString().split('T')[0];

    let todayWeather = null;

    for (item of forecastData.list) {
        if (item.dt_txt.includes(todayDate)) {
            todayWeather = item;
            break;
        }
    }

    createTodayWeatherCard(todayWeather, city);

    let forecastDates = [todayDate];
    let cardsRendered = 1;

    for (day of forecastData.list) {

        const forecastDate = day.dt_txt.split(' ')[0];

        if (!forecastDates.includes(forecastDate) && cardsRendered <= 5) {
            forecastDates.push(forecastDate);
            cardsContainer.append(createForecastCard(day, cardsContainer));
            cardsRendered++;
        }
    }

}

/*Create buttonClickHandler function each city*/
const buttonClickHandler = function (event) {
    event.preventDefault();

    const city = event.target.id;
    console.log("city: ", city);

    getWeather(city);

};

/*Add addEventListener*/
const cityButtons = document.querySelector('#cityButton');

searchFormEl.addEventListener('submit', formSubmitHandler);
cityButtons.addEventListener('click', buttonClickHandler);
