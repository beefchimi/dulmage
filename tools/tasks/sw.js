import gulp from 'gulp';
import noop from 'gulp-noop';
import inject from 'gulp-inject';
import {fileContentsManifest} from '../utilities';
import {assetsManifestPath} from './revision';

// eslint-disable-next-line no-undef
const isProd = process.env.NODE_ENV === 'production';

const srcServiceWorker = 'src/scripts/service-worker.js';
const distRoot = 'dist/';
const injectConfig = {
  starttag: 'var cacheManifest = ',
  endtag: ';',
  transform: fileContentsManifest,
};

export function sw() {
  const injectManifest = gulp.src(assetsManifestPath);

  return gulp
    .src(srcServiceWorker)
    .pipe(isProd ? inject(injectManifest, injectConfig) : noop())
    .pipe(gulp.dest(distRoot));
}
