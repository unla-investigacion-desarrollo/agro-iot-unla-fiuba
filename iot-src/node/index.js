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
  console.log("Message: " + message.toString());
})

app.use(express.json());

app.get('/hello/', function(req, res, next) {
    res.send(JSON.stringify("hola gus")).status(200);
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});
