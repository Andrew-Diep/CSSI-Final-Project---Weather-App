// imperial --> farenheit(default)
// metric --> celcius
let units = "imperial";
let unitsSym = "F";

const fahren = document.querySelector("#fahrenheitButton");
const celcius = document.querySelector("#celciusButton");
const searchBar = document.querySelector("#search");
const cityHolder = document.querySelector("#cityName");
const weathConHolder = document.querySelector("#weatherCondition");
const tempHolder = document.querySelector("#temp");
const submitButton = document.querySelector("#submit");
const recentCity = document.querySelector("#recent");
const timeZoneHolder = document.querySelector("#timeZone");

// URL for getting weather info
let weatherURL;

// URL for getting timezone info
let timeZoneURL;

// URL for getting location info
let locURL;
let city;
let weatherCondition;
let cityTimeZone;



// URL Parameters
const weatherHost = "https://api.openweathermap.org/data/2.5/weather";
const locHost = "https://api.openweathermap.org/geo/1.0/direct";
const limit = 5;
const key = "c9975c44f7ec4154c146d4b1f6ab38f8";
const timeZoneHost = "https://api.ipgeolocation.io/timezone?apiKey=";
const keyTimeZone = "b1b1a19ceead4339b5df5ede3fc37f80";



// input: city name
// output: object containing latitude and longitude
async function cityToCoord(city) {
  locURL = `${locHost}?q=${city}&limit=${limit}&appid=${key}`;
  const json = await fetch(locURL);
  const data = await json.json();
  var coord = {
    lat: data[0].lat,
    lon: data[0].lon
  };

  return coord
}


// input: latitude, longitude
// output: weather-info JSON
async function getCityWeather(lat, lon) {
  weatherURL = `${weatherHost}?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`;
  const json = await fetch(weatherURL);
  const data = await json.json();

  return data;
}
// input: latitude, longitude
// output:12 hour time in pm at location
async function coordToTimeZone(lat, lon) {
  timeZoneURL = `${timeZoneHost}${keyTimeZone}&lat=${lat}&long=${lon}`;
  const json = await fetch(timeZoneURL);
  const data = await json.json();
  const time = data.time_12;
  return time;
}

function getWeatherDesc(data) {
  return data.weather[0].description;
}

function getTemp(data) {
  return data.main.temp;
}

function getCityName(data) {
  return data.name;
}


// Handles all asynchrounous API related stuff
// --------------------------------------------------
// Side note: is there a better way to do this?
// Should I be using promises or callbacks and stuff? 
async function weatherHandler() {
  let coord;
  let lat;
  let lon;
  let data;

  coord = await cityToCoord(city);
  lat = coord.lat;
  lon = coord.lon;

  data = await getCityWeather(lat, lon);
  cityHolder.innerHTML = getCityName(data);
  weathConHolder.innerHTML = getWeatherDesc(data);
  tempHolder.innerHTML = getTemp(data) + unitsSym;
  timeZoneHolder.innerHTML = await coordToTimeZone(lat, lon);
}

// When red button is clicked
fahren.addEventListener("click", function() {
  units = "imperial";
  unitsSym = "F";
  weatherHandler();
});

// When blue button is clicked
celcius.addEventListener("click", function() {
  units = "metric";
  unitsSym = "C";
  weatherHandler();
});

// It works now that I changed it to this.
// I think submit button is unnecessary.
// Also, for some reason, the search bar 
// doesn't work when I open the website in
// a new tab. 
// ---------------------------------------
// UPDATE: found the problem, its style.css
// more specifically, .top seems to be the problem. 
searchBar.addEventListener("change", function() {
  let input = searchBar.value;
  city = input;
  weatherHandler();
});
// submitButton.addEventListener("click",function(){
//   console.log(searchBar);
//   recentCity.innerHTML += searchBar+"</br>";
//   city = searchBar;
//  weatherHandler();
// });