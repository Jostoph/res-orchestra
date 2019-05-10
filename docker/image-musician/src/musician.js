const dgram = require('dgram');
const uuid = require('uuid/v1');
const protocol = require('./protocol/orchestra-protocol');

// udp socket to send sound datagrams
const socket = dgram.createSocket('udp4');

// <instrument - sound> mapping
const instruments = new Map();
instruments.set('piano', 'ti-ta-ti');
instruments.set('trumpet', 'pouet');
instruments.set('flute', 'trulu');
instruments.set('violin', 'gzi-gzi');
instruments.set('drum', 'boum-boum');

/**
 * Class Musician
 * Represents a musician with an instrument
 */
class Musician {
  constructor(instrument) {
    // if the instrument is invalid, abortion
    if (!instruments.has(instrument)) {
      throw Error(`error : invalid instrument : ${instrument}`);
    }

    // creation of a new uuid
    this.id = uuid();
    this.instrument = instrument;
    // play the instrument every second
    setInterval(this.play.bind(this), 1000);
  }

  // function to "play the instrument"
  // sending a datagram in the network
  play() {
    const music = {
      id: this.id,
      sound: instruments.get(this.instrument),
    };
    const payload = JSON.stringify(music);

    const message = Buffer.from(payload);
    socket.send(message, 0, message.length, protocol.PROTOCOL_UDP_PORT,
      protocol.PROTOCOL_MULTICAST_ADDRESS,
      (err, bytes) => {
        // console.log(`Sending payload: ${payload} via port ${socket.address().port}`);
      });
  }
}

// get instrument from args
const instrument = process.argv[2];

try {
  // instance of a new Musician
  let m = new Musician(instrument);
} catch (error) {
  console.log(error);
}
