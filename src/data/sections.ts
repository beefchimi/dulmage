import {type SectionEntry, type ProjectEntry} from './types';

const intro: SectionEntry = {
  id: 'Intro',
  name: 'Hello',
  description: 'Portfolio site of Curtis Dulmage',
  thumbnail: '/assets/intro-flowers.png',
  channels: [140, 84, 193],
};

const preserve: ProjectEntry = {
  id: 'PreservationSociety',
  name: 'Preserve',
  description: 'Northern Army Preservation Society of Canada',
  thumbnail: '/assets/bg-preservation-society.png',
  channels: [255, 195, 12],
  logo: 'LogoPreservationSociety',
  url: 'https://preserve.northernarmy.com',
  attribution: 'Rene Antunes',
  inhouse: ['Northern Army', 'https://northernarmy.com'],
};

const bodyMindChange: ProjectEntry = {
  id: 'BodyMindChange',
  name: 'Body Mind Change',
  description: 'David Cronenberg’s Body Mind Change presented by TIFF',
  thumbnail: '/assets/bg-body-mind-change.png',
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

const draggable: ProjectEntry = {
  id: 'Draggable',
  name: 'Draggable',
  description: 'The drag-and-drop library your grandparents warned you about',
  thumbnail: '/assets/bg-draggable.png',
  channels: [0, 66, 255],
  logo: 'LogoDraggable',
  url: 'https://shopify.github.io/draggable',
  attribution: 'Curtis Dulmage',
  personal: ['Draggable', 'https://shopify.github.io/draggable'],
};

const northernArmy: ProjectEntry = {
  id: 'NorthernArmy',
  name: 'Northern Army',
  description: 'Independent branding & packaging studio',
  thumbnail: '/assets/bg-northern-army.png',
  channels: [226, 172, 58],
  logo: 'LogoNorthernArmy',
  url: 'https://northernarmy.com',
  attribution: 'Rene Antunes',
  inhouse: ['Northern Army', 'https://northernarmy.com'],
  inactive: true,
};

const fringe: ProjectEntry = {
  id: 'Fringe',
  name: 'Ottawa Fringe',
  description: 'Ottawa Fringe Festival',
  thumbnail: '/assets/bg-fringe.png',
  channels: [255, 90, 82],
  logo: 'LogoFringe',
  attribution: 'Mandira Midha',
  client: ['Ottawa Fringe Festival', 'https://ottawafringe.com'],
  agency: ['Northern Army', 'https://northernarmy.com'],
  inactive: true,
};

const northNavy: ProjectEntry = {
  id: 'NorthNavy',
  name: 'North & Navy',
  description: 'North and Navy restaurant',
  thumbnail: '/assets/bg-north-navy.png',
  channels: [21, 53, 91],
  logo: 'LogoNorthNavy',
  url: 'https://northandnavy.com',
  attribution: 'Rene Antunes',
  client: ['North & Navy', 'https://northandnavy.com'],
  agency: ['Northern Army', 'https://northernarmy.com'],
};

const sandwich: ProjectEntry = {
  id: 'SandwichVideo',
  name: 'Sandwich Video',
  description: 'Video production studio and sandwich enthusiasts',
  thumbnail: '/assets/bg-sandwich-video.png',
  channels: [207, 44, 71],
  logo: 'LogoSandwichVideo',
  attribution: 'Rene Antunes',
  client: ['Sandwich Video', 'https://sandwichvideo.com'],
  agency: ['Northern Army', 'https://northernarmy.com'],
  inactive: true,
};

const commerceAwards: ProjectEntry = {
  id: 'CommerceAwards',
  name: 'Commerce Awards',
  description: 'Shopify Commerce Awards 2017',
  thumbnail: '/assets/bg-commerce-awards.png',
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

const na2012: ProjectEntry = {
  id: 'NorthernArmy2012',
  name: 'NA 2012',
  description: 'Legacy Northern Army 2012',
  thumbnail: '/assets/bg-northern-army-2012.png',
  channels: [234, 72, 72],
  logo: 'LogoNorthernArmy',
  attribution: 'Rene Antunes',
  inhouse: ['Northern Army', 'https://northernarmy.com'],
  inactive: true,
};

const chicken: ProjectEntry = {
  id: 'Chicken',
  name: 'Chicken Farmers',
  description: 'Chicken Farmers of Canada',
  thumbnail: '/assets/bg-chicken.png',
  channels: [248, 61, 74],
  logo: 'LogoChicken',
  attribution: 'Rene Antunes',
  client: ['Chicken Farmers of Canada', 'https://chicken.ca'],
  agency: ['Northern Army', 'https://northernarmy.com'],
  inactive: true,
};

const polaris: ProjectEntry = {
  id: 'Polaris',
  name: 'Polaris Styleguide',
  description: 'Shopify Polaris Styleguide',
  thumbnail: '/assets/bg-polaris-styleguide.png',
  channels: [56, 80, 177],
  logo: 'LogoShopify',
  url: 'https://polaris.shopify.com',
  attribution: 'Alistair Lane',
  inhouse: ['Shopify Polaris Styleguide', 'https://www.shopify.com'],
  inactive: true,
};

const earwurm: ProjectEntry = {
  id: 'Earwurm',
  name: 'Earwurm Audio',
  description: 'Easier web audio for UI sound effects',
  thumbnail: '/assets/bg-earwurm.png',
  channels: [237, 105, 0],
  logo: 'LogoEarwurm',
  url: 'https://beefchimi.github.io/earwurm/',
  attribution: 'Curtis Dulmage',
  personal: ['Earwurm', 'https://github.com/beefchimi/earwurm'],
};

const tetchi: ProjectEntry = {
  id: 'Tetchi',
  name: 'Tetsuro Takara',
  description: 'Tribute to the greatest man',
  thumbnail: '/assets/bg-tetchi.png',
  channels: [136, 63, 64],
  logo: 'LogoTetchi',
  url: 'https://live.staticflickr.com/5294/5503094244_2994460d49_b.jpg',
  attribution: 'Curtis Dulmage',
  personal: ['Tetchi', 'https://codepen.io/tetchi'],
  inactive: true,
};

const yat: ProjectEntry = {
  id: 'Yat',
  name: 'Yat Labs',
  description: 'Floor Game / What goes up / Must come down',
  thumbnail: '/assets/bg-yat.png',
  channels: [87, 18, 222],
  logo: 'LogoYat',
  url: 'https://y.at/',
  attribution: 'Karim Balaa',
  inhouse: ['Yat Floor Game', 'https://www.freshcontrast.com/'],
  inactive: true,
};

export const sections: [intro: SectionEntry, ...projects: ProjectEntry[]] = [
  intro,
  preserve,
  bodyMindChange,
  draggable,
  northernArmy,
  fringe,
  northNavy,
  sandwich,
  commerceAwards,
  na2012,
  chicken,
  polaris,
  earwurm,
  tetchi,
  yat,
];
