import Notification from '../Notification';

const swFilename = 'service-worker.js';

function register() {
  navigator.serviceWorker
    .register(swFilename)
    .then(registration => {
      return install(registration);
    })
    .catch(error => {
      console.warn(`Error during service worker registration: ${error.message}`);
    });
}

function unregister() {
  navigator.serviceWorker
    .getRegistrations()
    .then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }

      return registrations;
    })
    .catch(error => {
      console.warn(`Error unregistering service worker: ${error.message}`);
    });
}

function install(registration) {
  registration.onupdatefound = () => {
    const installingWorker = registration.installing;

    installingWorker.onstatechange = () => {
      switch (installingWorker.state) {
        case 'installed':
          if (navigator.serviceWorker.controller) {
            launchUpdateNotification();
          }
          break;

        case 'redundant':
          console.warn('The installing service worker became redundant.');
          break;
      }
    };
  };
}

function launchUpdateNotification() {
  const notification = new Notification('Site updates are available. Tap to refresh.');
  document.body.appendChild(notification.getNotification());
}

const ServiceWorker = {
  register,
  unregister,
};

export default ServiceWorker;
