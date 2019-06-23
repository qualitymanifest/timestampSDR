# About:

timestampSDR is designed to take the UDP stream output from certain SDR receiver software (currently GQRX and rtl_fm) and record transmissions to time-stamped `.wav` files, discarding silence. This can allow you to quickly review transmissions that occurred over a long period of time.

- :heavy_check_mark: Works on Linux running GQRX or rtl_fm
- :heavy_check_mark: Works on Windows 10 running GQRX via [pothosSDR](https://github.com/pothosware/PothosSDR/wiki/Tutorial)
- :grey_question: Should work on MacOS, but not tested (seeking feedback!)

# Getting started:

- Must have node.js installed.
- Clone this repo or download it and extract the zip file.
- Navigate to the program directory and run `npm install` to install the program dependencies.
- Refer to [the wiki](https://github.com/qualitymanifest/timestampSDR/wiki) for instructions on setting up your SDR receiver software. Currently this includes GQRX and rtl_fm. GQRX is more user-friendly and seems to provide better audio, rtl_fm runs efficiently on low-spec devices.
- Regardless of your receiver software, make sure your squelch is adjusted well. timestampSDR cannot differentiate static from meaningful transmissions.

# Usage:

```
node main.js [options]
--timeout=<number>      After transmission, maximum seconds of silence before saving/deleting file and moving on, DEFAULT: 5
--minDuration=<number>  After timeout completes, if total recording was less than minDuration seconds, file is deleted. DEFAULT: 5
--maxFiles=<number>     Maximum number of files to save before exiting program, DEFAULT: 5
--dateFmt=<string>      Date formatting: "datetime", "unix", or custom (see moment.js formatting options), default "datetime"
--host=<string>         Local IP address serving data, DEFAULT: "127.0.0.1" (localhost)
--port=<number>         Local UDP port serving data, DEFAULT: 7355
-p                      Print options used and source they were chosen from (command line arguments, config file, default)
```
#### Note:
- Recordings are saved in the `recordings` subdirectory in the main program directory.
- Timeout resets if a new transmission comes in before timeout finishes.
- Silence is not recorded, and doesn't count towards `minDuration`.
- To set your own default options (which can be overridden by passing in arguments), go to `config.js` in the main program directory and follow the instructions provided in the file.
