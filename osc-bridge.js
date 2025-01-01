import OSC from 'osc-js';
import { Controller } from './controller.js';

const config = { udpClient: { port: 6000 } }
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) })

osc.open() // start a WebSocket server on port 8080

const controller = new Controller();
await controller.open();

// on message
osc.on('/light', message => {
  const {
    deviceId, lightParam, value
  } = message.args;

  controller.sendLight(deviceId, lightParam, value);
})
