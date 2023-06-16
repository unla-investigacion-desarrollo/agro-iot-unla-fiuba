var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://192.168.0.2')

client.on('connect', function () {
  client.subscribe('/metrics/#', function (err) {
    if (!err) {
      console.log("Connected to MQTT")
    }
  })
})

client.on('message', function (topic, message) {
  console.log("Topic: " + topic.toString());
  const objResponse = JSON.parse(message.toString());
  if(objResponse.hasOwnProperty('ta')){
    console.log("Temperatura ambiente: " + objResponse.ta);
    utils.query('INSERT INTO `metric_reading` (`reading_date`, `value`, `value_type`, `metric_type_id`, `sector_id`) VALUES (?,?,?,?,?)',
      ["2020-10-10", objResponse.ta, "porcentaje", "ta", 1],
      function(err, rta, field) {
        if (err) {
          return;
        }
      }
    );
  }
  if(objResponse.hasOwnProperty('hr')){
    console.log("Temperatura ambiente: " + objResponse.hr);
    utils.query('INSERT INTO `metric_reading` (`reading_date`, `value`, `value_type`, `metric_type_id`, `sector_id`) VALUES (?,?,?,?,?)',
      ["2020-10-10", objResponse.hr, "porcentaje", "hr", 1],
      function(err, rta, field) {
        if (err) {
          return;
        }
      }
    );
  }
  if(objResponse.hasOwnProperty('hs')){
    console.log("Temperatura ambiente: " + objResponse.hs);
    utils.query('INSERT INTO `metric_reading` (`reading_date`, `value`, `value_type`, `metric_type_id`, `sector_id`) VALUES (?,?,?,?,?)',
      ["2020-10-10", objResponse.hs, "porcentaje", "hs", 1],
      function(err, rta, field) {
        if (err) {
          return;
        }
      }
    );
  }
})

app.use(express.json());

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});
