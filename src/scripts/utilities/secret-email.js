const DEFAULT_EMAIL_ADDRESS = {
  local: 'me',
  domain: 'example',
  suffix: 'com',
};

const DEFAULT_CLASSNAMES = {
  secret: 'secret-email',
  replace: 'secret-email--replace',
};

export default function secretEmail(
  email = DEFAULT_EMAIL_ADDRESS,
  classNames = DEFAULT_CLASSNAMES,
) {
  const links = document.getElementsByClassName(classNames.secret);

  if (links.length === 0) {
    return;
  }

  const {local, domain, suffix} = email;
  const address = `${local}@${domain}.${suffix}`;

  [...links].forEach((link) => {
    if (link.classList.contains(classNames.replace)) {
      link.textContent = address;
    }

    link.setAttribute('href', `mailto:${address}`);
  });
}
