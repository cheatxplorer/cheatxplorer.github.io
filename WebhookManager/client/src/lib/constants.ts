import { ButtonStyleMapping } from "@/types/discord";

export const DEFAULT_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";

export const DEFAULT_USERNAME = "WebhookTool.py";

export const MAX_EMBEDS = 10;

export const MAX_FIELDS = 25;

export const MAX_BUTTONS = 5;

export const MAX_ACTION_ROWS = 5;

export const CHARACTER_LIMITS = {
  CONTENT: 2000,
  EMBED_TITLE: 256,
  EMBED_DESCRIPTION: 4096,
  EMBED_FIELD_NAME: 256,
  EMBED_FIELD_VALUE: 1024,
  EMBED_FOOTER: 2048,
  EMBED_AUTHOR_NAME: 256,
  WEBHOOK_NAME: 80,
  BUTTON_LABEL: 80,
};

export const BUTTON_STYLES: ButtonStyleMapping = {
  primary: 1,
  secondary: 2,
  success: 3,
  danger: 4,
  link: 5,
};

export const BUTTON_STYLE_COLORS = {
  primary: 'bg-[#5865F2] hover:bg-[#4752c4]',
  secondary: 'bg-[#4f545c] hover:bg-[#686d73]',
  success: 'bg-[#57F287] hover:bg-[#45c46c] text-black',
  danger: 'bg-[#ED4245] hover:bg-[#c53337]',
  link: 'bg-[#2f3136] hover:bg-[#42464D]',
};

export const EMBED_COLORS = [
  { label: 'Default Blue', value: '#58b9ff' },
  { label: 'Discord Blurple', value: '#5865F2' },
  { label: 'Green', value: '#57F287' },
  { label: 'Yellow', value: '#FEE75C' },
  { label: 'Red', value: '#ED4245' },
  { label: 'Pink', value: '#EB459E' },
  { label: 'Purple', value: '#9B59B6' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Black', value: '#000000' },
];

export const hexToRgb = (hex: string): number => {
  hex = hex.replace('#', '');
  return parseInt(hex, 16);
};

export const rgbToHex = (number: number): string => {
  return `#${number.toString(16).padStart(6, '0')}`;
};
