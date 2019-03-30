import gulp from 'gulp';
import tasks from './tasks';
import {watch} from './watch';

// Child tasks
const favicons = tasks.favicons;
const fonts = tasks.fonts;
const images = tasks.images;
const revision = tasks.revision;
const root = tasks.root;
const social = tasks.social;
const sw = tasks.sw;
const views = tasks.views;

export const scripts = tasks.scripts;
export const styles = tasks.styles;
export const svg = tasks.svg;
export const server = tasks.startServer;
export const start = watch;

// Grouped tasks
const seriesAssets = gulp.parallel(scripts, styles);

export const serviceWorker = gulp.series(revision, sw);
export const parallelMedia = gulp.parallel(fonts, svg, favicons, social, images);
export const parallelViews = gulp.parallel(root, views);

export const build = gulp.series(parallelMedia, seriesAssets, parallelViews, serviceWorker);
