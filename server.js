const fs = require("fs");
const dgram = require("dgram");
const handleArgs = require("./imports/handle_args");
const createFile = require("./imports/create_file");

const server = dgram.createSocket("udp4");
const args = handleArgs();
let currFileNum = 1;
let timeoutID;
let file;

const startTimeout = () => {
	file.timeoutRunning = true;
	file.millisElapsed += Date.now() - file.recordStartTime;
	timeoutID = setTimeout(handleTimeout, args.timeout);
}

const cancelTimeout = () => {
	file.timeoutRunning = false;
	file.recordStartTime = Date.now();
	clearTimeout(timeoutID);
}

const handleTimeout = () => {
	file.writer.end(() => {
		const secondsElapsedTotal = file.millisElapsed / 1000;
		if (args.minDuration && secondsElapsedTotal < args.minDuration) {
			console.log(`   -- Recording time shorter than minduration specified (${secondsElapsedTotal}/${args.minDuration}s), deleting`);
			fs.unlink(file.name, err => {
			});
		}
		else {
			console.log(`   ++ Recording #${currFileNum} saved`)
			if (currFileNum < args.maxFiles) {
				currFileNum++;
			}
			else {
				server.close();
			}
		}
		// Reset file so that can be detected and a new file created on next message receipt
		// Could recreate here but that would require initializing name, writer, and recordStartTime separately 
		file = null;
	});
}

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
    const readableMessage = message.readInt16LE();
    if (readableMessage !== 0) {
    	if (!file) {
    		file = createFile(args.dateFmt, args.maxFiles, currFileNum);
    	}
    	else if (file.timeoutRunning) {
    		cancelTimeout();
    	}
    	file.writer.write(message);
    }
    // Make sure file exists, and don't start multiple timeouts
    else if (file && !file.timeoutRunning) {
    	startTimeout();
    }
});


server.bind(args.port, args.host);