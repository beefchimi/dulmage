import PreservationSociety from './PreservationSociety';
import BodyMindChange from './BodyMindChange';
import NorthernArmy from './NorthernArmy';
import Fringe from './Fringe';
import NorthNavy from './NorthNavy';
import CommerceAwards from './CommerceAwards';
import NorthernArmy2012 from './NorthernArmy2012';
import PartnersAcademy from './PartnersAcademy';
import Pukeko from './Pukeko';
import Chicken from './Chicken';

const Projects = [
  PreservationSociety,
  BodyMindChange,
  NorthernArmy,
  Fringe,
  NorthNavy,
  CommerceAwards,
  NorthernArmy2012,
  PartnersAcademy,
  Pukeko,
  Chicken,
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
