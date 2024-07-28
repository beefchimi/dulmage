import {type SectionEntry, type ProjectEntry} from './types';

const intro: SectionEntry = {
  id: 'Intro',
  name: 'Hello',
  description: 'Portfolio site of Curtis Dulmage',
  thumbnail: '/assets/intro-flowers.webp',
  channels: [140, 84, 193],
};

///
/// Projects

const bodyMindChange: ProjectEntry = {
  id: 'BodyMindChange',
  name: 'Body Mind Change',
  description: 'David Cronenberg’s Body Mind Change presented by TIFF',
  thumbnail: '/assets/bg-body-mind-change.webp',
  channels: [255, 65, 0],
  logo: 'LogoBodyMindChange',
  attribution: 'Rene Antunes',
  client: [
    'TIFF / CFC Media Lab / David Cronenberg',
    'https://cfccreates.com/content-hub/body-mind-change',
  ],
  agency: ['Northern Army', 'https://northernarmy.com'],
  inactive: true,
};

const chicken: ProjectEntry = {
  id: 'Chicken',
  name: 'Chicken Farmers',
  description: 'Chicken Farmers of Canada',
  thumbnail: '/assets/bg-chicken.webp',
  channels: [248, 61, 74],
  logo: 'LogoChicken',
  attribution: 'Rene Antunes',
  client: ['Chicken Farmers of Canada', 'https://chicken.ca'],
  agency: ['Northern Army', 'https://northernarmy.com'],
  inactive: true,
};

const commerceAwards: ProjectEntry = {
  id: 'CommerceAwards',
  name: 'Commerce Awards',
  description: 'Shopify Commerce Awards 2017',
  thumbnail: '/assets/bg-commerce-awards.webp',
  channels: [156, 106, 222],
  logo: 'LogoShopify',
  url: 'https://www.siteinspire.com/websites/7422-shopify-commerce-awards-2017',
  attribution: 'Nick DeGiorgio',
  inhouse: [
    'Shopify Commerce Awards 2017',
    'https://www.shopify.com/commerce-awards',
  ],
  inactive: true,
};

const draggable: ProjectEntry = {
  id: 'Draggable',
  name: 'Draggable',
  description: 'The drag-and-drop library your grandparents warned you about',
  thumbnail: '/assets/bg-draggable.webp',
  channels: [0, 66, 255],
  logo: 'LogoDraggable',
  url: 'https://shopify.github.io/draggable',
  attribution: 'Curtis Dulmage',
  personal: ['Draggable', 'https://shopify.github.io/draggable'],
};

const earwurm: ProjectEntry = {
  id: 'Earwurm',
  name: 'Earwurm',
  description: 'Easier web audio for UI sound effects',
  thumbnail: '/assets/bg-earwurm.webp',
  channels: [237, 0, 55],
  logo: 'LogoEarwurm',
  url: 'https://beefchimi.github.io/earwurm/',
  attribution: 'Curtis Dulmage',
  personal: ['Earwurm', 'https://github.com/beefchimi/earwurm'],
};

const fringe: ProjectEntry = {
  id: 'Fringe',
  name: 'Ottawa Fringe',
  description: 'Ottawa Fringe Festival',
  thumbnail: '/assets/bg-fringe.webp',
  channels: [255, 90, 82],
  logo: 'LogoFringe',
  attribution: 'Mandira Midha',
  client: ['Ottawa Fringe Festival', 'https://ottawafringe.com'],
  agency: ['Northern Army', 'https://northernarmy.com'],
  inactive: true,
};

const northernArmy: ProjectEntry = {
  id: 'NorthernArmy',
  name: 'Northern Army',
  description: 'Independent branding & packaging studio',
  thumbnail: '/assets/bg-northern-army.webp',
  channels: [226, 172, 58],
  logo: 'LogoNorthernArmy',
  url: 'https://northernarmy.com',
  attribution: 'Rene Antunes',
  inhouse: ['Northern Army', 'https://northernarmy.com'],
  inactive: true,
};

const northNavy: ProjectEntry = {
  id: 'NorthNavy',
  name: 'North & Navy',
  description: 'North and Navy restaurant',
  thumbnail: '/assets/bg-north-navy.webp',
  channels: [21, 53, 91],
  logo: 'LogoNorthNavy',
  url: 'https://northandnavy.com',
  attribution: 'Rene Antunes',
  client: ['North & Navy', 'https://northandnavy.com'],
  agency: ['Northern Army', 'https://northernarmy.com'],
};

const polaris: ProjectEntry = {
  id: 'Polaris',
  name: 'Polaris',
  description: 'Shopify Polaris Styleguide',
  thumbnail: '/assets/bg-polaris.webp',
  channels: [56, 80, 177],
  logo: 'LogoShopify',
  url: 'https://polaris.shopify.com',
  attribution: 'Alistair Lane',
  inhouse: ['Shopify Polaris Styleguide', 'https://www.shopify.com'],
  inactive: true,
};

const preserve: ProjectEntry = {
  id: 'PreservationSociety',
  name: 'Preservation Society ',
  description: 'Northern Army Preservation Society of Canada',
  thumbnail: '/assets/bg-preservation-society.webp',
  channels: [255, 195, 12],
  logo: 'LogoPreservationSociety',
  url: 'https://preserve.northernarmy.com',
  attribution: 'Rene Antunes',
  inhouse: ['Northern Army', 'https://northernarmy.com'],
};

const sandwich: ProjectEntry = {
  id: 'SandwichVideo',
  name: 'Sandwich Video',
  description: 'Video production studio and sandwich enthusiasts',
  // Keeping this as a PNG as it is so much smaller than the WEBP version.
  thumbnail: '/assets/bg-sandwich-video.png',
  channels: [207, 44, 71],
  logo: 'LogoSandwichVideo',
  attribution: 'Rene Antunes',
  client: ['Sandwich Video', 'https://sandwichvideo.com'],
  agency: ['Northern Army', 'https://northernarmy.com'],
  inactive: true,
};

const tetchi: ProjectEntry = {
  id: 'Tetchi',
  name: 'Tetchi',
  description: 'Tribute to Tetsuro Takara',
  thumbnail: '/assets/bg-tetchi.webp',
  channels: [2, 0, 255],
  logo: 'LogoTetchi',
  attribution: 'Curtis Dulmage',
  personal: ['Tetchi', 'https://codepen.io/tetchi'],
  inactive: true,
};

const yat: ProjectEntry = {
  id: 'Yat',
  name: 'Yat Labs',
  description: 'Intergalactic Web 3',
  thumbnail: '/assets/bg-yat.webp',
  channels: [87, 18, 222],
  logo: 'LogoYat',
  url: 'https://y.at/',
  attribution: 'Karim Balaa',
  inhouse: ['Yat Floor Game', 'https://www.freshcontrast.com/'],
  inactive: true,
};

export const sections: [intro: SectionEntry, ...projects: ProjectEntry[]] = [
  intro,
  bodyMindChange,
  polaris,
  preserve,
  fringe,
  yat,
  earwurm,
  northNavy,
  northernArmy,
  sandwich,
  tetchi,
  chicken,
  draggable,
  commerceAwards,
];
