export function gtag() {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

export default class Analytics {
  constructor(elements, ua) {
    this.elements = elements;
    this.ua = ua;
  }

  init() {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log('🤖 Analytics disabled in local development.');
      return;
    }

    this._appendScript()
      .then(() => {
        window.dataLayer = window.dataLayer || [];

        gtag('js', new Date());
        gtag('config', this.ua);

        this.elements.forEach(element => {
          this._clickHandler(element);
          this._auxHandler(element);
        });

        console.log(`👾 Analytics registered for ${this.ua}`);

        return window.dataLayer;
      })
      .catch(error => console.warn(error));
  }

  _appendScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      document.body.appendChild(script);
      script.onload = resolve;
      script.onerror = reject;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.ua}`;
    });
  }

  _trackEvent(evt) {
    if (evt.type !== 'auxclick') {
      evt.preventDefault();
    }

    // Since Google Tag Manager also appends analytics.js,
    // it makes ordered execution difficult.
    // To get around the problem,
    // we don't send GA Events / block clicks until GA is on the Window.
    if (window.ga && window.ga.create) {
      /* eslint-disable babel/camelcase */
      gtag('event', 'click', {
        event_category: this.dataset.gtagCategory,
        event_label: this.title,
        transport_type: 'beacon',
        event_callback: () => {
          if (evt.type !== 'auxclick') {
            document.location = this.href;
          }
        },
      });
      /* eslint-enable babel/camelcase */
    } else if (evt.type !== 'auxclick') {
      document.location = this.href;
    }
  }

  _clickHandler(element) {
    // Works for both primary click and enter key
    element.addEventListener('click', this._trackEvent);
  }

  _auxHandler(element) {
    // Captures the middle mouse button
    element.addEventListener('auxclick', this._trackEvent);
  }
}
