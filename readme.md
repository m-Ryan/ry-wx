# 基于gulp构建微信小程序


目前来说，对于构建小程序的，类似taro这些框架，生态已经挺完善的了，没有什么必要再搞一套来折腾自己。但是，我司的小程序，是很早之前就开发的，我们负责人当时信不过这些开源的框架，于是自己用webpack搞了一套框架，但有一个比较严重的问题，有一些文件依赖重复打包了，导致小程序包体积比较大。

持续了一个多月，主包体积在2M左右徘徊，开发都很难做下去。我们负责人终于受不了了，给了我个任务，让我写一个构建小程序的工具，减少小程序包体积。
我们现在的框架对比一下原生小程序，其实差别不大，无非就是 

```js
ts => js
sass=>wxss
wxml=>wxml
json=>json

```
由于我司小程序基础库是1.9.8的，不支持构建npm，所以node_modules的依赖包以及依赖路径需要自己处理，于是写了一个babel插件 **babel-plugin-copy-npm**。
这么一想，其实不难，而且单文件编译，那不是gulp的强项吗！！！

---
## 最终效果如下：
![图片1](http://assets.maocanhua.cn/FhPT8bvOp1qUhVEIeCsEWjV4fSfi)

![图片1](http://assets.maocanhua.cn/FoTlBImiwck24hIscah5_GMt4ckx)

![图片1](http://assets.maocanhua.cn/FiQnrglU-C7VY2ruS_76Z9qky_Jt)

而且由于增量更新，只修改改变的文件，所以编译的速度非常快。

项目地址：[https://github.com/m-Ryan/ry-wx](https://github.com/m-Ryan/ry-wx)

最终流程大概如下：清除dist目录下的文件 => 编译文件到dist目录下=> 开发模式监听文件更改，生产环境压缩文件。

一、清除dist目录下的文件 （clean.js）
```js
const del = require('del');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
module.exports = function clean() {
	if (!fs.existsSync(path.join(cwd, 'dist'))) {
		fs.mkdirSync('dist');
		return Promise.resolve(null);
	}
	return del([ '*', '!npm' ], {
		force: true,
		cwd: path.join(cwd, 'dist')
	});
};


```
二、编译文件

- 1.编译typescript（compileJs.js）
```js
const gulp = require('gulp');
const { babel } = require('gulp-load-plugins')();
const path = require('path');
const cwd = process.cwd();
module.exports = function compileJs(filePath) {
	let file = 'src/**/*.ts';
	let dist = 'dist';
	if (typeof filePath === 'string') {
		file = path.join(cwd, filePath);
		dist = path.dirname(file.replace(/src/, 'dist'));
	}
	return gulp.src(file).pipe(babel()).pipe(gulp.dest(dist));
};

```
---
- 2.编译sass（compileSass.js）
```js
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

```
---

- 3. 编译json，wxml，由于需要压缩，所以需要分开处理

（copyJson.js）
```js
const gulp = require('gulp');

module.exports = function copyJson() {
	let file = 'src/**/*.json';
	let dist = 'dist';
	if (typeof filePath === 'string') {
		file = path.join(cwd, filePath);
		dist = path.dirname(file.replace(/src/, 'dist'));
	}
	return gulp.src([ file ]).pipe(gulp.dest(dist));
};


```
（copyWxml.js）
```js
const gulp = require('gulp');

const minifyHtml = require('gulp-html-minify');
module.exports = function copyWxmlFiles() {
	let file = 'src/**/*.wxml';
	let dist = 'dist';
	if (typeof filePath === 'string') {
		file = path.join(cwd, filePath);
		dist = path.dirname(file.replace(/src/, 'dist'));
	}
	return gulp.src(file).pipe(minifyHtml()).pipe(gulp.dest(dist));
};

```
---

- 4.拷贝其他静态资源，例如字体、图片
（copyAssets.js）
```js
const gulp = require("gulp");

module.exports = function copyAssets() {
  let file = "src/**/**";
  let dist = "dist";
  if (typeof filePath === "string") {
    file = path.join(cwd, filePath);
    dist = path.dirname(file.replace(/src/, "dist"));
  }
  return gulp
    .src([
      file,
      "!**/*.json",
      "!**/*.ts",
      "!**/*.js",
      "!**/*.scss",
      "!**/*.wxml"
    ])
    .pipe(gulp.dest(dist));
};


```

- 5.引入文件（gulpfile.js）
```js
const gulp = require("gulp");
const clean = require("./build/clean");
const compileJs = require("./build/compileJs");
const compileSass = require("./build/compileSass");
const copyJson = require("./build/copyJson");
const copyWxml = require("./build/copyWxml");
const copyAssets = require("./build/copyAssets");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const cwd = process.cwd();
const dayjs = require("dayjs");

const tasks = [
  clean,
  gulp.parallel([compileJs, compileSass, copyJson, copyWxml]),
  copyAssets
];
if (process.env.NODE_ENV === "development") {
  tasks.push(watch);
}

gulp.task("default", gulp.series(tasks));

gulp.task("watch", watch);
function watch() {
  console.log(chalk.blue(`正在监听文件...  ${getNow()}`));
  const watcher = gulp.watch("src/**/**");

  watcher.on("change", function(filePath, stats) {
    compile(filePath);
  });

  watcher.on("add", function(filePath, stats) {
    compile(filePath);
  });

  watcher.on("unlink", function(filePath, stats) {
    let distFile = filePath.replace(/^src\b/, "dist");
    let absolutePath = "";
    if (distFile.endsWith(".ts")) {
      distFile = distFile.replace(/.ts$/, ".js");
    } else if (distFile.endsWith(".scss")) {
      distFile = distFile.replace(/.scss$/, ".wxss");
    }
    absolutePath = path.join(cwd, distFile);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(
        chalk.yellow(`删除文件：${path.basename(distFile)}  ${getNow()}`)
      );
    }
  });
}

function compile(filePath) {
  console.info(
    chalk.green(`编译完成：${path.basename(filePath)}  ${getNow()}`)
  );
  if (filePath.endsWith(".ts")) {
    compileJs(filePath);
  } else if (filePath.endsWith(".scss")) {
    compileSass(filePath);
  } else if (filePath.endsWith(".wxml")) {
    copyWxml(filePath);
  } else if (filePath.endsWith(".json")) {
    copyJson(filePath);
  } else {
    copyAssets(filePath);
  }
}

function getNow() {
  return dayjs().format("HH:mm:ss");
}


```
---

babel的配置如下.babelrc.js

```js
const babelOptions = {
	presets: [ '@babel/preset-typescript', [ '@babel/env' ] ],
	plugins: [
		'lodash',
		[
			'@babel/plugin-proposal-decorators',
			{
				legacy: true
			}
		],
		'babel-plugin-add-module-exports',
		[
			'@babel/plugin-transform-runtime',
			{
				corejs: false,
				helpers: true,
				regenerator: true,
				useESModules: false
			}
		],

		[
			'module-resolver',
			{
				root: [ '.' ],
				alias: {
					'@': './src'
				}
			}
		],
		[
			'babel-plugin-copy-npm',
			{
				rootDir: 'src',
				outputDir: 'dist',
				npmDir: 'npm',
				format: 'cjs',
				strict: false,
				minify: true,
				loose: true,
				cache: true
			}
		]
	]
};

if (process.env.NODE_ENV === 'production') {
	babelOptions.presets.unshift([
		'minify',
		{
			mangle: {
				exclude: [ 'wx', 'module', 'exports', '__wxConfigx', 'process', 'global' ]
			},
			keepFnName: true
		}
	]);
}

module.exports = babelOptions;


```
