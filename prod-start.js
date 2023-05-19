const cliConfig = require('./nest-cli.json');

require(`./dist/${cliConfig.entryFile}.js`);
