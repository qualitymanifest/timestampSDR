### v2.1.1
- Added condition checking `remoteInfo.size` in UDP stream listener to prevent errors with `readInt16LE()`

### v2.1.0
- Added pre-commit hook to check if `config.js` was changed
- Added npm script to move pre-commit hook to hooks directory
- Created `CONTRIBUTING.md`

### v2.0.0
- Switched from environment variables to config file - faster and easier to edit.
- Using camelCase everywhere (code, args, and config) - no case conversion needed.
- Changed `handle_args.js` to `handle_options.js`

### v1.0.0
- Added support for environment variables
- Changed argument names to uppercase for consistency (camelCase in code, uppercase in args/env)
- Added date formatting options
- Validation for options passed in
- Added option to print options used and their source (args, env, default)
- Added text color in console

### v0.0.2
- Fixed `minduration` elapsed time checker: was comparing to start of file, didn't account for periods of silence
