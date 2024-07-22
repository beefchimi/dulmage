import {TOAST_TMPL_ID} from '@data/app';

export type ToastDismissFn = (event: Event) => void;
export type ToastExitedFn = (event: AnimationEvent) => void;

export interface ToastNotificationProps {
  message: string;
  ariaLabel?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
}

// TODO: We should use `emitten` and emit events for:
// `dismiss`, `exited`, `interact`, and `blurinteract`.
export class ToastNotification {
  #node: HTMLButtonElement | null = null;
  #dismissCallback: ToastDismissFn | undefined;
  #exitedCallback: ToastExitedFn | undefined;
  #originalId = '';
  #timeoutId = 0;

  static getButtonFromFragment(frag?: DocumentFragment | Node) {
    if (frag instanceof DocumentFragment) {
      return frag.querySelector('button');
    }

    return frag instanceof HTMLButtonElement ? frag : undefined;
  }

  constructor(
    id: string,
    props: ToastNotificationProps,
    onDismiss?: ToastDismissFn,
    onExited?: ToastExitedFn,
  ) {
    const template = document.querySelector<HTMLTemplateElement>(
      `#${TOAST_TMPL_ID}`,
    );
    const cloned = template?.content.cloneNode(true);
    const extracted = ToastNotification.getButtonFromFragment(cloned);

    if (!extracted) {
      return this;
    }

    this.#node = extracted;
    this.#dismissCallback = onDismiss;
    this.#exitedCallback = onExited;
    this.#originalId = extracted.id;

    this.#setButtonProps(id, props.ariaLabel);
    this.#setMessageProps(props.message);
    this.#setImageProps(props.thumbnail, props.thumbnailAlt);
  }

  get html() {
    return this.#node;
  }

  dismiss(delay = 0) {
    // We may have already called dismiss with a `delay`,
    // so we will cancel the previous timer.
    if (this.#timeoutId) {
      window.clearTimeout(this.#timeoutId);
    }

    this.#timeoutId = window.setTimeout(() => {
      if (this.#node) {
        this.#node.dataset.toastExiting = 'true';
      }
    }, delay);

    return this;
  }

  cancelDismissTimer() {
    window.clearTimeout(this.#timeoutId);
  }

  #teardown = () => {
    if (this.#timeoutId) {
      window.clearTimeout(this.#timeoutId);
    }

    if (!this.#node) return;

    const capturedId = this.#node.id;
    const foundNode =
      capturedId && capturedId !== this.#originalId
        ? document.getElementById(capturedId)
        : null;

    this.#node.removeEventListener('click', this.#handleDismiss);
    this.#node.removeEventListener('animationend', this.#handleExited);
    foundNode?.remove();

    this.#node = null;
  };

  #handleDismiss: ToastDismissFn = (event) => {
    this.#dismissCallback?.(event);
    this.dismiss();
  };

  #handleExited: ToastExitedFn = (event) => {
    if (event.animationName === 'toastExit') {
      this.#exitedCallback?.(event);
      this.#teardown();
    }
  };

  #setButtonProps(id: string, ariaLabel = '') {
    if (!this.#node) return;

    this.#node.id = id;
    this.#node.ariaLabel = ariaLabel;

    this.#node.addEventListener('click', this.#handleDismiss);
    this.#node.addEventListener('animationend', this.#handleExited);
  }

  #setMessageProps(message = '') {
    const nodes = this.#node?.getElementsByTagName('p');
    const messageNode = nodes?.[0];

    if (messageNode && message) {
      messageNode.textContent = message;
    }
  }

  #setImageProps(thumbnail = '', thumbnailAlt = '') {
    const nodes = this.#node?.getElementsByTagName('img');
    const imageNode = nodes?.[0];

    if (imageNode && thumbnail) {
      imageNode.src = thumbnail;
    }

    if (imageNode && thumbnailAlt) {
      imageNode.alt = thumbnailAlt;
    }
  }
}
