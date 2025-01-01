
import express from 'express';
import path from 'path';
import { Controller, LightParams } from './controller.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

const controller = new Controller();
await controller.open();

// Serve static files from the /static directory
app.use(express.static(path.join(__dirname, 'static')));

// use the express.json() middleware to parse JSON request bodies
app.use(express.json());

// Handle POST requests to /light
app.post('/light', (req, res) => {
  const { deviceId, hue, saturation, angle } = req.body;

  if(hue !== undefined) {
    controller.sendLight(deviceId, LightParams.Hue, hue);
  } else if(saturation !== undefined) {
    controller.sendLight(deviceId, LightParams.Saturation, saturation);
  } else if(angle !== undefined) {
    const ledArray = new Array(26);
    for (let i = 0; i < ledArray.length; i++) {
      if(angle === 0 || i === angle - 1){
        ledArray[i] = 255;
      } else {
        ledArray[i] = 0;
      }
    }

    controller.sendLight(deviceId, LightParams.Value, ledArray);
  }

  res.send('OK');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
