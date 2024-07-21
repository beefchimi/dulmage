type SectionLink = [label: string, url?: string];

export type RgbChannels = [
  red: number,
  green: number,
  blue: number,
  alpha?: number,
];

export interface EmailParts {
  local: string;
  domain: string;
  suffix: string;
}

export interface SectionEntry {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  channels: RgbChannels;
}

export interface ProjectEntry extends SectionEntry {
  logo: string;
  url?: string;
  attribution?: string;
  client?: SectionLink;
  agency?: SectionLink;
  contributor?: SectionLink;
  inhouse?: SectionLink;
  personal?: SectionLink;
  inactive?: boolean;
}
