import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import pngQuant from 'imagemin-pngquant';

import {pngOptions} from './images';

const srcFavicon = 'src/media/favicons/*.png';
export const distFavicon = 'dist/assets/img/favicons/';

export function favicons() {
  return gulp
    .src(srcFavicon)
    .pipe(imagemin([pngQuant(pngOptions)]))
    .pipe(gulp.dest(distFavicon));
}
