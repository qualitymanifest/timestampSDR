const gar = require("gar");
const { red } = require("colors/safe");
const config = require("../config.js");

const defaultOptions = {
	timeout:     {val: 5,           src: "DEFAULT"},
	minDuration: {val: 5,           src: "DEFAULT"},
	maxFiles:    {val: 5,           src: "DEFAULT"},
	dateFmt:     {val: "datetime",  src: "DEFAULT"},
	sampleRate:  {val: 48000,       src: "DEFAULT"},
	channels:    {val: 1,           src: "DEFAULT"},
	bitDepth:    {val: 16,          src: "DEFAULT"},
	host:        {val: "127.0.0.1", src: "DEFAULT"},
	port:        {val: 7355,        src: "DEFAULT"},
};

const dateFmtOptions = (dateFmt) => {
	if (dateFmt === "datetime") {
		// Although colons would be preferable for time delimiters, Windows and MacOS do not allow them
		return "MMM-DD-YYYY_HH-mm-ss";
	}
	if (dateFmt === "unix") {
		return "x";
	}
	return dateFmt;
}

const isNumInvalid = ({ num, min, max, isInt }) => {
	return isNaN(num) ||
		(typeof min === "number" && num < min) ||
		(typeof max === "number" && num > max) ||
		(isInt && !Number.isInteger(num));
}

const wasInvalid = (option, key, message) => {
	console.log(red.bold(`${option.src} option provided for ${key} (${option.val}) is invalid: ${message}. Using default.`));
	return true;
}

const isOptionInvalid = (option, key) =>{
	const val = option.val;
	if (key === "timeout" && isNumInvalid({ num: val, min: 0.1 })) {
		return wasInvalid(option, key, "Must be a positive number");
	}
	if (key === "minDuration" && isNumInvalid({ num: val, min: 0 })) {
		return wasInvalid(option, key, "Must be a non-negative number");
	}
	if (key === "maxFiles" && isNumInvalid({ num: val, min: 1, isInt: true })) {
		return wasInvalid(option, key, "Must be a positive integer");
	}
	if (key === "port" && isNumInvalid({ num: val, min: 1, max: 65535, isInt: true })) {
		return wasInvalid(option, key, "Must be an integer between 1 and 65535");
	}
	if (key === "sampleRate" && isNumInvalid({ num: val, min: 1, max: 4300000000, isInt: true, })) {
		return wasInvalid(option, key, "Must be an integer between 1 and 4300000000");
	}
	if (key === "channels" && isNumInvalid({ num: val, min: 1, max: 65535, isInt: true })) {
		return wasInvalid(option, key, "Must be an integer between 1 and 65535");
	}
	if (key === "bitDepth" && isNumInvalid({ num: val, min: 4, max: 32, isInt: true })) {
		return wasInvalid(option, key, "Must be an integer between 4 and 32");
	}
	return false;
}

const useArgsOrConfig = (args) => {
	const parsedOptions = { ...defaultOptions };
	for (let key of Object.keys(parsedOptions)) {
		// Command line arguments take precedence over config variables
		const argsOption = args[key]
		const configOption = config[key];
		if (argsOption !== undefined) {
			const potentialOption = { val: argsOption, src: "ARGUMENTS" };
			if (!isOptionInvalid(potentialOption, key)) {
				parsedOptions[key] = potentialOption;
			}
		}
		else if (configOption !== undefined) {
			const potentialOption = { val: configOption, src: "CONFIG" };
			if (!isOptionInvalid(potentialOption, key)) {
				parsedOptions[key] = potentialOption;
			}
		}
	}
	return parsedOptions;
}

const printOptions = (finalOptions) => Object.keys(finalOptions).map((key) => {
	const option = finalOptions[key];
	console.log(`${key}: ${option.val}, Source: ${option.src}`);
});

const handleOptions = () => {
	const args = gar(process.argv.slice(2));
	const finalOptions = useArgsOrConfig(args);
	if (args.p) {
		printOptions(finalOptions);
	}
	// Only needed option.src for printing purposes, so each option should just contain it's value now
	Object.keys(finalOptions).map(key => finalOptions[key] = finalOptions[key].val);
	// timeout specified in seconds, convert to milliseconds
	// minDuration should be kept as seconds for printing when file is too short
	finalOptions.timeout *= 1000;
	finalOptions.dateFmt = dateFmtOptions(finalOptions.dateFmt)
	return finalOptions;
}

module.exports = handleOptions;
