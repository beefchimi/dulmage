import {getUrlForAssetPng, randomIntBetweenRange} from '../../scripts/utilities';

const INTRO_SLIDES = [
  {
    title: 'Beach',
    channels: {
      red: 134,
      green: 160,
      blue: 197,
    },
  },
  {
    title: 'Bridge',
    channels: {
      red: 110,
      green: 145,
      blue: 110,
    },
  },
  {
    title: 'Flowers',
    channels: {
      red: 140,
      green: 84,
      blue: 193,
    },
  },
  {
    title: 'Forest',
    channels: {
      red: 189,
      green: 187,
      blue: 56,
    },
  },
  {
    title: 'The Gut',
    channels: {
      red: 106,
      green: 96,
      blue: 25,
    },
  },
  {
    title: 'Tropical',
    channels: {
      red: 186,
      green: 64,
      blue: 79,
    },
  },
  {
    title: 'Worship',
    channels: {
      red: 203,
      green: 78,
      blue: 74,
    },
  },
];

function randomIntroSlide() {
  return INTRO_SLIDES[randomIntBetweenRange(0, INTRO_SLIDES.length - 1)];
}

const Intro = randomIntroSlide();

export function applyIntroSlideBackground() {
  const introSection = document.getElementById('Intro');

  if (!introSection) {
    return;
  }

  const assetTitle = Intro.title.toLowerCase().replace(/ /g, '-');
  const assetPath = getUrlForAssetPng(`intro-${assetTitle}`);

  introSection.style.backgroundImage = `url(${assetPath})`;
}

export default Intro;
