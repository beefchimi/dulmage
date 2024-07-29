export class NavTracker {
  #items: NodeListOf<Element>;
  #lastSavedIndex = 0;

  constructor(selector = 'nav ul li') {
    this.#items = document.querySelectorAll(selector);
  }

  update(currentIndex = 0) {
    this.#items.forEach((element, index) => {
      if (index === currentIndex) {
        element.setAttribute('data-current', 'true');
      } else {
        element.removeAttribute('data-current');
      }
    });
  }

  safeUpdate(currentIndex = 0) {
    if (this.#lastSavedIndex === currentIndex) return;

    this.#lastSavedIndex = currentIndex;
    this.update(currentIndex);
  }
}
