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
    })
      .then(function (response) {
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
      })
      .fail(function () {
        alert("Could not get data");
      });

    function getUV(lat, lon) {
      $.ajax({
        url:
          "https://api.openweathermap.org/data/3.0/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&exclude=minutely,hourly" +
          "&units=metric&appid=b6c1b9c71f524e60115434d23567952d",
        method: "GET",
      }).then(function (response) {
        let uvIndex = response.current.uvi;
        $("#uv-index").text("UV Index:" + " " + uvIndex);
        if (uvIndex >= 8) {
          $("#uv-index").css("color", "red");
        } else if (uvIndex > 4 && uvIndex < 8) {
          $("#uv-index").css("color", "yellow");
        } else {
          $("#uv-index").css("color", "green");
        }
        let cityHigh = response.daily[0].temp.max;
        $("#high").text("Expected high (F): " + " " + cityHigh);

        let day1temp = response.daily[1].temp.max;
        let day2temp = response.daily[2].temp.max;
        let day3temp = response.daily[3].temp.max;
        let day4temp = response.daily[4].temp.max;
        let day5temp = response.daily[5].temp.max;

        let day1hum = response.daily[1].humidity;
        let day2hum = response.daily[2].humidity;
        let day3hum = response.daily[3].humidity;
        let day4hum = response.daily[4].humidity;
        let day5hum = response.daily[5].humidity;

        let icon1 = response.daily[1].weather[0].icon;
        let icon2 = response.daily[2].weather[0].icon;
        let icon3 = response.daily[3].weather[0].icon;
        let icon4 = response.daily[4].weather[0].icon;
        let icon5 = response.daily[5].weather[0].icon;

        $("#temp1").text("Temp(F):" + " " + day1temp.toFixed(1));
        $("#temp2").text("Temp(F):" + " " + day2temp.toFixed(1));
        $("#temp3").text("Temp(F):" + " " + day3temp.toFixed(1));
        $("#temp4").text("Temp(F):" + " " + day4temp.toFixed(1));
        $("#temp5").text("Temp(F):" + " " + day5temp.toFixed(1));

        $("#hum1").text("Hum:" + " " + day1hum + "%");
        $("#hum2").text("Hum:" + " " + day2hum + "%");
        $("#hum3").text("Hum:" + " " + day3hum + "%");
        $("#hum4").text("Hum:" + " " + day4hum + "%");
        $("#hum5").text("Hum:" + " " + day5hum + "%");

        $("#icon1").html(
          `<img src="http://openweathermap.org/img/wn/${icon1}@2x.png">`
        );
        $("#icon2").html(
          `<img src="http://openweathermap.org/img/wn/${icon2}@2x.png">`
        );
        $("#icon3").html(
          `<img src="http://openweathermap.org/img/wn/${icon3}@2x.png">`
        );
        $("#icon4").html(
          `<img src="http://openweathermap.org/img/wn/${icon4}@2x.png">`
        );
        $("#icon5").html(
          `<img src="http://openweathermap.org/img/wn/${icon5}@2x.png">`
        );
      });
    }
  }

  function listCities() {
    $("#cityList").text("");
    cities.forEach((city) => {
      $("#cityList").prepend("<tr><tr>" + city + "</td></tr>");
    });
  }

  listCities();

  $(document).on("click", "td", (e) => {
    e.preventDefault();
    let listedCity = $(e.target).text();
    city = listedCity;
    search();
  });
});
