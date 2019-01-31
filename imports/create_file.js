const wav = require("wav");
const moment = require("moment");


const createFileName = (dateFmt) => {
	const date = moment().format(dateFmt);
	const directory = process.platform === "win32" ? "recordings\\" : "recordings/";
	return `${directory}${date}.wav`;
}

const createFileWriter = (fileName) => {
	return new wav.FileWriter(fileName, {
		channels: 1,
		sampleRate: 48000,
		bitDepth: 16
	});
}

const createFile = (dateFmt, maxFiles, currFileNum) => {
	const fileName = createFileName(dateFmt);
	console.log(` * Starting recording #${currFileNum}/${maxFiles}, filename: ${fileName}`);
	return {
		timeoutRunning: false,
		millisElapsed: 0,
		recordStartTime: Date.now(),
		name: fileName,
		writer: createFileWriter(fileName)
	}
}

module.exports = createFile;
