#!/usr/bin/env node
module.exports = {
    setup: require('./setup'),
    configuration: require('./configuration'),
    files: require('./files'),
    resources: require('./resources'),
    main: require('./main')
}

(async () => main(process.argv))(process);
  