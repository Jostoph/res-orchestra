const dgram = require('dgram');
const net = require('net');

const protocol = require('../../protocol/orchestra-protocol');

const udpSocket = dgram.createSocket('udp4');
const server = net.createServer()

const clients = []

server.listen(protocol.PROTOCOL_TCP_PORT, 'localhost', () => {
  console.log('TCP server is running...');
});

server.on('connection', (socket) => {
  console.log(`Connection from add: ${socket.remoteAddress} port: ${socket.remotePort}`);

  clients.push(socket);

  const musicianList = []
  let obj;
  for(let entry of musicians.entries()) {
    obj = {
      uuid : entry[0],
      instrument : entry[1].instrument,
      activeSince : entry[1].activeSince
    };
    musicianList.push(obj);
  }

  const msg = JSON.stringify(musicianList);
  socket.write(msg);
  socket.write('\r\n');
  socket.end();
  
  clients.splice(clients.indexOf(socket), 1);
});

const sounds = new Map();
sounds.set('ti-ta-ti', 'piano');
sounds.set('pouet', 'trumpet');
sounds.set('trulu', 'flute');
sounds.set('gzi-gzi', 'violin');
sounds.set('boum-boum', 'drum');

class MusicianInfo {
  constructor(instrument) {
    this.instrument = instrument;
    this.activeSince = new Date();
  }
}

const musicians = new Map();

udpSocket.bind(protocol.PROTOCOL_UDP_PORT, () => {
  console.log('Joining multicast group');
  udpSocket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

function removeInactiveMusicians() {
  let currentDate = new Date();
  for(let entry of musicians.entries()) {
    if (currentDate.getTime() - entry[1].activeSince.getTime() > 5000) {
      musicians.delete(entry[0]);
    }
  }
}

setInterval(removeInactiveMusicians, 1000);

udpSocket.on('message', (msg, source) => {
  const obj = JSON.parse(msg);
  const { id, sound } = obj;

  if (musicians.has(id)) {
    musicians.get(id).activeSince = new Date();
  } else {
    musicians.set(id, new MusicianInfo(sounds.get(sound)));
  }

  console.log(musicians);
});
