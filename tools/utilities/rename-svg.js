import sentenceCase from './sentence-case';

// Assumes a filename convention of:
// `qualifier-basename`, `logo-shopify.svg`, `ui-cursor-pointer.svg`, etc...
export default function renameSvg(symbol) {
  const name = symbol.basename.split('-').map((word) => {
    return sentenceCase(word);
  });

  symbol.basename = `Svg${name.join('')}`;
}
