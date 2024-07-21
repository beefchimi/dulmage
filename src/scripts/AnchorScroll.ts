import {prefersReducedMotion} from 'beeftools';

// This class is not necessary as long as we use
// `html > scroll-behavior: smooth`.
export class AnchorScroll {
  static readonly reducedMotion = prefersReducedMotion();
  static readonly defaultSelector = '[data-scroll-action]';

  #initialized = false;

  readonly links: NodeListOf<Element>;
  readonly visitedAnchors: Record<string, HTMLElement>;

  constructor(selector = '') {
    this.links = document.querySelectorAll(
      selector || AnchorScroll.defaultSelector,
    );

    this.visitedAnchors = {};
  }

  init() {
    if (AnchorScroll.reducedMotion || !this.links.length || this.#initialized) {
      return;
    }

    this.links.forEach((link) => {
      link.addEventListener('click', this.#eventScroll);
    });

    this.#initialized = true;

    return this;
  }

  teardown() {
    this.links.forEach((link) => {
      link.removeEventListener('click', this.#eventScroll);
    });

    return this;
  }

  scrollToAnchor(key = '') {
    const foundAnchor = this.visitedAnchors[key];

    // TODO: This should update the `url` to include the `anchor`.
    // This might be necessary since we call `preventDefault`.
    foundAnchor?.scrollIntoView({behavior: 'smooth'});

    return this;
  }

  #getIdFromTarget(target?: EventTarget | null) {
    const valid = target instanceof HTMLAnchorElement;
    const value = valid ? target.href.split('#')[1] : '';

    return value ?? '';
  }

  #eventScroll = (event: Event) => {
    const anchorId = this.#getIdFromTarget(event.currentTarget);

    if (anchorId && !Object.hasOwn(this.visitedAnchors, anchorId)) {
      const foundAnchor = document.getElementById(anchorId);

      if (foundAnchor) {
        this.visitedAnchors[anchorId] = foundAnchor;
      }
    }

    if (!this.visitedAnchors[anchorId]) return;

    event.preventDefault();
    this.scrollToAnchor(anchorId);
  };
}
