const { join } = require("path");
const { FileWriter } = require("wav");
const moment = require("moment");

const createFile = (options, currFileNum) => {
	const { dateFmt, maxFiles, sampleRate, channels, bitDepth } = options;
	const fileName = join("recordings", `${moment().format(dateFmt)}.wav.temp`);
	console.log(`* Starting recording #${currFileNum}/${maxFiles}, filename: ${fileName}`);
	return {
		timeoutRunning: false,
		millisElapsed: 0,
		recordStartTime: Date.now(),
		name: fileName,
		writer: new FileWriter(fileName, { channels, sampleRate, bitDepth })
	}
}

module.exports = createFile;