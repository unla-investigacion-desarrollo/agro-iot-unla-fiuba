var PORT    = 3000;

var express = require('express');
require('dotenv').config();
var app     = express();
var utils   = require('./mysql-connector');

const mqtt = require('mqtt')
var options = {
                clientId: process.env.NODE_MQTT_CLIENT_ID,
                username: process.env.NODE_MQTT_USER,
                password: process.env.NODE_MQTT_PASS,
                clean: true
              };
const client  = mqtt.connect(process.env.NODE_MQTT_SERVER, options)

function insertMetric(value, metricType, sector) {
  toDay = new Date();
  toDayFormat = toDay.toLocaleString("es-ARG", {timeZone: "America/Argentina/Buenos_Aires"});
  toDayGMT = new Date(toDayFormat);
  utils.query('INSERT INTO `metric_reading` (`reading_date`, `value`, `value_type`, `metric_type_id`, `sector_id`) VALUES (?,?,?,?,?)',
    [toDayGMT, value, "porcentaje", metricType, sector],
    function(err, rta, field) {
      if (err) {
        return;
      }
    }
  );
}

client.on('connect', function () {
  client.subscribe('/metrics/#', function (err) {
    if (!err) {
      console.log("Connected to MQTT")
    }
  })
})

client.on('message', function (topic, message) {
  console.log("Topic: " + topic.toString());
  if(isJson(message.toString())) {
    const objResponse = JSON.parse(message.toString());
    if(objResponse.hasOwnProperty('ta')){
      console.log("Temperatura ambiente: " + objResponse.ta);
      insertMetric(objResponse.ta, 'ta', 1);
    }
    if(objResponse.hasOwnProperty('hr')){
      console.log("Temperatura ambiente: " + objResponse.hr);
      insertMetric(objResponse.hr, 'hr', 1);
    }
    if(objResponse.hasOwnProperty('hs')){
      console.log("Temperatura ambiente: " + objResponse.hs);
      insertMetric(objResponse.hs, 'hs', 1);
    }
  }
})

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    console.log("is not a Json value");
    return false;
  }
  return true;
}

app.use(express.json());

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});
