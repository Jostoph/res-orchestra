# res-orchestra

RES - 2019 - Orchestra

## Task 1: design the application architecture and protocols

| #  | Topic |
| --- | --- |
|Question | How can we represent the system in an **architecture diagram**, which gives information both about the Docker containers, the communication protocols and the commands? |
| | *Insert your diagram here...* |
|Question | Who is going to **send UDP datagrams** and **when**? |
| | The musicians are going to send the "sounds" (datagrams) every seconds. |
|Question | Who is going to **listen for UDP datagrams** and what should happen when a datagram is received? |
| | The auditors are listening for the UDP datagrams, when they receive one they look in their *musician map* to see if it is an unknown musician that needs to be added or an old one that needs to be updated. If the musician is in the list, his *lastActivation* field will be updated with the current date. |
|Question | What **payload** should we put in the UDP datagrams? |
| | The uuid of the musician and the sound it makes. |
|Question | What **data structures** do we need in the UDP sender and receiver? When will we update these data structures? When will we query these data structures? |
| | We need an <instrument - sound> mapping in both, and a <uuid - (instrument, activeSince, lastActivation)> mapping in the auditor. The map with the uuid keys will be updated at each sound received and read when a client connects to the auditor. |

## Task 2: implement a "musician" Node.js application

| #  | Topic |
| ---  | --- |
|Question | In a JavaScript program, if we have an object, how can we **serialize it in JSON**? |
| | `JSON.stringify(object)`  |
|Question | What is **npm**?  |
| | Node package Manager  |
|Question | What is the `npm install` command and what is the purpose of the `--save` flag?  |
| | The `npm install` function retrieves the modules defined in the *package.json* file from the Node project. The `--save` option is used to add the name (and version) of the module to install in the *package.json* file. Without it is only added to the local *node_modules* folder. |
|Question | How can we use the `https://www.npmjs.com/` web site?  |
| | We can find usefull modules on it and add them to our projects by installing them. |
|Question | In JavaScript, how can we **generate a UUID** compliant with RFC4122? |
| | Use the uuid module and generate a new id with the `uuid()` function. |
|Question | In Node.js, how can we execute a function on a **periodic** basis? |
| | We can use the `setInterval(function, ms)` function. |
|Question | In Node.js, how can we **emit UDP datagrams**? |
| | By calling the `send(message, offset, length, port, address, callback)` on an udp socket. |
|Question | In Node.js, how can we **access the command line arguments**? |
| | We can access them using the `process.argv[i]` instruction. The arguments are stored starting at index i = 2. |

## Task 3: package the "musician" app in a Docker image

| #  | Topic |
| ---  | --- |
|Question | How do we **define and build our own Docker image**?|
| | We create a custom *Dockerfile*, and build it with `docker build`. |
|Question | How can we use the `ENTRYPOINT` statement in our Dockerfile?  |
| | When running the container we can add arguments to the command that will be set as arguments of the `ENTRYPOINT`. |
|Question | After building our Docker image, how do we use it to **run containers**?  |
| | `docker run docker_image` |
|Question | How do we get the list of all **running containers**?  |
| | `docker ps`  |
|Question | How do we **stop/kill** one running container?  |
| | `docker kill containr_name`  |
|Question | How can we check that our running containers are effectively sending UDP datagrams?  |
| | We can use *wireshark* or print logs to a console. |

## Task 4: implement an "auditor" Node.js application

| #  | Topic |
| ---  | ---  |
|Question | With Node.js, how can we listen for UDP datagrams in a multicast group? |
| | `udpSocket.bind(port, () => {udpSocket.addMembership(multicast_address);});`  |
|Question | How can we use the `Map` built-in object introduced in ECMAScript 6 to implement a **dictionary**?  |
| | `const instruments = new Map(); instruments.set('piano', 'ti-ta-ti');` |
|Question | How can we use the `Moment.js` npm module to help us with **date manipulations** and formatting?  |
| | [momentjs.com](https://momentjs.com/) |
|Question | When and how do we **get rid of inactive players**?  |
| | Every x seconds we can check in the active musicians map and remove musicians that have a *lastActivation* field that more that 5 sec before the current time. |
|Question | How do I implement a **simple TCP server** in Node.js?  |
| | With the *net* module,`const server = net.createServer(); server.listen(port, () => {}); server.on('connection', (socket) => {});` |

## Task 5: package the "auditor" app in a Docker image

| #  | Topic |
| ---  | --- |
|Question | How do we validate that the whole system works, once we have built our Docker image? |
| | By executing the *validate.sh* file (`./validate.sh`). |
