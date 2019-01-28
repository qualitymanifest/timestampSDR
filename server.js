const fs = require("fs");
const dgram = require("dgram");
const wav = require("wav");
const moment = require("moment");
const gar = require("gar");

const server = dgram.createSocket("udp4");

let currFileNum = 1;
let currFileEmpty = true;
let timeoutRunning = false;
let millisElapsed = 0;
let recordStartTime;
let timeoutID;
let fileWriter;
let fileName;
// declare command line args:
let minDuration;
let timeout;
let maxFiles;
let port;
let host;


const createFileWriter = () => {
	const date = moment().format("MMM-DD-YYYY_HH:mm:ss");
	const directory = process.platform === "win32" ? "recordings\\" : "recordings/"
	filename = `${directory}${date}.wav`;
	console.log(` * Starting recording #${currFileNum} of ${maxFiles}, filename: ${filename}`);
	fileWriter = new wav.FileWriter(filename, {
		channels: 1,
		sampleRate: 48000,
		bitDepth: 16
	});
}

const handleTimeout = () => {
	fileWriter.end(() => {
		let secondsElapsedTotal = millisElapsed / 1000;
		// Reset millisElapsed regardless of what happens since we stored the necessary value in secondsElapsedTotal
		millisElapsed = 0;
		currFileEmpty = true;
		if (minDuration && secondsElapsedTotal < minDuration) {
			console.log(`   -- Recording time shorter than minduration specified (${secondsElapsedTotal}/${minDuration}s), deleting`);
			fs.unlink(filename, err => {
			});
			return;
		}
		console.log(`   ++ Recording #${currFileNum} saved`)
		if (currFileNum < maxFiles) {
			currFileNum++;
		}
		else {
			server.close();
		}
	});
}

const startTimeout = () => {
	timeoutRunning = true;
	millisElapsed += Date.now() - recordStartTime;
	timeoutID = setTimeout(handleTimeout, timeout);
}

const cancelTimeout = () => {
	timeoutRunning = false;
	clearTimeout(timeoutID);
}

const handleArgs = () => {
	const args = gar(process.argv.slice(2));
	// timeout specified in minutes, convert to seconds
	timeout = args.timeout ? args.timeout * 1000 : 5000;
	maxFiles = args.maxfiles ? args.maxfiles : 5;
	minDuration = args.minduration ? args.minduration : 5;
	host = args.host ? args.host : "127.0.0.1";
	port = args.port ? args.port : 7355;
}

handleArgs();

server.on('listening', () => {
    const address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', (message, remote) => {
    const readableMessage = message.readInt16LE();

    if (readableMessage !== 0) {
    	if (currFileEmpty || timeoutRunning) {
    		recordStartTime = Date.now();
    	}
    	if (currFileEmpty) {
    		createFileWriter();
    		currFileEmpty = false;
    	}
    	if (timeoutRunning) {
    		cancelTimeout();
    	}
    	fileWriter.write(message);
    }
    // Don't start multiple timeouts
    // Don't start a timeout if the file doesn't have anything written to it yet
    else if (!timeoutRunning && !currFileEmpty) {
    	startTimeout();
    }

});



server.bind(port, host);