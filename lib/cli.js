const { version } = require('../package.json');
const { program } = require('commander');

program.version(version);
program.option('-i, --install', 'install ion in current directory');

program.parse(process.argv);

const options = program.opts();

if (options.install) {
	require('./install');
}
