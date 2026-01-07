import type { ITheme } from './types.js';
import { gray } from '../utils/colors.js';

export const DEFAULT_THEME: ITheme = {
  context: {
    low: gray,
    medium: gray,
    high: gray,
  },
  lines: {
    added: gray,
    removed: gray,
  },
};
