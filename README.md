Work in progress! I have only tested it on Linux with GQRX, so, instructions are based on that. It *should* work on macOS and may work on windows, using [pothosSDR](https://github.com/pothosware/PothosSDR). Any input is welcome, feel free to submit an issue.

# Getting started:

- Must have node.js installed.
- Clone this repo or download it and extract the zip file.
- Navigate to the program directory and run `npm install` to install the program dependencies.
- GQRX must be running, with the `UDP` button selected in the audio panel.
- GQRX network options (found under the `...` button in the audio panel) must match the host and port specified below. If below options are omitted, the default options should work with the default GQRX host and port.
- Make sure your squelch is set well. As far as I can tell, there is no way to distinguish static from meaningful transmissions, so static will be saved.

# Usage:

```
node server.js [options]
--timeout=<number>      Maximum seconds of silence before saving file and starting new file or exiting, DEFAULT: 5
--minduration=<number>  After timeout finishes, if total recording was less than minduration seconds, file is deleted. DEFAULT: null (keep always)
--maxfiles=<number>     Maximum number of files to save before exiting, DEFAULT: 5
--host=<string>         Local IP address serving data, DEFAULT: 127.0.0.1 (localhost)
--port=<number>         Local UDP port serving data, DEFAULT: 7355
```

Recordings are saved in the `recordings` subdirectory in the main program directory.

# Todo:

- Write stream to a buffer and then save that? Main reason being that in case `minduration` is specified, can avoid unnecessary write and delete
- Different timestamp options
- Maximum recording length option
- Error handling
- Check arguments
- Test on other operating systems