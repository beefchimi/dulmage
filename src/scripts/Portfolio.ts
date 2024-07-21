import {assertNumber, clamp} from 'beeftools';

import {CSS_PORTFOLIO_COLOR_PROP, SECTION_SELECTOR} from '@data/app';
import {sections} from '@data/sections';
import {type RgbChannels} from '@data/types';
import {RgbTracker} from './RgbTracker';

interface Selectors {
  cssColorProp?: string;
  section?: string;
  scroller?: string;
}

export class Portfolio {
  #selector: Required<Selectors>;
  #sections: NodeListOf<Element>;
  #scroller: Element | null;
  #channels: RgbChannels;
  #tracker = new RgbTracker();

  #index = 0;
  #rafId = 0;
  #scrollHeight = 0;
  #sectionHeight = 0;

  #isTicking = false;

  constructor(selectors?: Selectors) {
    this.#selector = {
      cssColorProp: selectors?.cssColorProp || CSS_PORTFOLIO_COLOR_PROP,
      section: selectors?.section || SECTION_SELECTOR,
      scroller: selectors?.scroller || '',
    };

    this.#sections = document.querySelectorAll(this.#selector.section);
    this.#scroller = Boolean(this.#selector.scroller)
      ? document.querySelector(this.#selector.scroller)
      : null;
    this.#channels = [0, 0, 0];

    this.#scrollHeight = 0;
    this.#sectionHeight = 0;
  }

  get currentIndex() {
    return this.#index;
  }

  get nextIndex() {
    return this.#index >= this.#sections.length - 1
      ? this.#index
      : this.#index + 1;
  }

  get channels() {
    return this.#channels;
  }

  get scroller() {
    return this.#scroller ?? window;
  }

  get scrollY() {
    return this.#scroller ? this.#scroller.scrollTop : window.scrollY;
  }

  get sectionScrollProgress() {
    const offset = this.#index * this.#sectionHeight - this.scrollY;
    const progress = offset / this.#sectionHeight;
    const safeProgress = assertNumber(progress) ? progress * 100 : 0;

    return clamp(0, Math.abs(safeProgress), 100);
  }

  get isScrollOutsideRange() {
    return this.scrollY < 0 || this.scrollY > this.#scrollHeight;
  }

  init() {
    this.#cacheHeight();
    this.#updateIndex();
    this.#updatePortfolioColor();
    this.#registerEventListeners();
  }

  teardown() {
    this.scroller.removeEventListener('scroll', this.#handleScroll);
    window.removeEventListener('resize', this.#handleResize);

    cancelAnimationFrame(this.#rafId);
  }

  #registerEventListeners() {
    // `passive` may not actually make sense for `scroll` events.
    this.scroller.addEventListener('scroll', this.#handleScroll, {
      passive: true,
    });

    window.addEventListener('resize', this.#handleResize, {
      passive: true,
    });
  }

  #cacheHeight() {
    this.#sectionHeight = this.#sections[0].clientHeight;

    // Alternatively, we could just do `this.#sections.length * this.#sectionHeight`.
    this.#scrollHeight = this.#scroller
      ? this.#scroller.scrollHeight
      : document.documentElement.scrollHeight;
  }

  #updateUrlHash() {
    const urlHash = this.#index === 0 ? ' ' : `#${sections[this.#index].id}`;

    // Passing an empty `string` as `urlHash` will NOT remove any previous `hash`,
    // which is why we pass a single `space` character.
    history.replaceState(null, '', urlHash);
  }

  #updateIndex() {
    if (this.isScrollOutsideRange) return;

    const calculatedIndex = Math.floor(this.scrollY / this.#sectionHeight);
    const safeIndex = assertNumber(calculatedIndex) ? calculatedIndex : 0;
    const newIndex = clamp(0, safeIndex, this.#sections.length - 1);

    if (this.#index === newIndex) return;

    this.#index = newIndex;
    document.documentElement.dataset.currentIndex = newIndex.toString();

    this.#updateUrlHash();
  }

  #updatePortfolioColor() {
    if (this.isScrollOutsideRange) return;

    const newChannels = this.#tracker.update(
      sections[this.#index].channels,
      sections[this.nextIndex].channels,
      this.sectionScrollProgress,
    );

    this.#channels = newChannels.rgb;

    document.documentElement.style.setProperty(
      this.#selector.cssColorProp,
      newChannels.rgbCss,
    );
  }

  #rafCallback = () => {
    this.#updateIndex();
    this.#updatePortfolioColor();

    this.#isTicking = false;
  };

  #handleScroll = () => {
    if (this.#isTicking) return;

    this.#rafId = requestAnimationFrame(this.#rafCallback);
    this.#isTicking = true;
  };

  #handleResize = () => {
    this.#cacheHeight();
    this.#updateIndex();
    this.#updatePortfolioColor();
  };

  // Should probably just use rAF for this as well.
  // #debouncedResize = debounce(this.#handleResize, 240);
}
