const views = ['dist/404.html', 'dist/index.html'];
const styles = ['dist/assets/css/app.css'];
const scripts = ['dist/assets/js/app.js', 'dist/assets/js/runtime.js', 'dist/assets/js/vendor.js'];
const uiMedia = [
  'dist/assets/img/cursor-auto.png',
  'dist/assets/img/cursor-text.png',
  // 'dist/assets/img/cursor-drag.png',
  // 'dist/assets/img/cursor-drag-clicked.png',
  'dist/assets/img/cursor-pointer.png',
  'dist/assets/img/cursor-pointer-clicked.png',
  // 'dist/assets/img/cursor-rock.png',
  // 'dist/assets/img/cursor-rock-clicked.png',
];
const introMedia = [
  'dist/assets/img/intro-beach.png',
  'dist/assets/img/intro-bridge.png',
  'dist/assets/img/intro-flowers.png',
  'dist/assets/img/intro-forest.png',
  'dist/assets/img/intro-the-gut.png',
  'dist/assets/img/intro-tropical.png',
  'dist/assets/img/intro-worship.png',
];
const projectsMedia = [
  'dist/assets/img/bg-body-mind-change.png',
  // 'dist/assets/img/bg-chicken.png',
  'dist/assets/img/bg-fringe.png',
  'dist/assets/img/bg-northern-army.png',
  'dist/assets/img/bg-northern-army-2012.png',
  // 'dist/assets/img/bg-northman.png',
  'dist/assets/img/bg-north-navy.png',
  'dist/assets/img/bg-preservation-society.png',
  'dist/assets/img/bg-pukeko.png',
];

const cacheManifest = [
  ...views,
  ...styles,
  ...scripts,
  ...uiMedia,
  ...introMedia,
  ...projectsMedia,
];

export default cacheManifest;