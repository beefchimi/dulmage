export const DEBOUNCE_DURATION = 60 * 6;

export default function debounce(callback, wait = DEBOUNCE_DURATION) {
  let timeout = null;

  return function(...args) {
    // eslint-disable-next-line consistent-this, babel/no-invalid-this
    const context = this;

    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(context, args), wait);
  };
}
