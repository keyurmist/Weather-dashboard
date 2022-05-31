$(document).ready(function () {
  let NowMoment = moment().format("1"); //this pulls the current date for the recent info

  //this add 5 days to the moment to show the forecast for 5 days
  let day1 = moment().add(1, "days").format("1");
  let day2 = moment().add(2, "days").format("1");
  let day3 = moment().add(3, "days").format("1");
  let day4 = moment().add(4, "days").format("1");
  let day5 = moment().add(5, "days").format("1");

  let city;
  let cities;

  //this function loads the most recently searched city in the local storage
  function loadMostRecent() {
    let lastSearch = localStorage.getItem("mostRecent");
    if (lastSearch) {
      city = lastSearch;
      lastSearch();
    } else {
      city = "London";
      search();
    }
  }

  loadMostRecent();

  function loadRecentCities() {
    let recentCities = JSON.parse(localStorage.getItem("cities"));
    if (recentCities) {
      cities = recentCities;
    } else {
      cities = [];
    }
  }

  loadRecentCities();

  $("submit").on("click", (e) => {
    e.preventDefault();
    getCity();
    search();
    $("#city-input").val("");
    listCities();
  });

  function saveLocalStorage() {
    localStorage.setItem("mostRecent", city);
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }

  function getCity() {
    city = $("#city-input").val();
    if (city && cities.includes(city) === false) {
      saveLocalStorage();
      return city;
    } else if (!city) {
      alert("Please enter a known city");
    }
  }

  function search() {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=metric&appid=b6c1b9c71f524e60115434d23567952d";
    let coords = [];

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      coords.push(response.coord.lat);
      coords.push(response.coord.lon);
      let cityName = response.name;
      let cityCond = response.weather[0].description.toUpperCase();
      let cityTemp = response.main.temp;
      let cityHum = response.main.humidity;
      let cityWind = response.wind.speed;
      let icon = response.weather[0].icon;
      $("#icon").html(
        `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
      );
      $("#city-name").html(cityName + " " + "(" + NowMoment + ")");
      $("#city-cond").text("Current Conditions: " + cityCond);
      $("#temp").text("Current Temp (F): " + cityTemp.toFixed(1));
      $("#humidity").text("Humidity: " + cityHum + "%");
      $("#wind-speed").text("Wind Speed: " + cityWind + "mph");
      $("#date1").text(day1);
      $("#date2").text(day2);
      $("#date3").text(day3);
      $("#date4").text(day4);
      $("#date5").text(day5);

      getUV(response.coord.lat, response.coord.lon);
    }).fail(function (){
      alert("Could not get data")
    });
    
    });
  }
});
