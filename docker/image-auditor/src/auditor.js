const dgram = require('dgram');

const protocol = require('../../protocol/musician-protocol');

const udpSocket = dgram.createSocket('udp4');

udpSocket.bind(protocol.PROTOCOL_PORT, () => {
  console.log('Joining multicast group');
  udpSocket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

udpSocket.on('message', (msg, source) => {
  console.log(`message : ${msg.toString}`);
  console.log(`source : address : ${source.address}, port : ${source.port}`);
});
