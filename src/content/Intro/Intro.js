import {getUrlForAssetPng, randomIntBetweenRange} from '../../scripts/utilities';

const INTRO_SLIDES = [
  {
    title: 'Beach',
    attribution: 'Curtis Dulmage',
    channels: {
      red: 134,
      green: 160,
      blue: 197,
    },
  },
  {
    title: 'Flowers',
    attribution: 'Curtis Dulmage',
    channels: {
      red: 140,
      green: 84,
      blue: 193,
    },
  },
  {
    title: 'Forest',
    attribution: 'Curtis Dulmage',
    channels: {
      red: 139,
      green: 157,
      blue: 47,
    },
  },
  {
    title: 'The Gut',
    attribution: 'Curtis Dulmage',
    channels: {
      red: 106,
      green: 96,
      blue: 25,
    },
  },
  {
    title: 'Tropical',
    attribution: 'Curtis Dulmage',
    channels: {
      red: 186,
      green: 64,
      blue: 79,
    },
  },
  {
    title: 'Xander',
    attribution: 'Alexander Thomas Stobbs',
    channels: {
      red: 98,
      green: 79,
      blue: 135,
    },
  },
];

const INTRO_SECTION_ID = 'Intro';
const INTRO_ATTRIBUTION_SELECTOR = '[data-attribution-intro]';

function randomIntroSlide() {
  return INTRO_SLIDES[randomIntBetweenRange(0, INTRO_SLIDES.length - 1)];
}

export function applyIntroAttribution(attribution) {
  const element = document.querySelector(INTRO_ATTRIBUTION_SELECTOR);

  if (!element) {
    return;
  }

  element.textContent = `${element.textContent} ${attribution}`;
}

export function applyIntroSlideBackground(title) {
  const introSection = document.getElementById(INTRO_SECTION_ID);

  if (!introSection) {
    return;
  }

  const assetTitle = title.toLowerCase().replace(/ /g, '-');
  const assetPath = getUrlForAssetPng(`intro-${assetTitle}`);

  introSection.style.backgroundImage = `url(${assetPath})`;
}

const Intro = randomIntroSlide();

export default Intro;
