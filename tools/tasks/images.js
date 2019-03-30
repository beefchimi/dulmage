import gulp from 'gulp';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import mozJpeg from 'imagemin-mozjpeg';
import pngQuant from 'imagemin-pngquant';

const assetsBlacklist = ['content/', 'components/'];
const srcMediaImages = 'src/media/images/';
const srcAssetsImages = 'src/**/assets/';
const distImages = 'dist/assets/img/';
// jpe?g doesn't seem to work
const extImages = '*.+(jpeg|jpg|png|gif)';

export const pngOptions = {
  quality: [0.7, 0.8],
};
const mozJpegOptions = {
  quality: 65,
};

export function images() {
  return gulp
    .src([`${srcMediaImages}**/${extImages}`, `${srcAssetsImages}/${extImages}`])
    .pipe(imagemin([pngQuant(pngOptions), mozJpeg(mozJpegOptions)]))
    .pipe(
      rename(path => {
        const removeDirname = assetsBlacklist.some(assetPath => path.dirname.includes(assetPath));
        path.dirname = removeDirname ? '' : path.dirname;
      }),
    )
    .pipe(gulp.dest(distImages));
}
