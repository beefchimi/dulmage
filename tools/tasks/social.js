import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import pngQuant from 'imagemin-pngquant';
import {pngOptions} from './images';

const srcSocial = 'src/media/social/*.png';
export const distSocial = 'dist/assets/img/social/';

export function social() {
  return gulp
    .src(srcSocial)
    .pipe(imagemin([pngQuant(pngOptions)]))
    .pipe(gulp.dest(distSocial));
}
