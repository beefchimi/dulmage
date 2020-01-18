import {startServer} from '../server';

import {favicons} from './favicons';
import {fonts} from './fonts';
import {images} from './images';
import {revision} from './revision';
import {root} from './root';
import {scripts} from './scripts';
import {styles} from './styles';
import {svg} from './svg';
import {social} from './social';
import {sw} from './sw';
import {views} from './views';

const tasks = {
  startServer,
  favicons,
  fonts,
  images,
  revision,
  root,
  scripts,
  styles,
  svg,
  social,
  sw,
  views,
};

export default tasks;
