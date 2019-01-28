const gar = require("gar");

/* TODO:
 * - Accept environment variables, which can be overridden by command line arguments
 * - Check whichever variables are used to see if they are valid
 * - Date formatting options
 */

const handleArgs = () => {
	const args = gar(process.argv.slice(2));
	return {
		// timeout specified in seconds, convert to milliseconds
		timeout: args.timeout ? args.timeout * 1000 : 5000,
		maxFiles: args.maxfiles ? args.maxfiles : 5,
		minDuration: args.minduration ? args.minduration : 5,
		dateFmt: args.datefmt ? args.datefmt : "MMM-DD-YYYY_HH:mm:ss",
		host: args.host ? args.host : "127.0.0.1",
		port: args.port ? args.port : 7355
	}
}

module.exports = handleArgs;