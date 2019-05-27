const gulp = require('gulp');
const { sass, postcss, rename } = require('gulp-load-plugins')();
const path = require('path');
const cwd = process.cwd();
const plugins = [
	require('autoprefixer')({
		browsers: [ 'ios >= 8', 'ChromeAndroid >= 53' ],
		remove: false,
		add: true
	}),
	require('postcss-pxtorpx')({
		multiplier: 2,
		propList: [ '*' ]
	})
];

module.exports = function compileSass(filePath) {
	let file = 'src/**/*.scss';
	let dist = 'dist';
	if (typeof filePath === 'string') {
		// 如果 直接使用传入的 file ， 生成的文件会直接拼接 dist + file
		// 必须使用绝对路径， 同时输出目录也要更改
		file = path.join(cwd, filePath);
		dist = path.dirname(file.replace(/src/, 'dist'));
	}
	return gulp
		.src(file)
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(postcss(plugins))
		.pipe(
			rename({
				extname: '.wxss'
			})
		)
		.pipe(gulp.dest(dist));
};
