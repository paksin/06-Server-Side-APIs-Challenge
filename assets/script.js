var searchInputEl = document.querySelector("#location");
var searchFormEl = document.querySelector("#search-form");
var currentListEl = document.querySelector("#currentList");
var currentInfoEl = document.querySelector("#currentInfo");
var currentTempEl = document.querySelector("#currentTemp");
var currentWindEl = document.querySelector("#currentWind");
var currentHumidityEl = document.querySelector("#currentHumidity");
var currentConditionEl = document.querySelector("#currentCondition");
var searchHistoryEl = document.querySelector("#searchHistory");
var searchHistory = localStorage.getItem("searchHistory");
var glat = 0;
var glon = 0;
var cityName = "";
var date = "";
var condition = "";
var temp = 0;
var humidity = 0;
var windSpeed = 0;

var historySearcher = function () {
    var searchHistoryButtonEl = document.querySelector("#searchHistory").children;

    console.log(searchHistoryButtonEl);
    console.log(searchHistoryButtonEl[0]);
    
    for (let i = 0; i < searchHistoryButtonEl.length; i++) {
        searchHistoryButtonEl[i].addEventListener('click', function (event) {
            event.preventDefault();
            console.log(event.target);
            var location = event.target.id;
            formSubmitHandler(location);
        });
    };
};


var formSubmitHandler = function (location) {
    console.log(location);
    convertGeo(location);
    if (searchHistory.length > 9) {
        searchHistory.pop();
    }
    searchHistory.unshift(location);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    getHistory();
}

var getHistory = function () {
    console.log(searchHistory);
    searchHistoryEl.textContent = "";
    if (searchHistory == null) {
        searchHistory = [];
        console.log(searchHistory);
    } else {
        searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
        for (let i = 0; i < searchHistory.length; i++) {
            var entry = document.createElement('li');
            entry.innerHTML = '<button class = "searchHistoryButton" id= "' + searchHistory[i] + '">' + searchHistory[i] + '</button>';
            searchHistoryEl.appendChild(entry);
        }
    }

}

var convertGeo = function (location) {
    var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=1&appid=8322ab97007a985fea243c35b56148f4";
    console.log(geoUrl);
    fetch(geoUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    glat = data[0].lat;
                    glon = data[0].lon;
                    console.log(glat);
                    console.log(glon);
                    getResult(glat, glon);
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather');
        });
};

var getResult = function (lat, lon) {
    var currentUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=8322ab97007a985fea243c35b56148f4&units=metric";
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=8322ab97007a985fea243c35b56148f4&units=metric";
    getCurrent(currentUrl);
    getForecast(forecastUrl);
    historySearcher();
};

var getCurrent = function (currentUrl) {
    console.log(currentUrl);
    fetch(currentUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    cityName = data.name;
                    date = moment.unix(data.dt).format("MMM DD YYYY");
                    console.log(date);
                    condition = data.weather[0].icon;
                    console.log(condition);
                    temp = data.main.temp;
                    humidity = data.main.humidity;
                    windSpeed = data.wind.speed;
                    currentConditionEl.innerHTML = '<img src="http://openweathermap.org/img/wn/' + condition + '@2x.png" alt="Current Condition Icon">';
                    currentInfoEl.textContent = cityName + " (" + date + ")";
                    currentTempEl.textContent = temp + " °C";
                    currentWindEl.textContent = windSpeed + " m/s";
                    currentHumidityEl.textContent = humidity + " %";
                });
            } else {
                alert('Error: ' + response.statusText);
            };
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather');
        });
};

var getForecast = function (forecastUrl) {
    console.log(forecastUrl);
    fetch(forecastUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    for (let i = 7; i < data.list.length; i = i + 8) {
                        var dataItem = data.list[i];
                        date = moment.unix(dataItem.dt).format("MMM DD YYYY");
                        console.log(date);
                        condition = dataItem.weather[0].icon;
                        temp = dataItem.main.temp;
                        humidity = dataItem.main.humidity;
                        windSpeed = dataItem.wind.speed;
                        var forcastConditionEl = document.querySelector("#Condition" + i);
                        var forcastInfoEl = document.querySelector("#Info" + i);
                        var forcastTempEl = document.querySelector("#Temp" + i);
                        var forcastWindEl = document.querySelector("#Wind" + i);
                        var forcastHumidityEl = document.querySelector("#Humidity" + i);
                        forcastConditionEl.innerHTML = '<img src="http://openweathermap.org/img/wn/' + condition + '@2x.png" alt="Current Condition Icon">';
                        forcastInfoEl.textContent = date;
                        forcastTempEl.textContent = temp + " °C";
                        forcastWindEl.textContent = windSpeed + " m/s";
                        forcastHumidityEl.textContent = humidity + " %";
                    }

                });
            } else {
                alert('Error: ' + response.statusText);
            };
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather');
        });
};


searchFormEl.addEventListener('submit', function (event) {
    event.preventDefault();
    var location = searchInputEl.value.trim();
    formSubmitHandler(location);
});

getHistory();
historySearcher();

