const gulp 			= require('gulp');
const ts 			= require('gulp-typescript');
const sourcemaps 	= require('gulp-sourcemaps');

//TypeScript编译选项
const tsOptions = {
	/*
	libs: [
		'es2017'
	],
	*/

	//isolatedModules: 			true,

	noFallthroughCasesInSwitch: true,
	noImplicitReturns:			true,
	noImplicitThis: 			true,
	noImplicitUseStrict:		true,
	//noImplicitAny:				true,

	module: 					'commonjs',
	target: 					'es2017',
	removeComments: 			true,
	pretty:						true
};



var tsAccountServerProject = ts.createProject(tsOptions);
//编译User服务器的TypeScript文件
gulp.task('compileAccountServer', () => {
	return gulp.src('./src/**/*.ts')
		.pipe(sourcemaps.init({loadMaps: true, debug: true}))
		.pipe(tsAccountServerProject())
		.pipe(sourcemaps.write('./', {sourceRoot: '../src/'}))
		.pipe(gulp.dest('./bin'));
 });
 //监控User服务器的TypeScript文件
 gulp.task('default', ['compileAccountServer'], () => {
	gulp.watch('./src/**/*.ts', ['compileAccountServer']);
 });