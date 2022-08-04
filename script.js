// maps
var map;
var infowindow;
var query = "Mountain View";

// imperial --> farenheit(default)
// metric --> celcius
let units = "imperial";
let unitsSym = "°F";
const fahren = document.querySelector("#fahrenheitButton");
const celcius = document.querySelector("#celciusButton");

//search bar 
const searchBar = document.querySelector("#search");
const submitButton = document.querySelector("#submit");

//city
const cityHolder = document.querySelector("#cityName");
let recentCity = document.querySelector("#recent");

//time
const timeZoneHolder = document.querySelector("#timeZone");

//weather related
const weathConHolder = document.querySelector("#weatherCondition");
const tempHolder = document.querySelector("#temp");
const icon = document.querySelector("#weatherImg");
const windIcon = document.querySelector("#windImg");
const windHolder = document.querySelector("#wind");
const maxAndMinHolder = document.querySelector("#tempMaxAndMin");
const humidityHolder = document.querySelector("#humidity");
const pressureHolder = document.querySelector("#pressure");
const feelsLikeHolder = document.querySelector("#feelsLike");

//forecast
const weathConHolder1 = document.querySelector("#weatherCondition_c1");
const tempHolder1 = document.querySelector("#temp_c1");
const icon1 = document.querySelector("#weatherImg_c1");
const time1 = document.querySelector("#time_c1");

const weathConHolder2 = document.querySelector("#weatherCondition_c2");
const tempHolder2 = document.querySelector("#temp_c2");
const icon2 = document.querySelector("#weatherImg_c2");
const time2 = document.querySelector("#time_c2");

const weathConHolder3 = document.querySelector("#weatherCondition_c3");
const tempHolder3 = document.querySelector("#temp_c3");
const icon3 = document.querySelector("#weatherImg_c3");
const time3 = document.querySelector("#time_c3");

const weathConHolder4 = document.querySelector("#weatherCondition_c4");
const tempHolder4 = document.querySelector("#temp_c4");
const icon4 = document.querySelector("#weatherImg_c4");
const time4 = document.querySelector("#time_c4");

const weathConHolder5 = document.querySelector("#weatherCondition_c5");
const tempHolder5 = document.querySelector("#temp_c5");
const icon5 = document.querySelector("#weatherImg_c5");
const time5 = document.querySelector("#time_c5");

//STORED INTO ONE OBJECT
const forecast = {
  time: [time1, time2, time3, time4, time5],
  icon: [icon1, icon2, icon3, icon4, icon5],
  weathConHolder: [weathConHolder1, weathConHolder2, weathConHolder3, weathConHolder4, weathConHolder5],
  tempHolder: [tempHolder1, tempHolder2, tempHolder3, tempHolder4, tempHolder5],
}


// URL for getting weather info
let weatherURL;

// URL for getting timezone info
let timeZoneURL;

// URL for getting location info
let locURL;

// URL for getting country info
let countryURL;

let input;
let city;
let weatherCondition;
let lan;
let lon;



// URL Parameters
const weatherHost = "https://api.openweathermap.org/data/2.5/weather";
const locHost = "https://api.openweathermap.org/geo/1.0/direct";
const limit = 5;
const key = "c9975c44f7ec4154c146d4b1f6ab38f8";
const APIkey = "90cb3f88e7ce8b6b5c6847d4ff7a4195";
const timeZoneHost = "https://api.ipgeolocation.io/timezone?apiKey=";
const keyTimeZone = "b1b1a19ceead4339b5df5ede3fc37f80";

// Initialize and add the map
function initMap() {
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
  });
  var request = {
    query: query,
    fields: ['name', 'geometry'],
  };
  var service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        console.log("Map Signal");
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}

// input: city name
// output: object containing latitude and longitude
async function cityToCoord(city) {
  locURL = `${locHost}?q=${city}&limit=${limit}&appid=${key}`;
  const json = await fetch(locURL);
  const data = await json.json();
  console.log(data);
  var coord = {
    city: data[0].name,
    country_code: data[0].country,
    lat: data[0].lat,
    lon: data[0].lon

  };

  return coord;
}

let favoriteLocations = [];
//favorite 
const favoriteButton = document.querySelector("#favoriteButton");
//localStorage.setItem("favorited", '');
recentCity.innerHTML = localStorage.getItem("favorited");

function restoreFavorites() {
  for (let i = 1; i <= recentCity.childElementCount; i++) {
    const fav = document.querySelector(`#recent button:nth-child(${i})`);
    fav.addEventListener("click", function() {
      input = fav.innerHTML;
      weatherHandler();
      query = input;
      initMap();
    });

    favoriteLocations.push(fav.innerHTML);
  }
}

restoreFavorites();


async function getCountryInfo(code) {
  countryURL = `https://restcountries.com/v2/alpha?codes=${code}`;
  const json = await fetch(countryURL);
  const data = await json.json();

  return data;
}


// input: latitude, longitude
// output: weather-info JSON
async function getCityWeather(lat, lon) {
  weatherURL = `${weatherHost}?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`;
  const json = await fetch(weatherURL);
  const data = await json.json();

  return data;
}

//weather forecasting

async function getForecast(lat, lon) {
  let newForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${APIkey}&units=${units}`);
  const data = await newForecast.json();
  return data;
}


// input: latitude, longitude
// output:12 hour time at position
async function coordToTimeZone(lat, lon) {
  timeZoneURL = `${timeZoneHost}${keyTimeZone}&lat=${lat}&long=${lon}`;
  const json = await fetch(timeZoneURL).then((response) => {
    const data = json.json();
    const time = data.time_12;
    return time;
  }).catch((error) => {
    timeZoneHolder.classList.add("hidden");
    return "";
  });
}

// GETTING WEATHER DATA

function getWeatherDesc(data) {
  return data.weather[0].description;
}

function getTemp(data) {
  return data.main.temp;
}

function getCityName(coord) {
  return coord.city;
}

function getWeatherIconCode(data) {
  return data.weather[0].icon;
}

// GETTING FORECAST DATA

function getForecastTime(data, i) {
  return data.list[i].dt_txt.slice(5, data.list[i].dt_txt.slice.length - 11);
}

function getForecastDesc(data, i) {
  return data.list[i].weather[0].description;
}

function getForecastTemp(data, i) {
  return data.list[i].main.temp;
}

function getForecastIcon(data, i) {
  return data.list[i].weather[0].icon;
}

// wind info 

function getWindInfo(data) {
  const windSpeed = data.wind.speed;
  let windDirectionDegree = parseInt(data.wind.deg);
  let windDirection = "";
  // windDirectionDegree will always be from 0<=x<=360
  if (windDirectionDegree == 0) {
    windDirection = "N";
  } else if (windDirectionDegree < 90) {
    windDirection = "NE";
  } else if (windDirectionDegree == 90) {
    windDirection = "E";
  } else if (windDirectionDegree < 180) {
    windDirection = "SE";
  } else if (windDirectionDegree == 180) {
    windDirection = "S";
  } else if (windDirectionDegree < 270) {
    windDirection = "SW";
  } else if (windDirectionDegree == 270) {
    windDirection = "W";
  } else if (windDirectionDegree <= 360) {
    windDirection = "NW";
  }
  windIcon.setAttribute("src", "icons/" + windDirection + ".png");
  windIcon.classList.remove("hidden");
  return "Wind: " + windSpeed + "mph " + windDirection;
}

function getWeatherHumidity(data) {
  return "Humidity: " + parseInt(data.main.humidity) + "%";
}

function getPressure(data) {
  return "Pressure: " + data.main.pressure + " hPa";
}

function getFeelsLike(data) {
  return parseInt(data.main.feels_like);
}

//TIME

function updateTime() {
  updateTimeZoneInfo();
  setInterval(updateTimeZoneInfo, 60000);
}

// Handles all asynchrounous API related stuff
// --------------------------------------------------
// Side note: is there a better way to do this?
// Should I be using promises or callbacks and stuff? 
async function weatherHandler() {
  const coord = await cityToCoord(input);
  lat = coord.lat;
  lon = coord.lon;
  city = coord.city;

  updateWeather();
  updateForecast();
  updateCountryInfo(coord);
  updateTime();
  updateTemp();
}

async function updateCountryInfo(coord) {
  const cData = await getCountryInfo(coord.country_code);
  console.log(cData);

  cityHolder.innerHTML = city + ", " + cData[0].name;
}

async function updateWeather() {
  const wData = await getCityWeather(lat, lon);
  icon.setAttribute("src", "icons/" + getWeatherIconCode(wData) + ".png");
  weathConHolder.innerHTML = getWeatherDesc(wData);
  tempHolder.innerHTML = getTemp(wData) + unitsSym;
  windHolder.innerHTML = getWindInfo(wData);
  humidityHolder.innerHTML = getWeatherHumidity(wData);
  pressureHolder.innerHTML = getPressure(wData);
}

async function updateForecast() {
  const fData = await getForecast(lat, lon);

  for (let i = 1; i < 6; i++) {
    forecast.time[i - 1].innerHTML = getForecastTime(fData, -8 + 8 * i);
    forecast.icon[i - 1].setAttribute("src", "icons/" + getForecastIcon(fData, -8 + 8 * i) + ".png");
    forecast.weathConHolder[i - 1].innerHTML = getForecastDesc(fData, -8 + 8 * i);
    forecast.tempHolder[i - 1].innerHTML = getForecastTemp(fData, -8 + 8 * i) + unitsSym;
  }

  console.log("Forecast Updated!");
}

async function updateTemp() {
  const wData = await getCityWeather(lat, lon);
  const fData = await getForecast(lat, lon);

  tempHolder.innerHTML = getTemp(wData) + unitsSym;
  maxAndMinHolder.innerHTML = "H: " + wData.main.temp_max + unitsSym + " | L: " + wData.main.temp_min + unitsSym;
  feelsLikeHolder.innerHTML = "Feels like: " + getFeelsLike(wData) + unitsSym;
  for (let i = 1; i < 6; i++) {
    forecast.tempHolder[i - 1].innerHTML = getForecastTemp(fData, -8 + 8 * i) + unitsSym;
  }
  console.log("Temperature Updated!")
}

async function updateTimeZoneInfo() {
  timeZoneHolder.innerHTML = await coordToTimeZone(lat, lon);
}


// When red button is clicked
fahren.addEventListener("click", function() {
  units = "imperial";
  unitsSym = "°F";
  updateTemp();
});

// When blue button is clicked
celcius.addEventListener("click", function() {
  units = "metric";
  unitsSym = "°C";
  updateTemp();
});

//SEARCH LISTENER

searchBar.addEventListener("change", function() {
  input = searchBar.value;
  query = input;
  searchBar.value = "";
  weatherHandler();
  initMap();
});

function clickHandler() {
  console.log("clicked!");
}

//FAVORITES

favoriteButton.addEventListener("click", function() {
  let noDuplicates = true;
  const length = favoriteLocations.length;

  for (let i = 0; i < length; i++) {
    if (favoriteLocations[i] === city) {
      noDuplicates = false;
    }
  }

  if (noDuplicates && city != undefined) {
    favoriteLocations.push(city);
    const createdButton = document.createElement("button");
    recentCity.appendChild(createdButton);
    createdButton.innerHTML = city;

    createdButton.addEventListener("click", function() {
      input = createdButton.innerHTML;
      searchBar.value = "";
      weatherHandler();
      query = input;
      initMap();
    });

    initMap();

    localStorage.setItem("favorited", recentCity.innerHTML);
    console.log(localStorage.getItem("favorited"));
  }
});





