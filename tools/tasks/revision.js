import fs from 'fs';

import revHash from 'rev-hash';

import cacheManifest from '../../src/scripts/cache-manifest';

export const assetsManifestPath = './assets-manifest.json';

export function revision() {
  return new Promise((resolve) => {
    const obj = {};

    cacheManifest.forEach((item) => {
      const key = item.replace('dist/', '');
      obj[key] = revHash(fs.readFileSync(item));
    });

    resolve(obj);
  })
    .then((manifest) =>
      fs.writeFileSync(assetsManifestPath, JSON.stringify(manifest, null, 2), 'utf-8'),
    )
    .catch((error) => console.error(error));
}
