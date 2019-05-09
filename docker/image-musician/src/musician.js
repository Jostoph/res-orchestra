const dgram = require('dgram');
const protocol = require('./musician-protocol');

const socket = dgram.createSocket('udp4');

const instruments = new Map();
instruments.set('piano', 'ti-ta-ti');
instruments.set('trumpet', 'pouet');
instruments.set('flute', 'trulu');
instruments.set('violin', 'gzi-gzi');
instruments.set('drum', 'boum-boum');

class Musician {
  constructor(instrument) {
    if (!instruments.has(instrument)) {
      throw Error(`error : invalid instrument : ${instrument}`);
    }

    this.instrument = instrument;
    setInterval(this.play.bind(this), 1000);
  }

  play() {
    const music = {
      sound: instruments.get(this.instrument),
    };
    const payload = JSON.stringify(music);

    const message = Buffer.from(payload);
    socket.send(message, 0, message.length, protocol.PROTOCOL_PORT,
      protocol.PROTOCOL_MULTICAST_ADDRESS,
      (err, bytes) => {
        console.log(`Sending payload: ${payload} via port ${socket.address().port}`);
      });
  }
}

const instrument = process.argv[2];

try {
  Musician(instrument);
} catch (error) {
  console.log(error);
}
