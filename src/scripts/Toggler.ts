export class Toggler {
  #initialized = false;
  #pressed = false;

  readonly activator: HTMLElement | null;
  readonly target: HTMLElement | null;

  constructor(activatorId = '', controlsId = '', initialState = false) {
    this.activator = document.getElementById(activatorId);
    this.target = document.getElementById(controlsId);
    this.#pressed = initialState;
  }

  get pressed() {
    return this.#pressed;
  }

  init() {
    if (!this.activator || !this.target || this.#initialized) {
      return this;
    }

    this.#updateAttributes();
    this.activator.addEventListener('click', this.toggle);
    this.#initialized = true;

    return this;
  }

  teardown() {
    // After teardown, this instance can never be re-initialized.
    this.activator?.removeEventListener('click', this.toggle);
    return this;
  }

  toggle = () => {
    if (!this.activator) return this;

    this.#pressed = !this.#pressed;
    this.#updateAttributes();

    // The `data-toggler-state` has three values: `idle`, `active`, and `inactive`.
    // The Toggler needs to be `idle` upon initialization in order for the
    // animations to work correctly. Calling this within `toggle()` so we don't
    // immediately break the "page load animation" when `init()` is called.
    this.activator.dataset.togglerState = this.#pressed ? 'active' : 'inactive';

    return this;
  };

  #updateAttributes() {
    this.activator?.setAttribute('aria-expanded', this.#pressed.toString());
    this.target?.setAttribute(
      'aria-hidden',
      Boolean(!this.#pressed).toString(),
    );
  }
}
