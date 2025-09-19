const { setDefaultAutoSelectFamily } = require("net");

const apiKey = "d8d2f1c137439119c8d41a2201bbd5b6";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=";

const city = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temperature");
const desc = document.getElementById("description");

const iconImg = document.getElementById("icon");
const more = document.getElementById("more");

const resultBox = document.getElementById("result");
const errorBox = document.getElementById("error");

searchBtn.addEventListener("click", () => {
  fetchWeather(city.value);
});

async function fetchWeather(city) {
  errorBox.classList.add("hidden");
  resultBox.classList.add("hidden");

  if (!city) {
    errorBox.textContent = "City name cannot be empty";
    errorBox.classList.remove("hidden");
    throw new Error("City name cannot be empty");
    return;
  }

  try {
    const url = `${apiURL}${city}&appid=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (res.status === 404) {
      errorBox.textContent = data.message;
      errorBox.classList.remove("hidden");
    }

    const name = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;

    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    cityName.textContent = name;
    temp.textContent = `${(temperature - 273.15).toFixed(2)} °C`;
    desc.textContent = description;

    iconImg.src = `https://openweathermap.org/img/wn/${icon}.png`;
    iconImg.alt = description;
    console.log("Img alt : ", iconImg.alt);

    more.textContent = `Humidity: ${humidity}% | Wind Speed: ${windSpeed} m/s`;

    resultBox.classList.remove("hidden");
  } catch (error) {
    console.log(error);
  }
}
