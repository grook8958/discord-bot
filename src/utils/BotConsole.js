'use-strict';

exports.warn = async (string) => {
	const c = await import('chalk');
	return console.log(c.default.yellow('[WARNING]', string));
};

exports.log = async (string) => {
	const c = await import('chalk');
	return console.log('[' + c.default.blueBright('INFO') + '] ' + string);
};

exports.error = async (string) => {
	const c = await import('chalk');
	return console.log(c.default.red('[ERROR]', string));
};