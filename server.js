const fs = require("fs");
const dgram = require("dgram");
const wav = require("wav");
const moment = require("moment");
const gar = require("gar");

const server = dgram.createSocket("udp4");

let currFileNum = 1;
let timeoutRunning = false;
let currFileEmpty = true;
let timeElapsed = 0;
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

function createFileWriter() {
	const date = moment().format("MMM-DD-YYYY_HH:mm:ss");
	const directory = process.platform === "win32" ? "recordings\\" : "recordings/"
	filename = `${directory}${date}.wav`;
	console.log(`Starting recording #${currFileNum} of ${maxFiles}, filename: ${filename}`);

	fileWriter = new wav.FileWriter(filename, {
		channels: 1,
		sampleRate: 48000,
		bitDepth: 16
	});

}

function handleTimeout() {
	fileWriter.end(function() {
		let timeElapsedSeconds = timeElapsed / 1000;
		// Reset timeElapsed regardless of what happens since we stored the necessary value in timeElapsedSeconds
		timeElapsed = 0;
		currFileEmpty = true;
		if (minDuration && timeElapsedSeconds < minDuration) {
			console.log(`Recording time shorter than minduration specified (${timeElapsedSeconds}/${minDuration}s), deleting`);
			fs.unlink(filename, function(err) {
			});
			return;
		}
		console.log(`Recording #${currFileNum} saved`)
		if (currFileNum < maxFiles) {
			currFileNum++;
		}
		else {
			server.close();
		}
	});
}

function startTimeout(timeout) {
	timeoutRunning = true;
	timeElapsed += Date.now() - recordStartTime;
	timeoutID = setTimeout(handleTimeout, timeout);
}

function cancelTimeout() {
	timeoutRunning = false;
	clearTimeout(timeoutID);
}

function handleArgs() {
	const args = gar(process.argv.slice(2));
	// timeout specified in minutes, convert to seconds
	timeout = args.timeout ? args.timeout * 1000 : 5000;
	maxFiles = args.maxfiles ? args.maxfiles : 5;
	minDuration = args.minduration ? args.minduration : 5;
	host = args.host ? args.host : "127.0.0.1";
	port = args.port ? args.port : 7355;
}

handleArgs();

server.on('listening', function () {
    const address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
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
    	startTimeout(timeout);
    }

});



server.bind(port, host);