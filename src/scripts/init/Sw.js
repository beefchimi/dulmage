// eslint-disable-next-line shopify/strict-component-boundaries
import ServiceWorker from '../../components/ServiceWorker';

export default function initSw() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      ServiceWorker.register();
    });
  }
}
