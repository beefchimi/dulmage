export function pxToRem(value = 0, base = 10) {
  return value / base;
}

export function strUnit(value = 0) {
  return `${pxToRem(value)}rem`;
}

// TODO: Currently not using this file.
export const tokens = {
  component: {
    value: 1,
  },
};
