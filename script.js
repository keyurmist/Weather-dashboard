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
});
