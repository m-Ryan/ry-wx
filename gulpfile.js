const gulp = require('gulp');
const clean = require('./build/clean');
const compileJs = require('./build/compileJs');
const compileSass = require('./build/compileSass');
const copyJson = require('./build/copyJson');
const copyWxml = require('./build/copyWxml');
const copyAssets = require('./build/copyAssets');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const cwd = process.cwd();
const dayjs = require('dayjs');

const tasks = [ clean, gulp.parallel([ compileJs, compileSass, copyJson, copyWxml, copyAssets ]) ];
if (process.env.NODE_ENV === 'development') {
	tasks.push(watch);
}

gulp.task('default', gulp.series(tasks));

gulp.task('watch', watch);
function watch() {
	console.log(chalk.blue(`正在监听文件...  ${getNow()}`));
	const watcher = gulp.watch('src/**/**');

	watcher.on('change', function(filePath, stats) {
		compile(filePath);
	});

	watcher.on('add', function(filePath, stats) {
		compile(filePath);
	});

	watcher.on('unlink', function(filePath, stats) {
		let distFile = filePath.replace(/^src\b/, 'dist');
		let absolutePath = '';
		if (distFile.endsWith('.ts')) {
			distFile = distFile.replace(/.ts$/, '.js');
		} else if (distFile.endsWith('.scss')) {
			distFile = distFile.replace(/.scss$/, '.wxss');
		}
		absolutePath = path.join(cwd, distFile);
		if (fs.existsSync(absolutePath)) {
			fs.unlinkSync(absolutePath);
			console.log(chalk.yellow(`删除文件：${path.basename(distFile)}  ${getNow()}`));
		}
	});
}

function compile(filePath) {
	console.info(chalk.green(`编译完成：${path.basename(filePath)}  ${getNow()}`));
	if (filePath.endsWith('.ts')) {
		compileJs(filePath);
	} else if (filePath.endsWith('.scss')) {
		compileSass(filePath);
	} else if (filePath.endsWith('.wxml')) {
		copyWxml(filePath);
	} else if (filePath.endsWith('.json')) {
		copyJson(filePath);
	} else {
		copyAssets(filePath);
	}
}

function getNow() {
	return dayjs().format('HH:mm:ss');
}
