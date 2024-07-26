export type HtmlReady = 'loading' | 'done' | 'error';

export class PageLoad {
  static MOTION_DELAY = 1200;

  static documentState() {
    return document.readyState;
  }

  static isHome() {
    const {pathname} = window.location;
    return pathname === '' || pathname === '/';
  }

  static isLoaded() {
    return document.documentElement.dataset.ready === 'done';
  }

  static schedule() {
    if (PageLoad.documentState() === 'complete') {
      PageLoad.#updateDocument();
      return;
    }

    document.addEventListener('readystatechange', PageLoad.#handleReadyState);
  }

  static #handleReadyState() {
    window.scrollTo(0, 0);
    window.setTimeout(PageLoad.#updateDocument, PageLoad.MOTION_DELAY);
  }

  static #updateDocument() {
    document.documentElement.dataset.ready = 'done';
    document.removeEventListener(
      'readystatechange',
      PageLoad.#handleReadyState,
    );
  }
}
