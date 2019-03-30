import gulp from 'gulp';

const srcRoot = 'src/root/';
const distRoot = 'dist/';
const htaccess = `${srcRoot}.htaccess`;

export function root() {
  return gulp.src([`${srcRoot}*`, htaccess]).pipe(gulp.dest(distRoot));
}
