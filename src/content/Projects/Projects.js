import PreservationSociety from './PreservationSociety';
import BodyMindChange from './BodyMindChange';
import Draggable from './Draggable';
import NorthernArmy from './NorthernArmy';
import Fringe from './Fringe';
import NorthNavy from './NorthNavy';
import SandwichVideo from './SandwichVideo';
import CommerceAwards from './CommerceAwards';
import NorthernArmy2012 from './NorthernArmy2012';
import PartnersAcademy from './PartnersAcademy';
import Chicken from './Chicken';
import PolarisStyleguide from './PolarisStyleguide';

const Projects = [
  PreservationSociety,
  BodyMindChange,
  Draggable,
  NorthernArmy,
  Fringe,
  NorthNavy,
  SandwichVideo,
  CommerceAwards,
  NorthernArmy2012,
  PartnersAcademy,
  Chicken,
  PolarisStyleguide,
];

const PROJECTS_ATTRIBUTION_ATTR = 'data-attribution-project';

export function applyProjectsAttribution() {
  const sections = document.querySelectorAll(`[${PROJECTS_ATTRIBUTION_ATTR}]`);

  // TODO: I would prefer to utilize the `key` instead of index,
  // as its possible we could have sections that do not have attribution.
  // https://github.com/beefchimi/dulmage/issues/40
  [...sections].forEach((section, index) => {
    section.textContent = `${section.textContent} ${Projects[index].attribution}`;
  });
}

export default Projects;
