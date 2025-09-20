var PORT    = process.env.NODE_PORT;

require('dotenv').config();
var express = require('express');
const fetch = require('node-fetch');
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

const pronosticoURL = process.env.NODE_PRONOSTICOURL;

function insertMetric(values, sector) {
  toDay = new Date();
  toDayFormat = toDay.toLocaleString("es-ARG", {timeZone: "America/Argentina/Buenos_Aires"});
  toDayGMT = new Date(toDayFormat);
  utils.query('INSERT INTO `metric_reading`(`reading_date`, `ta_value`, `hr_value`, `hs_value`, `rain_forecast`, `irrigation`, `value_type`, `sector_id`) VALUES (?,?,?,?,?,?,?, (SELECT sector_id FROM sector WHERE centralizer_key = ?))',
    [toDayGMT, values.ta, values.hr, values.hs, values.lluviaProx, values.riego, "porcentaje", sector],
    function(err, rta, field) {
      if (err) {
          console.error("Error al insertar la métrica:", err);
          return;
        }console.log("Métrica insertada correctamente.");
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

client.on('message', async function (topic, message) {
  console.log("Topic: " + topic.toString());

  if (isJson(message.toString())) {
    const objResponse = JSON.parse(message.toString());

    // Extraer los datos (si no están, quedan como null)
    const ta = objResponse.ta != null ? objResponse.ta : null;
    const hr = objResponse.hr != null ? objResponse.hr : null;
    const hs = objResponse.hs != null ? objResponse.hs : null;
    console.log(`Datos recibidos - TA: ${ta}, HR: ${hr}, HS: ${hs}`);

    const centralizerKey = topic.split('/')[2]; // extrae ID sensor
    console.log("la key del sector="+centralizerKey);
    try {
      const analisis = await analisisMetricRange({ ta, hr, hs, centralizerKey});
      console.log("Resultado análisis:", analisis);
      var lluviaProx = analisis.lluviaProx;
      var riego = analisis.riego;
      console.log("Como estan los datos antes de ser guardados="+ta+" - "+hr+" - "+hs+" - "+lluviaProx+" - "+riego);
      insertMetric({ ta, hr, hs, lluviaProx, riego}, centralizerKey);

      if (analisis.riego) {
        // Si corresponde regar, publicamos mensaje MQTT con duración 30s
        //client.publish(`/metrics/${centralizerKey}`, '30');
        console.log("Orden de riego enviada por 30 segundos.");
      }
    } catch (error) {
      console.error("Error en análisis de métricas:", error);
    }
  }
});

async function lluviaProx(location) {
  try {
    const response = await fetch(`${pronosticoURL}?localidad=${location}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener datos de pronóstico:', error);
    return false;
  }
}

function analisisMetricRange(values) {
  const query = `
    SELECT mar.ta_start_value, mar.ta_end_value,
           mar.hr_start_value, mar.hr_end_value,
           mar.hs_start_value, mar.hs_end_value,
           g.location
    FROM sector s
    JOIN metric_acceptation_range mar ON s.metric_acceptation_range_id = mar.metric_acceptation_range_id
    JOIN garden g ON s.garden_id = g.garden_id
    WHERE s.centralizer_key = ?
  `;

  return new Promise((resolve, reject) => {
    utils.query(query, values.centralizerKey, async function (err, results) {
      if (err) {
        console.error("Error al consultar los rangos:", err);
        return reject(err);
      }
      if (results.length === 0) {
        console.warn("No se encontraron rangos para el sensor:", centralizerKey);
        return resolve({ lluviaProx: null, riego: false });
      }

      const range = results[0];
      let lluviaProxResultado = false;
      let riego = false;

      //Si humedad sustrato menor al valor de referencia o humedad sustrato promedio y temperatura alta
      if ((values.hs !== null && values.hs <= range.hs_start_value) || 
        (values.hs !== null && values.hs <= (range.hs_start_value + range.hs_end_value) / 2) && (values.ta !== null && values.ta >= range.ta_end_value)) {
        
        lluviaProxResultado = await lluviaProx(range.location);
        console.log("Como llega el response"+lluviaProxResultado);
        if (lluviaProxResultado) {
          console.log("Llueve en la próxima hora, no regar.");
          riego = false;
        } else {
          console.log("No llueve, activar riego.");
          riego = true;
        }
      } else {
        // Si no cumple condiciones para riego, no regar
        riego = false;
      }

      resolve({ lluviaProx: lluviaProxResultado, riego });
    });
  });

}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    console.log("is not a Json value");
    return false;
  }
  return true;
}

const rutaBase = process.env.NODE_PATH;

app.use(rutaBase, express.json());

app.get(`${rutaBase}/`, (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});
