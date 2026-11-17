const weatherForm = document.querySelector(".weather-form");
const cityInput = document.querySelector(".city-input");
const weatherContainer = document.querySelector(".weather-container");
const cityDisplay = document.querySelector("#cityDisplay");
const temperatureDisplay = document.querySelector("#temperatureDisplay");
const descriptionDisplay = document.querySelector("#descriptionDisplay");
const humidityDisplay = document.querySelector("#humidityDisplay");
const humidityInfo = document.querySelector("#humidityInfo");
const windDisplay = document.querySelector("#windDisplay");
const windInfo = document.querySelector("#windInfo");
const feelsLikeDisplay = document.querySelector("#feelsLikeDisplay");
const feelsLikeInfo = document.querySelector("#feelsLikeInfo");
const errorDisplay = document.querySelector("#errorDisplay");
const weatherIcon = document.querySelector("#weatherIcon");
const darkModeButton = document.querySelector("#darkModeButton");

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value.toLowerCase().trim();

    if (city) {
        try {
            const data = await getWeatherData(city);
            displayWeatherInfo(data);
        } catch (error) {
            displayError(error.message);
        }
    } else {
        displayError("please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `/api/weather?city=${encodeURIComponent(city)}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("could not fetch weather data");
    }

    const data = await response.json();
    return data;
}

function displayWeatherInfo(data) {

    const {name: city,
           main: {temp, humidity, feels_like},
           weather: [{description, id}],
           wind: {speed},
           sys: {sunrise, sunset},
           dt
    } = data;

    const isDay = dt >= sunrise && dt < sunset;

    resetWeatherDisplay();
    weatherContainer.style.display = "block";

    cityDisplay.textContent = city;
    temperatureDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    descriptionDisplay.textContent = description;
    humidityDisplay.textContent = "Humidity";
    humidityInfo.textContent = `${humidity}%`;
    windDisplay.textContent = "Wind";
    windInfo.textContent = `${(speed * 3.6).toFixed(1)} km/h`;
    feelsLikeDisplay.textContent = "Feels like";
    feelsLikeInfo.textContent = `${(feels_like - 273.15).toFixed(1)}°C`;

    getWeatherIcon(id, isDay);
}


function getWeatherIcon(id, isDay) {

    weatherIcon.style.display = "inline-block";

    if (id >= 200 && id < 300) {
        weatherIcon.src = isDay ? "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/thunderstorms.svg" : 
                                  "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/thunderstorms-night.svg";
    } else if (id >= 300 && id < 400) {
        weatherIcon.src = isDay ? "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/partly-cloudy-day-drizzle.svg" :
                                  "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/partly-cloudy-night-drizzle.svg";
    } else if (id >= 500 && id < 600) {
        weatherIcon.src = isDay ? "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/partly-cloudy-day-rain.svg" :
                                  "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/partly-cloudy-night-rain.svg";
    } else if (id >= 600 && id < 700) {
        weatherIcon.src = isDay ? "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/partly-cloudy-day-snow.svg" : 
                                  "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/partly-cloudy-night-snow.svg";
    } else if (id >= 700 && id < 800) {
        weatherIcon.src = isDay ? "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/fog-day.svg" : 
                                  "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/fog-night.svg";
    } else if (id === 800) {
        weatherIcon.src = isDay ? "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/clear-day.svg" : 
                                  "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/clear-night.svg";
    } else if (id >= 801 && id < 810) {
        weatherIcon.src = isDay ? "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/partly-cloudy-day.svg" : 
                                  "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/partly-cloudy-night.svg";  
    } else {
        weatherIcon.src = isDay ? "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/weather-alert-day.svg" :
                                  "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/weather-alert-night.svg";
    }
}

function resetWeatherDisplay() {
    cityDisplay.textContent = "";
    temperatureDisplay.textContent = "";
    descriptionDisplay.textContent = "";
    humidityDisplay.textContent = "";
    humidityInfo.textContent = "";
    windDisplay.textContent = "";
    windInfo.textContent = "";
    feelsLikeDisplay.textContent = "";
    feelsLikeInfo.textContent = "";
    errorDisplay.textContent = "";
    weatherIcon.src= "";
}

function displayError(message) {
    resetWeatherDisplay();
    errorDisplay.textContent = message;
    errorDisplay.style.textAlign = "center";
    weatherContainer.style.display = "block";
    weatherContainer.appendChild(errorDisplay);
    weatherIcon.style.display = "none";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}
