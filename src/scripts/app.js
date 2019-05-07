import Intro, {applyIntroAttribution, applyIntroSlideBackground} from '../content/Intro';
import {applyProjectsAttribution} from '../content/Projects';
import {secretEmail} from './utilities';
import init from './init';

const is404 = document.getElementById('Error404');
const dulmageUa = 'UA-55220243-1';
const dulmageEmail = {
  local: 'curtdulmage',
  domain: 'gmail',
  suffix: 'com',
};

init.Tracking(dulmageUa);

if (is404) {
  // Not running serviceWorker on 404 because of absolute URLS...
  // This may indicate that I should simply always use absolute URLs in production?
  console.log('lol wat');
} else {
  init.ServiceWorker();
  init.Navigation();
  init.Dulmage();

  applyIntroAttribution(Intro.attribution);
  applyIntroSlideBackground(Intro.title);
  applyProjectsAttribution();
  secretEmail(dulmageEmail);
}
