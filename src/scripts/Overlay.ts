export class Overlay {
  static readonly actionAttr = '[data-overlay-action]';
  static readonly defaultOverlayId = 'Overlay';

  #initialized = false;
  #shown = false;

  readonly links: NodeListOf<Element>;
  readonly overlay: HTMLElement | null;

  constructor(overlayId = '') {
    this.links = document.querySelectorAll(Overlay.actionAttr);
    this.overlay = document.getElementById(
      overlayId || Overlay.defaultOverlayId,
    );
  }

  init() {
    if (!this.links.length || !this.overlay || this.#initialized) {
      return;
    }

    this.links.forEach((link) => {
      link.addEventListener('focus', this.#handleShow);
      link.addEventListener('pointerenter', this.#handleShow);

      link.addEventListener('blur', this.#handleHide);
      link.addEventListener('pointerleave', this.#handleHide);
      link.addEventListener('pointercancel', this.#handleHide);
      link.addEventListener('pointerup', this.#handleHide);

      link.addEventListener('pointerdown', this.#handlePress);
    });

    document.addEventListener(
      'visibilitychange',
      this.#handleDocumentVisibility,
    );

    this.#initialized = true;

    return this;
  }

  teardown() {
    this.links.forEach((link) => {
      link.removeEventListener('focus', this.#handleShow);
      link.removeEventListener('pointerenter', this.#handleShow);

      link.removeEventListener('blur', this.#handleHide);
      link.removeEventListener('pointerleave', this.#handleHide);
      link.removeEventListener('pointercancel', this.#handleHide);
      link.removeEventListener('pointerup', this.#handleHide);

      link.removeEventListener('pointerdown', this.#handlePress);
    });

    document.removeEventListener(
      'visibilitychange',
      this.#handleDocumentVisibility,
    );

    return this;
  }

  #handleShow = (_event: Event) => {
    if (!this.overlay || this.#shown) return;

    this.#shown = true;
    this.overlay.setAttribute('aria-hidden', 'false');
  };

  #handleHide = (_event: Event) => {
    if (!this.overlay || !this.#shown) return;

    this.#shown = false;
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.removeAttribute('aria-pressed');
  };

  #handlePress = (_event: Event) => {
    if (!this.overlay) return;
    this.overlay.setAttribute('aria-pressed', 'true');
  };

  #handleDocumentVisibility = (event: Event) => {
    // Restricting to `hidden` really doesn't work well...
    // if (!document.hidden) return;
    this.#handleHide(event);
  };
}
