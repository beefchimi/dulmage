import {debounce} from '../../scripts/utilities';
import Intro from '../../content/Intro';
import Projects from '../../content/Projects';
import ColorFactory from '../ColorFactory';

const SECTION_DATA = [Intro, ...Projects];
const DEFAULT_PORTFOLIO_COLOR_PROPERTY = '--dulmage-color';

const portfolioColor = new ColorFactory();

export default class Portfolio {
  constructor() {
    this.portfolio = document.documentElement;
    this.sections = document.querySelectorAll('.Section');
    this.windowHeight = 0;
    this.documentHeight = 0;
    this._index = 0;
    this._channels = {
      red: 0,
      green: 0,
      blue: 0,
    };

    this._scrollTicking = false;
    this.updatePortfolioColor = this._updatePortfolioColor.bind(this);

    this.handleOnScroll = this._handleOnScroll.bind(this);
    this.handleOnResize = this._handleOnResize.bind(this);
  }

  get currentIndex() {
    const calculatedIndex = Math.floor(window.scrollY / this.windowHeight);
    return isNaN(calculatedIndex) ? 0 : calculatedIndex;
  }

  set currentIndex(index) {
    this._index = index;
    this.portfolio.dataset.currentIndex = index;
    this.updateUrlHash(index);
  }

  get nextIndex() {
    return this._index >= this.sections.length - 1 ? this._index : this._index + 1;
  }

  set currentChannels({red, green, blue}) {
    this._channels = {
      red,
      green,
      blue,
    };
    this.portfolio.style.setProperty(
      DEFAULT_PORTFOLIO_COLOR_PROPERTY,
      `rgb(${red}, ${green}, ${blue})`,
    );
  }

  get sectionScrollProgress() {
    return ((this._index * this.windowHeight - window.scrollY) / this.windowHeight) * 100;
  }

  init() {
    this.cacheHeightValues();

    const index = this.currentIndex;
    this.currentIndex = index;

    this.updatePortfolioColor();
    this.registerEventListeners();
  }

  cacheHeightValues() {
    this.windowHeight = window.innerHeight;
    this.documentHeight = document.documentElement.scrollHeight;
  }

  registerEventListeners() {
    window.addEventListener('scroll', this.handleOnScroll, {passive: true});
    window.addEventListener('resize', debounce(this.handleOnResize), {passive: true});
  }

  updateUrlHash(index = 0) {
    if (index > this.sections.length) {
      return;
    }

    const urlHash = index === 0 ? ' ' : `#${SECTION_DATA[index].title.replace(/ /g, '')}`;
    history.replaceState(null, null, urlHash);
  }

  updateSectionIndex() {
    if (this._isScrollOutsideRange()) {
      return;
    }

    const newIndex = this.currentIndex;

    // Comparing the privately stored index,
    // against what is calculated "at the moment" from the `getter`.
    if (this._index === newIndex) {
      return;
    }

    this.currentIndex = newIndex;
  }

  _updatePortfolioColor() {
    this._scrollTicking = false;

    if (this._isScrollOutsideRange()) {
      return;
    }

    this.currentChannels = portfolioColor.calculateColorDifferential(
      SECTION_DATA[this._index].channels,
      SECTION_DATA[this.nextIndex].channels,
      this.sectionScrollProgress,
    );
  }

  _isScrollOutsideRange() {
    const scrollY = window.scrollY;
    return scrollY < 0 || scrollY > this.documentHeight;
  }

  _requestScrollTick() {
    if (!this._scrollTicking) {
      requestAnimationFrame(this.updatePortfolioColor);
    }

    this._scrollTicking = true;
  }

  _handleOnScroll() {
    this.updateSectionIndex();
    this._requestScrollTick();
  }

  _handleOnResize() {
    this.cacheHeightValues();
    this.updateSectionIndex();
    this.updatePortfolioColor();
  }
}
