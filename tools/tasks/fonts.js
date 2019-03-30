import gulp from 'gulp';

const srcFonts = 'src/fonts/';
const distFonts = 'dist/assets/fonts/';
const extFonts = '*.+(woff2?|ttf|eot)';

export function fonts() {
  return gulp.src(`${srcFonts}**/${extFonts}`).pipe(gulp.dest(distFonts));
}
