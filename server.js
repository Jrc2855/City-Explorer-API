'use strict';

console.log('Proof of life');


//-----Requires-----//
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

// DON'T FORGET TO REQUIRE YOUR START JSON FILE
// let data = require('./data/weather.json');

//-----Once express is in we need to use it - per express doc-----//
// app === server
const app = express();

//-----MIDDLEWARE-----//
// cors is middleware - security guard that allows us to share resources across the internet
app.use(cors());


//-----Define a port for my server to run on-----//
const PORT = process.env.PORT || 3002;

//-----ENDPOINTS-----//

//-----Base endpoint - proof of life-----//
// 1st argument - endpoint in quotes
// 2nd arg - callback which will execute when someone hits that point

// Callback function - 2 parameters: request, response (req,res)
app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server');
});



app.get('/hello', (request, response) => {
  console.log(request.query);

  let firstName = request.query.firstName;
  let lastName = request.query.lastName;

  response.status(200).send(`Hello ${firstName} ${lastName}! Welcome to my server!`)
})

app.get('/location', async(request, response, next) => {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery.toLowerCase();
    let url = `https://us1.locationiq.com/v1/search.php?
    key=${process.env.REACT_APP_LOCATIONIQ_API_KEY}&q=${this.state.city}&format=json`
    let foundCityObj = await axios.get(url);
    let cityArray = foundCityObj.data.map(day => new Forecast(day));
    console.log('this is my city array', cityArray);

    response.status(200).send(cityArray);

  } catch (error) {
  } next(error);
})

class Forecast {
  constructor(forecastObj) {
    this.date = forecastObj.datetime
    this.description = forecastObj.weather.description
  }
}

app.get('/weather', async (request, response, next) => {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery.toLowerCase();
    let url = `https://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.REACT_APP_WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=3`;
    let weatherURL = await axios.get(url);
    console.log(weatherURL.data);
    // let foundCityWeather = weatherURL.data.find(weatherDay=>weatherDay.city_name === searchQuery);
    let weatherArray = weatherURL.data.data.map(day => new Forecast(day));
    console.log(weatherArray);
  
    response.status(200).send(weatherArray);

  } catch (error) {
    next (error);
  }
})

// CATCH ALL ENDPOINT - NEEDS TO BE YOUR LAST DEFINED ENDPOINT
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist')
})


// ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
})



//-----SERVER START-----//
app.listen(PORT, () => console.log(`We are running on port ${PORT}`));
