const gulp = require('gulp');

const minifyHtml = require('gulp-html-minify');
module.exports = function copyWxmlFiles() {
	let file = 'src/**/*.wxml';
	let dist = 'dist';
	if (typeof filePath === 'string') {
		// 如果 直接使用传入的 file ， 生成的文件会直接拼接 dist + file
		// 必须使用绝对路径， 同时输出目录也要更改
		file = path.join(cwd, filePath);
		dist = path.dirname(file.replace(/src/, 'dist'));
	}
	return gulp.src(file).pipe(minifyHtml()).pipe(gulp.dest(dist));
};
