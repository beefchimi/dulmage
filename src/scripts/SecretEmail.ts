import {type EmailParts} from '@data/types';

const DEFAULT_CLASSNAMES = {
  secret: 'secret-email',
  replace: 'secret-email--replace',
};

export class SecretEmail {
  static readonly defaultSecretClass = DEFAULT_CLASSNAMES.secret;
  static readonly defaultReplaceClass = DEFAULT_CLASSNAMES.replace;

  readonly email: string;
  readonly secretClass: string;
  readonly replaceClass: string;

  #links: HTMLCollectionOf<Element>;

  constructor(
    {local, domain, suffix}: EmailParts,
    {secret, replace} = DEFAULT_CLASSNAMES,
  ) {
    this.email = `${local}@${domain}.${suffix}`;
    this.secretClass = secret;
    this.replaceClass = replace;

    this.#links = document.getElementsByClassName(this.secretClass);
  }

  replaceEmails() {
    if (this.#links.length === 0) return;

    [...this.#links].forEach((link) => {
      if (link.classList.contains(this.replaceClass)) {
        link.textContent = this.email;
      }

      link.setAttribute('href', `mailto:${this.email}`);
    });
  }
}
