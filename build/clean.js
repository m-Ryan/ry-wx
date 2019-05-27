const del = require('del');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
module.exports = function clean() {
	if (!fs.existsSync(path.join(cwd, 'dist'))) {
		fs.mkdirSync('dist');
		return Promise.resolve(null);
	}
	return del([ '*' ], {
		force: true,
		cwd: path.join(cwd, 'dist')
	});
};
