import browsersync from 'browser-sync';

import {serviceWorker} from './index';

export const server = browsersync.create();

// Reload function requires a callback in order to reload properly
export function reloadServer(done) {
  server.reload();
  done();
}

export function startServer() {
  const serverConfig = {
    open: false,
    // https: true,
    server: './dist',
    ghostMode: false,
  };

  server.init(serverConfig, serviceWorker);
}
