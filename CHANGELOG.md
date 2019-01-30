### v1.0.0
- Added support for environment variables
- Changed argument names to uppercase for consistency (camelcase in code, uppercase in args/env)
- Added date formatting options
- Validation for options passed in
- Added option to print options used and their source (args, env, default)
- Added text color in console

### v0.0.2
- Fixed `minduration` elapsed time checker: was comparing to start of file, didn't account for periods of silence