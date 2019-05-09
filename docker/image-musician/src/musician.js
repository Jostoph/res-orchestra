let protocol = require('./musician-protocol');

let dgram = require('dgram');

let socket = dgram.createSocket('udp4');

class Musician {

    // TODO make class instrument ?
    constructor(instrument) {
        this.instrument = instrument;
    }

    play() {

        let soudPatern = "undefined"


        // check in map(instr-->sound)
        // send string ? json ?
    }

    // set interval
}

let instrument = process.argv[2];

let musician = new Musician(instrument);