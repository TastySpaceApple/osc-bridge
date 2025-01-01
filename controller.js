import { SerialPort } from "serialport";

const deviceName = 'CH340';
const baudRate = 115200;

export const LightParams = {
  Hue: 1,
  Saturation: 2,
  Value: 3,
}


export class Controller {
  constructor() {
    this.isConnected = false;
  }

  async open() {
    const ports = await SerialPort.list();

    const path = ports.find((port) => port.friendlyName.includes(deviceName));

    if(!path) return;

    this.port = new SerialPort({
      baudRate,
      path
    });

    return new Promise((resolve, reject) => {
      this.port.on('open', () => {
        this.isConnected = true;
        resolve();
      });
    });
  }

  sendLight(deviceId, controlType, values) {
    let msg;
    if(values instanceof Array){
      msg = [1, deviceId, controlType, ...values];
    } else {
      msg = [1, deviceId, controlType, values];
    }

    console.log(msg);
    
    if(!this.isConnected) return;

    this.port.write(msg);
  }
}