let key = "4a024tf7d3bb1a1d99bfb3e958o13344";
let BASEURL = "https://api.shecodes.io/weather/v1/";

let currentDate = new Date();

function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let currentYear = date.getFullYear();
  let currentMonth = date.getMonth();
  let mounth = currentMonth + 1;
  let number = date.getDate();
  let hours = currentDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (mounth < 10) {
    mounth = `0${mounth}`;
  }
  if (number < 10) {
    number = `0${number}`;
  }
  let updateDate = ` ${number}.${mounth}.${currentYear}`;
  let dateHtml = document.querySelector("#date");
  dateHtml.innerHTML = updateDate;
  let time = document.querySelector("#time");
  time.innerHTML = ` ${day} ${hours}:${minutes}`;
}

formatDate(currentDate);

let city = document.querySelector("#search");
let header = document.querySelector("h3");

function enterCity(event) {
  event.preventDefault();
  let newCity = city.value;
  header.innerHTML = newCity;

  function searchCity(newCity) {
    axios.get(BASEURL + `current?query=${newCity}&key=${key}`).then(showData);
  }
  searchCity(newCity);

  axios
    .get(BASEURL + `forecast?query=${newCity}&key=${key}`)
    .then(displayForecast);
}
let form = document.querySelector("#search-form");
form.addEventListener("submit", enterCity);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col">
        <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
        <img
          src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            forecastDay.condition.icon
          }.png"
       
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temperature.maximum
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temperature.minimum
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//API

function showData(response) {
  let icon = document.querySelector("#icon");
  let temperature = document.querySelector("#temp");
  let description = document.querySelector("#descr");
  let windy = document.querySelector("#wind");
  let humidity = document.querySelector("#humidity");

  let currentTemp = `${Math.round(response.data.temperature.current)}`;

  icon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  icon.setAttribute("alt", response.data.condition.description);
  temperature.innerHTML = currentTemp;
  description.innerHTML = response.data.condition.description;
  windy.innerHTML = `Wind: ${Math.round(response.data.wind.speed)} km/h`;
  humidity.innerHTML = `Humidity: ${response.data.temperature.humidity} %`;

  function displayFahrenheit(e) {
    e.preventDefault();

    celsiusTemp.classList.remove("active");
    fahrenheitTemp.classList.add("active");

    let fahrenheitTemperature = (currentTemp * 9) / 5 + 32;
    let temperatureEl = document.querySelector("#temp");
    temperatureEl.innerHTML = Math.round(fahrenheitTemperature);
  }
  let fahrenheitTemp = document.querySelector("#fahrenheit-link");
  fahrenheitTemp.addEventListener("click", displayFahrenheit);

  function displayCelsius(e) {
    e.preventDefault();

    celsiusTemp.classList.add("active");
    fahrenheitTemp.classList.remove("active");

    let temperatureEl = document.querySelector("#temp");
    temperatureEl.innerHTML = currentTemp;
  }

  let celsiusTemp = document.querySelector("#celsius-link");
  celsiusTemp.addEventListener("click", displayCelsius);
}

//geolocation

function handlePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let url = BASEURL + `current?lon=${lon}&lat=${lat}&key=${key}`;
  axios.get(url).then(showData);
  header.innerHTML = "Now in your city";
}
function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}
getCurrentPosition();
