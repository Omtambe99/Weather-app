const apiKey = "1c355ec6c92a4f4c90aa1f5f9aed8004";



const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");

const defaultView = document.getElementById("defaultView");
const weatherView = document.getElementById("weatherView");
const errorView = document.getElementById("errorView");

const cityName = document.getElementById("cityName");
const dateToday = document.getElementById("dateToday");
const temp = document.getElementById("temp");
const desc = document.getElementById("description");
const icon = document.getElementById("weatherIcon");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const forecastContainer = document.getElementById("forecastContainer");

button.addEventListener("click", () => {
  const city = input.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

function fetchWeather(city) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(weatherURL)
    .then((res) => {
      if (!res.ok) {
        // Show error screen
        defaultView.style.display = "none";
        weatherView.style.display = "none";
        errorView.style.display = "block";
        throw new Error("City not found");
      }
      return res.json();
    })
    .then((data) => {
      // Show weather screen
      defaultView.style.display = "none";
      errorView.style.display = "none";
      weatherView.style.display = "block";

      const now = new Date();
      cityName.textContent = data.name;
      dateToday.textContent = now.toDateString().slice(0, 10);
      temp.textContent = `${Math.round(data.main.temp)}°C`;
      desc.textContent = data.weather[0].main;
      icon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      humidity.textContent = `${data.main.humidity}%`;
      wind.textContent = `${data.wind.speed} M/s`;
    })
    .catch((err) => console.error(err));

  // Forecast (optional, doesn't trigger error)
  fetch(forecastURL)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod !== "200") return;

      const days = {};
      data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!days[date]) {
          days[date] = {
            temp: item.main.temp,
            icon: item.weather[0].icon,
          };
        }
      });

      const futureDays = Object.keys(days).slice(1, 4);
      forecastContainer.innerHTML = "";
      futureDays.forEach((date) => {
        const iconURL = `http://openweathermap.org/img/wn/${days[date].icon}@2x.png`;
        forecastContainer.innerHTML += `
          <div class="day">
            <div>${formatDate(date)}</div>
            <img src="${iconURL}" alt="icon" />
            <div>${Math.round(days[date].temp)}°C</div>
          </div>`;
      });
    });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const options = { month: "short", day: "numeric" };
  return d.toLocaleDateString(undefined, options);
}
