// Generate a unique ID
// https://gist.github.com/gordonbrander/2230317
const defaultOptions = {
  prefix: '_',
  length: '10',
};

export default function generateUniqueString(options = defaultOptions) {
  return `${options.prefix}${Math.random()
    .toString(36)
    .substr(2, options.length - 1)}`;
}
