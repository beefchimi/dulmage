const DEFAULT_ID = 'ProjectsMenuActivator';

// TODO: Currently, we initially set `aria-expanded` to `undefined` ONLY
// to achieve the right styling on initial page load...
// this invalidates the a11y and should be fixed!

export default class Hamburger {
  constructor(id = DEFAULT_ID) {
    this.activator = document.getElementById(id);
    this.toggle = this.toggle.bind(this);
  }

  init() {
    if (this.activator == null) {
      return;
    }

    this.activator.addEventListener('click', this.toggle);
  }

  toggle() {
    const isActive = this.activator.getAttribute('aria-expanded') === 'true';
    this.activator.setAttribute('aria-expanded', !isActive);

    return !isActive;
  }
}
