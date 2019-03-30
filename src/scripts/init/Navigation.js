// eslint-disable-next-line shopify/strict-component-boundaries
import Hamburger from '../../components/Hamburger';
// eslint-disable-next-line shopify/strict-component-boundaries
import ProjectsMenu from '../../components/ProjectsMenu';

export default function initNavigation() {
  const menuActivator = new Hamburger();
  menuActivator.init();

  const menu = new ProjectsMenu();
  menu.init();
}
