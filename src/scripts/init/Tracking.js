// eslint-disable-next-line shopify/strict-component-boundaries
import Analytics from '../../components/Analytics';

const DEFAULT_UA_DULMAGE_ME = 'UA-55220243-1';

export default function initTracking(ua = DEFAULT_UA_DULMAGE_ME) {
  const trackingElements = document.querySelectorAll('[data-gtag-category]');

  if (trackingElements.length) {
    const gtagTracking = new Analytics(trackingElements, ua);
    gtagTracking.init();
  }
}
