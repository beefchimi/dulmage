// import fs from 'fs';
import gulp from 'gulp';
import data from 'gulp-data';
import inject from 'gulp-inject';
import htmlmin from 'gulp-htmlmin';
import nunjucks from 'nunjucks';
import gulpjucks from 'gulp-nunjucks';

import {fileContentsToString} from '../utilities';

import {distSvg, fileSymbols} from './svg';

// eslint-disable-next-line no-undef
const isProd = process.env.NODE_ENV === 'production';

export const srcViews = 'src/views/';
const distViews = 'dist/';
const extViews = '*.+(html|njk)';
export const extAllViews = '*.+(html|njk|json|md)';

export function views() {
  const nunjucksEnv = new nunjucks.Environment([
    new nunjucks.FileSystemLoader('src/views'),
    new nunjucks.FileSystemLoader('src'),
  ]);
  const injectSymbols = gulp.src(`${distSvg}${fileSymbols}`, {allowEmpty: true});
  const envData = {
    isProd,
  };

  /*
  const puzzleData = {
    ...JSON.parse(fs.readFileSync('src/content/Drag/Basics/puzzle-data.json')),
    ...JSON.parse(fs.readFileSync('src/content/Features/Accessible/puzzle-data.json')),
  };
*/

  return (
    gulp
      .src([`${srcViews}${extViews}`])
      .pipe(data(() => envData))
      // .pipe(data(() => puzzleData))
      .pipe(
        gulpjucks.compile(
          {},
          {
            env: nunjucksEnv,
          },
        ),
      )
      .pipe(
        inject(injectSymbols, {
          transform: fileContentsToString,
        }),
      )
      .pipe(
        htmlmin({
          minifyJS: true,
          removeComments: true,
          collapseWhitespace: true,
        }),
      )
      .pipe(gulp.dest(distViews))
  );
}
