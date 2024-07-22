import {registerSW} from 'virtual:pwa-register';
import {getErrorMessage} from 'beeftools';

import {ToastTracker} from './ToastTracker';

type PwaRegistrationType = 'registered' | 'ready' | 'refresh' | 'error';
type PwaReloadFn = ((reloadPage?: boolean) => Promise<void>) | undefined;

export class PwaServiceWorker {
  // TODO: We probably want to initialize a global singleton
  // that gets imported and shared in various places.
  static #tracker = new ToastTracker();
  static #refreshWorker: PwaReloadFn;

  static install() {
    PwaServiceWorker.#refreshWorker = registerSW({
      immediate: true,
      onOfflineReady: () => {
        PwaServiceWorker.#createToast('ready');
      },
      onNeedRefresh: () => {
        PwaServiceWorker.#createToast('refresh');
      },
      onRegisteredSW: (swScriptUrl) => {
        if (import.meta.env.PROD) return;
        PwaServiceWorker.#createToast('registered', swScriptUrl);
      },
      onRegisterError: (error) => {
        if (import.meta.env.PROD) return;

        const parsedError = getErrorMessage(error);

        console.warn(parsedError);
        PwaServiceWorker.#createToast('error');
      },
    });

    return PwaServiceWorker.#refreshWorker;
  }

  static refresh() {
    if (!PwaServiceWorker.#refreshWorker) {
      console.warn('The Service Worker has not yet been registered.');
      return PwaServiceWorker;
    }

    return PwaServiceWorker.#refreshWorker(true);
  }

  static #createToast(type: PwaRegistrationType, swScriptUrl = '') {
    const newIndex = PwaServiceWorker.#tracker.totalCreated;
    const newId = `Toast-${newIndex}`;

    return PwaServiceWorker.#tracker.add(
      newId,
      {message: PwaServiceWorker.#getMessage(type, swScriptUrl)},
      (_event) => {
        if (type === 'refresh') PwaServiceWorker.refresh();
      },
      // (event) => {},
    );
  }

  static #getMessage(type: PwaRegistrationType, swScriptUrl = '') {
    switch (type) {
      case 'registered':
        return swScriptUrl
          ? `The Service Worker has been registered: ${swScriptUrl}`
          : 'The Service Worker script could not be found.';
      case 'ready':
        return 'This site can now be used offline.';
      case 'refresh':
        return 'There are some portfolio updates since your last visit. Tap to refresh now.';
      default:
        return 'An error occured attempting to register the Service Worker.';
    }
  }
}
