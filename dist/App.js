"use strict";
const APIkey = "f849c7aa8c064f7dbda164857230604";
const loc = document.getElementById("search-box");
const search = document.getElementById("search-button");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const city = document.getElementById("city-name");
const temp = document.getElementById("city-temp");
const how = document.getElementById("how");
const howimg = document.getElementById("how-img");
const uv = document.getElementById("uv");
const humidity = document.getElementById("humidity");
const day = document.getElementById("day");
const wind = document.getElementById("wind");

console.log("salut");

async function jsonCurrent(place) {
  //real time temperature
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${place}`
  );
  const jsonData = await response.json();
  city.textContent = `${jsonData.location.name}, ${jsonData.location.region}, ${jsonData.location.country} `;
  const d = new Date(jsonData.current.last_updated);
  day.textContent = `${weekdays[d.getDay()]}, ${jsonData.current.last_updated}`;
  temp.textContent = `${Math.round(jsonData.current.temp_c)}°C`;
  humidity.textContent = `${jsonData.current.humidity} %`;
  const URL = `https:${jsonData.current.condition.icon}`;
  howimg.src = URL;
  uv.textContent = `${jsonData.current.uv}`;
  wind.textContent = `${jsonData.current.wind_kph} km/h`;
  how.textContent = `${jsonData.current.condition.text}`;

  //next days temperature
  const response1 = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${APIkey}&q=${place}&days=4`
  );
  const jsonDataFututre = await response1.json();
  console.log(jsonDataFututre);

  for (let i = 1; i < 4; i++) {
    const cityf = document.getElementById(`city-name-${i}`);
    const tempf = document.getElementById(`city-temp-${i}`);
    const howf = document.getElementById(`how-${i}`);
    const howimgf = document.getElementById(`how-img-${i}`);
    const uvf = document.getElementById(`uv-${i}`);
    const humidityf = document.getElementById(`humidity-${i}`);
    const dayf = document.getElementById(`day-${i}`);
    const windf = document.getElementById(`wind-${i}`);
    cityf.textContent = `${jsonData.location.name}, ${jsonData.location.region}, ${jsonData.location.country}`;
    tempf.textContent = `${Math.round(
      jsonDataFututre.forecast.forecastday[i].day.avgtemp_c
    )}°C`;
    howf.textContent =
      jsonDataFututre.forecast.forecastday[i].day.condition.text;
    let u = `http:${jsonDataFututre.forecast.forecastday[i].day.condition.icon}`;
    howimgf.src = u;
    uvf.textContent = jsonDataFututre.forecast.forecastday[i].day.uv;
    humidityf.textContent = `${jsonDataFututre.forecast.forecastday[i].day.avghumidity} %`;
    const d = new Date(jsonDataFututre.forecast.forecastday[i].date);
    dayf.textContent = `${weekdays[d.getDay()]}, ${
      jsonDataFututre.forecast.forecastday[i].date
    }`;
    windf.textContent = `${jsonDataFututre.forecast.forecastday[i].day.maxwind_kph} km/h`;
  }
}

search.addEventListener("click", function (event) {
  event.preventDefault();
  jsonCurrent(loc.value);
  //   alert(loc.value);
});

if (!loc.value) {
  const successCallback = (position) => {
    displayLocation(position.coords.latitude, position.coords.longitude);
  };

  const errorCallback = (error) => {
    jsonCurrent("Bucuresti");
    alert("The location could not be taken!");
  };
  const location = navigator.geolocation.getCurrentPosition(
    successCallback,
    errorCallback
  );

  async function displayLocation(lat, long) {
    const loc = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=b229483c2c2c4f8ab17ac8265249283c`
    );
    const loca = await loc.json();
    const cityname = loca.features[0].properties.city
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    jsonCurrent(cityname);
  }
}
