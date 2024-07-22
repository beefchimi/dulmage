import {assertNumber, clamp} from 'beeftools';
import {type RgbChannels} from '@data/types';

const MIN_RGB = 0;
const MAX_RGB = 255;

const MIN_ALPHA = 0;
const MAX_ALPHA = 1;

const DEFAULT_CHANNELS: RgbChannels = [MIN_RGB, MIN_RGB, MIN_RGB, MAX_ALPHA];

export class RgbTracker {
  #channels: RgbChannels;

  static toCss(channels: RgbChannels) {
    const joined = channels.filter((value) => value !== undefined).join();
    return `rgb(${joined})`;
  }

  constructor(config = DEFAULT_CHANNELS) {
    this.#channels = config;
  }

  get rgb() {
    return this.#channels;
  }

  get rgbCss() {
    return RgbTracker.toCss(this.#channels);
  }

  #channelThreshold(channelValue = 0, progress = 0) {
    const result = Math.abs((channelValue * progress) / 100);
    return assertNumber(result) ? Math.round(result) : 0;
  }

  #channelWithSign(channelValue = 0, channelDiff = 0) {
    return channelDiff <= 0 ? channelValue : -channelValue;
  }

  #calcDiff(start: RgbChannels, end: RgbChannels): RgbChannels {
    return [start[0] - end[0], start[1] - end[1], start[2] - end[2]];
  }

  #calcThreshold(difference: RgbChannels, progress = 0): RgbChannels {
    return [
      this.#channelThreshold(difference[0], progress),
      this.#channelThreshold(difference[1], progress),
      this.#channelThreshold(difference[2], progress),
    ];
  }

  #normalize(threshold: RgbChannels, difference: RgbChannels): RgbChannels {
    return [
      this.#channelWithSign(threshold[0], difference[0]),
      this.#channelWithSign(threshold[1], difference[1]),
      this.#channelWithSign(threshold[2], difference[2]),
    ];
  }

  update(start: RgbChannels, end: RgbChannels, progress = 0) {
    const difference = this.#calcDiff(start, end);
    const threshold = this.#calcThreshold(difference, progress);
    const adjustedEnd = this.#normalize(threshold, difference);

    this.#channels = [
      clamp(MIN_RGB, start[0] + adjustedEnd[0], MAX_RGB),
      clamp(MIN_RGB, start[1] + adjustedEnd[1], MAX_RGB),
      clamp(MIN_RGB, start[2] + adjustedEnd[2], MAX_RGB),
      // TODO: Eventually support `alpha` channel.
      clamp(MIN_ALPHA, 1, MAX_ALPHA),
    ];

    return this;
  }
}
