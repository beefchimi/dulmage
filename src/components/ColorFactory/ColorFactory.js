const DEFAULT_CHANNELS = {
  red: 0,
  green: 0,
  blue: 0,
};

export default class ColorFactory {
  constructor(channels = DEFAULT_CHANNELS) {
    // Not actually being used for anything at the moment
    this.channels = channels;
  }

  calculateColorDifference(start, end) {
    return {
      red: start.red - end.red,
      green: start.green - end.green,
      blue: start.blue - end.blue,
    };
  }

  calculateColorThreshold(difference, progress) {
    return {
      red: channelThreshold(difference.red, progress),
      green: channelThreshold(difference.green, progress),
      blue: channelThreshold(difference.blue, progress),
    };
  }

  adjustColorSigns(threshold, difference) {
    return {
      red: channelWithSign(threshold.red, difference.red),
      green: channelWithSign(threshold.green, difference.green),
      blue: channelWithSign(threshold.blue, difference.blue),
    };
  }

  calculateColorDifferential(start, end, progress = 0) {
    const difference = this.calculateColorDifference(start, end);
    const threshold = this.calculateColorThreshold(difference, progress);
    const adjustedEnd = this.adjustColorSigns(threshold, difference);

    const updatedChannels = {
      red: start.red + adjustedEnd.red,
      green: start.green + adjustedEnd.green,
      blue: start.blue + adjustedEnd.blue,
    };

    this.channels = {...updatedChannels};

    return updatedChannels;
  }
}

function channelThreshold(channelValue, progress) {
  return Math.abs((channelValue * progress) / 100);
}

function channelWithSign(channelValue, channelDifference) {
  return channelDifference <= 0 ? channelValue : -channelValue;
}
