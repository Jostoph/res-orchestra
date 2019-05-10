const dgram = require('dgram');
const net = require('net');

// ports and addresses for servers
const protocol = require('./protocol/orchestra-protocol');

// udp socket to get musician datagrams
const udpSocket = dgram.createSocket('udp4');
// tcp server to send musician list to client
const server = net.createServer();

// connected client list
const clients = [];

// listen for clients on protocol specified port
server.listen(protocol.PROTOCOL_TCP_PORT, () => {
  console.log('TCP server is running...');
});

// on client connection
server.on('connection', (socket) => {
  console.log(`Connection from addr: ${socket.remoteAddress} port: ${socket.remotePort}`);

  // add client to socket list
  clients.push(socket);

  // construct payload with musicians list
  const musicianList = [];
  let obj;
  for (let entry of musicians.entries()) {
    obj = {
      uuid : entry[0],
      instrument : entry[1].instrument,
      activeSince : entry[1].activeSince
    };
    musicianList.push(obj);
  }

  const msg = JSON.stringify(musicianList);
  // send datagram to client
  socket.write(msg);
  socket.write('\r\n');
  // close connection
  socket.end();
  console.log(`Closed connection with addr: ${socket.remoteAddress} port: ${socket.remotePort}`);

  // remove client from connceted clients list
  clients.splice(clients.indexOf(socket), 1);
});

// <sound - instrument> mapping
const sounds = new Map();
sounds.set('ti-ta-ti', 'piano');
sounds.set('pouet', 'trumpet');
sounds.set('trulu', 'flute');
sounds.set('gzi-gzi', 'violin');
sounds.set('boum-boum', 'drum');

/**
 * Class MusicianInfo
 * Represents the informations of an active musician
 */
class MusicianInfo {
  constructor(instrument) {
    this.instrument = instrument;
    this.activeSince = new Date(); // first activation date
    this.lastActivation = this.activeSince; // date of last sound received
  }
}

// active musician map
const musicians = new Map();

// joining the multicast group
udpSocket.bind(protocol.PROTOCOL_UDP_PORT, () => {
  console.log('Joining multicast group');
  udpSocket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

// function to scan musician's map and remove inactive musicians
function removeInactiveMusicians() {
  let currentDate = new Date();
  for(let entry of musicians.entries()) {
    if (currentDate.getTime() - entry[1].lastActivation.getTime() > 5000) {
      musicians.delete(entry[0]);
    }
  }
}

// call musician removal with set interval
setInterval(removeInactiveMusicians, 1000);

// handler for musician messages
udpSocket.on('message', (msg, source) => {
  const obj = JSON.parse(msg);
  const { id, sound } = obj;

  // if the musician is in the map, update his last activation
  // else add him to map
  if (musicians.has(id)) {
    musicians.get(id).lastActivation = new Date();
  } else {
    musicians.set(id, new MusicianInfo(sounds.get(sound)));
  }

  // console.log(musicians);
});
