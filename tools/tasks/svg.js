import gulp from 'gulp';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import svgstore from 'gulp-svgstore';
import {renameSvg} from '../utilities';

export const srcMediaSvg = 'src/media/svg/**/*.svg';
export const srcContentSvg = 'src/**/assets/*.svg';
export const distSvg = 'dist/assets/svg/';
export const fileSymbols = 'symbols.svg';

const svgoOptions = {
  cleanupIDs: false,
  removeViewBox: false,
  removeHiddenElems: false,
  removeUselessStrokeAndFill: false,
  addClassesToSVGElement: true,
};
const svgStoreConfig = {
  inlineSvg: true,
};

export function svg() {
  return gulp
    .src([srcMediaSvg, srcContentSvg])
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [svgoOptions],
        }),
      ]),
    )
    .pipe(rename(renameSvg))
    .pipe(svgstore(svgStoreConfig))
    .pipe(rename(fileSymbols))
    .pipe(gulp.dest(distSvg));
}
