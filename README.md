# About:

timestampSDR is designed to take the UDP stream output from GQRX and record transmissions to time-stamped `.wav` files. There are several configuration options, described below, that allow you to keep only the transmissions you want. This can allow you to quickly review transmissions that occurred over a long period of time.

:heavy_check_mark: Works on Linux
:heavy_check_mark: Works on Windows 10 running GQRX via [pothosSDR](https://github.com/pothosware/PothosSDR/wiki/Tutorial)
:grey_question: Should work on MacOS, but not tested (seeking feedback!)

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
--timeout=<number>      After transmission received, maximum seconds of silence before saving file and moving on, DEFAULT: 5
--minDuration=<number>  After timeout finishes, if total recording was less than minDuration seconds, file is deleted. DEFAULT: 5
--maxFiles=<number>     Maximum number of files to save before exiting, DEFAULT: 5
--dateFmt=<string>      Date formatting: "datetime", "unix", or custom (see moment.js formatting options), default "datetime"
--host=<string>         Local IP address serving data, DEFAULT: "127.0.0.1" (localhost)
--port=<number>         Local UDP port serving data, DEFAULT: 7355
-p                      Print options used and source they were chosen from (command line arguments, environment variables, default)
```
#### Note:
- Recordings are saved in the `recordings` subdirectory in the main program directory.
- Timeout resets if a new transmission comes in before timeout finishes.
- Silence is not recorded, and doesn't count towards `minDuration`.
- To set your own default options (which can be overridden by passing in arguments), go to `config.js` in the main program directory and follow the instructions provided in the file.

# Todo:

- Add option to choose directory to save files
- Add maximum recording length option
