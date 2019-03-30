import {PREFERS_REDUCED_MOTION} from '../../scripts/utilities';

const DEFAULT_ANCHOR_SELECTOR = '[data-scroll-action]';
const DEFAULT_SCROLL_OPTIONS = {
  // behavior: PREFERS_REDUCED_MOTION ? 'instant' : 'smooth',
  behavior: 'smooth',
};

export default class ProjectsMenu {
  constructor(selector = DEFAULT_ANCHOR_SELECTOR) {
    this.links = document.querySelectorAll(selector);
    this.anchors = {};
    this.scrollToAnchor = this._scrollToAnchor.bind(this);
  }

  init() {
    if (PREFERS_REDUCED_MOTION || this.links == null || this.links.length === 0) {
      return;
    }

    this.links.forEach(link => link.addEventListener('click', this.scrollToAnchor));
  }

  _scrollToAnchor(event) {
    event.preventDefault();

    const anchorId = getAnchorIdFromLink(event.currentTarget);

    if (!this.anchors.hasOwnProperty(anchorId)) {
      this.anchors[anchorId] = document.getElementById(anchorId);
    }

    if (!this.anchors[anchorId]) {
      return;
    }

    this.anchors[anchorId].scrollIntoView(DEFAULT_SCROLL_OPTIONS);
  }
}

// This chould use REGEX, would probably be safer.
function getAnchorIdFromLink(link) {
  return link.href.split('#')[1];
}
