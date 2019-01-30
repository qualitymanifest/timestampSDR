const gar = require("gar");
const moment = require("moment");
const red = require("colors/safe").red;

const defaultOptions = {
	timeout:     {val: 5,                      name: "TIMEOUT",     src: "DEFAULT"},
	minDuration: {val: 5,                      name: "MINDURATION", src: "DEFAULT"},
	maxFiles:    {val: 5,                      name: "MAXFILES",    src: "DEFAULT"},
	dateFmt:     {val: "MMM-DD-YYYY_HH:mm:ss", name: "DATEFMT",     src: "DEFAULT"},
	host:        {val: "127.0.0.1",            name: "HOST",        src: "DEFAULT"},
	port:        {val: 7355,                   name: "PORT",        src: "DEFAULT"},
};

const dateFmtOptions = (dateFmt) => {
	if (dateFmt === "datetime") {
		return "MMM-DD-YYYY_HH:mm:ss"
	}
	if (dateFmt === "unix") {
		return "x";
	}
	return dateFmt;
}

const isNumInvalid = (num, min, isInt) => {
	// Numeric env vars come in as strings, hence the conversion to Number inside isInteger()
	return isNaN(num) || num < min || (isInt && !Number.isInteger(Number(num)));
}

const warnMsg = (option, message) => {
	console.log(red.bold(`${option.src} option provided for ${option.name} (${option.val}) is invalid: ${message}. Using default.`));
}

const isOptionInvalid = (option) =>{
	const { val, name } = option;
	if (name === "TIMEOUT" && isNumInvalid(val, 0.1)) {
		warnMsg(option, "Must be a positive number");
		return true;
	}
	if (name === "MINDURATION" && isNumInvalid(val, 0)) {
		warnMsg(option, "Must be a non-negative number");
		return true;
	}
	if (name === "MAXFILES" && isNumInvalid(val, 1, true)) {
		warnMsg(option, "Must be a positive integer");
		return true;
	}
	if (name === "PORT" && (isNumInvalid(val, 1, true) || val > 65535)) {
		warnMsg(option, "Must be an integer between 1 and 65535");
		return true;
	}
	return false;
}

const useArgsOrEnv = (args, env, optionKeys) => {
	const parsedOptions = Object.assign({}, defaultOptions);
	for (let option of optionKeys) {
		// Command line arguments take precedence over environment variables
		// Option keys are camelcase for use in code, but uppercase in provided values
		let ucOption = option.toUpperCase();
		let argsOption = args[ucOption]
		let envOption = env[`TSDR_${ucOption}`]
		if (argsOption !== undefined) {
			const potentialOption = {val: argsOption, name: ucOption, src: "ARGS"}
			if (!isOptionInvalid(potentialOption)) {
				parsedOptions[option] = potentialOption;
			}
		}
		else if (envOption !== undefined) {
			const potentialOption = {val: envOption, name: ucOption, src: "ENV"}
			if (!isOptionInvalid(potentialOption)) {
				parsedOptions[option] = potentialOption;
			}
		}
	}
	return parsedOptions;
}

const printOptions = (finalOptions) => Object.keys(finalOptions).map((key) => {
	const option = finalOptions[key];
	console.log(`${option.name}: ${option.val}, SOURCE: ${option.src}`);
})

const handleArgs = () => {
	const args = gar(process.argv.slice(2));
	const env = process.env;
	const optionKeys = ["timeout", "minDuration", "maxFiles", "dateFmt", "host", "port"];
	const finalOptions = useArgsOrEnv(args, env, optionKeys);
	if (args["P"]) {
		printOptions(finalOptions);
	}
	const { timeout, minDuration, maxFiles, dateFmt, host, port } = finalOptions;
	return {
		// timeout specified in seconds, convert to milliseconds
		// minDuration should be kept as seconds for printing when file is too short
		timeout: timeout.val * 1000,
		minDuration: minDuration.val,
		maxFiles: maxFiles.val,
		dateFmt: dateFmtOptions(dateFmt.val),
		host: host.val,
		port: port.val
	}
}

module.exports = handleArgs;