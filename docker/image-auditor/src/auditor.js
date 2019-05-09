const dgram = require('dgram');
const net = require('net');
const uuid = require('uuid');

let musicians = [];

class MusicianInfo {
  constructor(port, address, instrument) {

  }
}

const protocol = require('../../protocol/orchestra-protocol');

const udpSocket = dgram.createSocket('udp4');

udpSocket.bind(protocol.PROTOCOL_UDP_PORT, () => {
  console.log('Joining multicast group');
  udpSocket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

udpSocket.on('message', (msg, source) => {
  console.log(`message : ${msg}`);
  console.log(`source : address : ${source.address}, port : ${source.port}`);
});
