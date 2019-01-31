Work in progress! I have only tested it on Linux with GQRX, so, instructions are based on that. It *should* work on macOS, and *may* work on windows using GQRX via [pothosSDR](https://github.com/pothosware/PothosSDR). Any input is welcome, feel free to submit an issue.

# Getting started:

- Must have node.js installed.
- Clone this repo or download it and extract the zip file.
- Navigate to the program directory and run `npm install` to install the program dependencies.
- GQRX must be running, with the `UDP` button selected in the audio panel.
- GQRX network options (found under the `...` button in the audio panel) must match the host and port specified below. If below options are omitted, the default options should work with the default GQRX host and port.
- Make sure your squelch is adjusted well. As far as I can tell, there is no way to distinguish static from meaningful transmissions, so static is recorded.

# Usage:

```
node server.js [options]
--timeout=<number>      Maximum seconds of silence before saving file and starting new file or exiting, DEFAULT: 5
--minDuration=<number>  After timeout finishes, if total recording was less than minduration seconds, file is deleted. DEFAULT: 5
--maxFiles=<number>     Maximum number of files to save before exiting, DEFAULT: 5
--dateFmt=<string>      Date formatting: "datetime", "unix", or custom (see moment.js formatting options), default "datetime"
--host=<string>         Local IP address serving data, DEFAULT: 127.0.0.1 (localhost)
--port=<number>         Local UDP port serving data, DEFAULT: 7355
-p                      Print options used and source they were chosen from (command line arguments, environment variables, default)
```
#### Note:
- Recordings are saved in the `recordings` subdirectory in the main program directory.
- Timeout resets if a new transmission comes in before timeout finishes.
- Silence is not recorded, and doesn't count towards `minduration`.
- **To set your own default options** (which can be overridden by passing in arguments), go to `config.js` in the main program directory and follow the instructions provided in the file.

# Todo:

- Add option to choose directory to save files
- Add maximum recording length option
- Error handling
- Test on other operating systems
