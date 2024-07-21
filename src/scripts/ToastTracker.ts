import {ToastNotification} from './ToastNotification';

type AddArgs = ConstructorParameters<typeof ToastNotification>;

// TODO: Add event for `count` change using `emitten`.
export class ToastTracker {
  static MAX_SIZE = 10;
  static DISMISS_AFTER_MS = 9999;

  #portal: HTMLElement;
  #queue: Map<string, ToastNotification>;
  #historyCount = 0;

  constructor(portalNode?: HTMLElement | null) {
    // TODO: Consider making auto-dismiss behaviour customizable.
    this.#portal = portalNode ?? document.body;
    this.#queue = new Map();
  }

  get totalCreated() {
    return this.#historyCount;
  }

  get count() {
    return this.#queue.size;
  }

  get maxReached() {
    return this.count >= ToastTracker.MAX_SIZE;
  }

  get keys() {
    return this.#queue.keys();
  }

  get(id = '') {
    return id ? this.#queue.get(id) : undefined;
  }

  has(id = '') {
    return id ? this.#queue.has(id) : false;
  }

  add(...toastArgs: AddArgs) {
    const [id, props, onDismiss, onExited] = toastArgs;

    if (this.maxReached) {
      console.warn(
        'ToastTracker max size reached. Discarding creation of:',
        id,
      );
      return;
    }

    const existingToast = this.#queue.get(id);

    if (existingToast) {
      console.warn(
        'ToastTracker already contains an active notification for:',
        id,
      );
      return existingToast;
    }

    const newToast = new ToastNotification(
      id,
      props,
      (event) => {
        onDismiss?.(event);
      },
      (event) => {
        this.#queue.delete(id);
        onExited?.(event);

        if (event.target instanceof HTMLButtonElement) {
          this.#removeInteractions(event.target);
        }
      },
    );

    const markup = newToast.html;

    if (!markup) {
      console.warn('ToastTracker was unable to create a notification for:', id);
      return;
    }

    this.#historyCount++;
    this.#queue.set(id, newToast);
    this.#portal.appendChild(markup);
    newToast.dismiss(ToastTracker.DISMISS_AFTER_MS);

    this.#enableInteractions(markup);

    return newToast;
  }

  clear() {
    this.#queue.forEach((entry) => {
      entry.dismiss();
    });

    return this;
  }

  #handlePauseAll = () => {
    this.#queue.forEach((entry) => {
      entry.cancelDismissTimer();
    });
  };

  #handleResumeAll = () => {
    // TODO: This would be improved by restoring the
    // elapsed time, rather than a staggered duration.
    let increment = 0;

    this.#queue.forEach((entry) => {
      const offset = (this.count - increment) * 200;
      entry.dismiss(ToastTracker.DISMISS_AFTER_MS - offset);
      increment++;
    });
  };

  #enableInteractions(target?: HTMLButtonElement | null) {
    if (!target) return;

    // In case we ever want to `pause/resume` the individual Taast:
    // const pause = () => toast.cancelDismissTimer();
    // const resume = () => toast.dismiss(ToastTracker.DISMISS_AFTER_MS);

    target.addEventListener('focus', this.#handlePauseAll);
    target.addEventListener('pointerenter', this.#handlePauseAll);

    target.addEventListener('blur', this.#handleResumeAll);
    target.addEventListener('pointerleave', this.#handleResumeAll);
    target.addEventListener('pointercancel', this.#handleResumeAll);
  }

  #removeInteractions(target?: HTMLButtonElement | null) {
    if (!target) return;

    target.removeEventListener('focus', this.#handlePauseAll);
    target.removeEventListener('pointerenter', this.#handlePauseAll);

    target.removeEventListener('blur', this.#handleResumeAll);
    target.removeEventListener('pointerleave', this.#handleResumeAll);
    target.removeEventListener('pointercancel', this.#handleResumeAll);
  }
}
