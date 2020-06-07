const { join } = require("path");
const { FileWriter } = require("wav");
const moment = require("moment");

const createFile = (options, currFileNum) => {
	const { dateFmt, maxFiles } = options;
	const fileName = join("recordings", `${moment().format(dateFmt)}.wav`);
	console.log(`* Starting recording #${currFileNum}/${maxFiles}, filename: ${fileName}`);
	return {
		timeoutRunning: false,
		millisElapsed: 0,
		recordStartTime: Date.now(),
		name: fileName,
		writer: new FileWriter(fileName, {
			channels: 1,
			sampleRate: 48000,
			bitDepth: 16
		})
	}
}

module.exports = createFile;