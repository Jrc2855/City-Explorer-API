'use strict';

console.log('Proof of life');


//-----Requires-----//
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const weather = require('./data/weather.json');

// DON'T FORGET TO REQUIRE YOUR START JSON FILE
let data = require('./data/weather.json');

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


app.get('/', (request, response)=>{
  response.status(200).send('Welcome to my server');
});

app.get('/hello', (request, response) =>{
  console.log(request.query);

  let firstName = request.query.firstName;
  let lastName = request.query.lastName;

  response.status(200).send(`Hello ${firstName} ${lastName}! Welcome to my server!`)
})

app.get('/weather', (request, response, next) =>{
  let lat = request.query.lat;
  let lon = request.query.lon;
  let searchQuery = request.query.searchQuery.toLowerCase();
  let foundCityObj = data.find(city => city.city_name.toLowerCase() === searchQuery);
  let weatherArray = foundCityObj.data.map(day => new Forecast(day));

  response.status(200).send(weatherArray);
})


// app.get('/pet', (request, response, next)=>{
//   try {
//     let species = request.query.species;

//     let dataToGroom = data.find(pet => pet.species === species);
//     let dataToSend = new Pet(dataToGroom);

//     response.status(200).send(dataToSend);

//   } catch(error){
//     next(error);
//   }
// })
class Forecast{
  constructor(forecastObj){
    this.date = forecastObj.datetime
    this.description = forecastObj.weather.description
  }
}
// class Pet{
//   constructor(petObj){
//     this.name = petObj.name
//     this.breed = petObj.breed
//   }
// }


app.get('*', (request, response)=>{
  response.status(404).send('This page does not exist')
})

// ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS
app.use((error, request, response, next)=>{
  response.status(500).send(error.message);
})



//-----SERVER START-----//
app.listen(PORT, ()=>console.log(`We are running on port ${PORT}`));
