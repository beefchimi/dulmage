import initDulmage from './Dulmage';
import initNavigation from './Navigation';
import initSw from './Sw';
import initTracking from './Tracking';

const init = {
  Dulmage: initDulmage,
  Navigation: initNavigation,
  ServiceWorker: initSw,
  Tracking: initTracking,
};

export default init;
