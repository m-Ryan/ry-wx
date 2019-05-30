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
