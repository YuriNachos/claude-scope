/**
 * Unit tests for color utilities
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import {
  reset,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bold,
  dim,
  italic,
  underline,
  contextColors,
  colorize
} from '#/utils/colors.js';

describe('color utilities', () => {
  describe('reset', () => {
    it('should return ANSI reset code', () => {
      expect(reset).to.equal('\x1b[0m');
    });

    it('should be a non-empty string', () => {
      expect(reset).to.be.a('string').that.is.not.empty;
    });
  });

  describe('foreground colors', () => {
    it('should return ANSI code for red', () => {
      expect(red).to.equal('\x1b[31m');
    });

    it('should return ANSI code for green', () => {
      expect(green).to.equal('\x1b[32m');
    });

    it('should return ANSI code for yellow', () => {
      expect(yellow).to.equal('\x1b[33m');
    });

    it('should return ANSI code for blue', () => {
      expect(blue).to.equal('\x1b[34m');
    });

    it('should return ANSI code for magenta', () => {
      expect(magenta).to.equal('\x1b[35m');
    });

    it('should return ANSI code for cyan', () => {
      expect(cyan).to.equal('\x1b[36m');
    });

    it('should return ANSI code for white', () => {
      expect(white).to.equal('\x1b[37m');
    });

    it('should return ANSI code for gray', () => {
      expect(gray).to.equal('\x1b[90m');
    });

    it('should all be different codes', () => {
      const codes = [red, green, yellow, blue, magenta, cyan, white, gray];
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).to.equal(codes.length);
    });
  });

  describe('background colors', () => {
    it('should return ANSI code for bgRed', () => {
      expect(bgRed).to.equal('\x1b[41m');
    });

    it('should return ANSI code for bgGreen', () => {
      expect(bgGreen).to.equal('\x1b[42m');
    });

    it('should return ANSI code for bgYellow', () => {
      expect(bgYellow).to.equal('\x1b[43m');
    });

    it('should return ANSI code for bgBlue', () => {
      expect(bgBlue).to.equal('\x1b[44m');
    });

    it('should all be different codes', () => {
      const codes = [bgRed, bgGreen, bgYellow, bgBlue];
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).to.equal(codes.length);
    });

    it('should differ from foreground colors', () => {
      expect(bgRed).to.not.equal(red);
      expect(bgGreen).to.not.equal(green);
      expect(bgYellow).to.not.equal(yellow);
      expect(bgBlue).to.not.equal(blue);
    });
  });

  describe('text styles', () => {
    it('should return ANSI code for bold', () => {
      expect(bold).to.equal('\x1b[1m');
    });

    it('should return ANSI code for dim', () => {
      expect(dim).to.equal('\x1b[2m');
    });

    it('should return ANSI code for italic', () => {
      expect(italic).to.equal('\x1b[3m');
    });

    it('should return ANSI code for underline', () => {
      expect(underline).to.equal('\x1b[4m');
    });

    it('should all be different codes', () => {
      const codes = [bold, dim, italic, underline];
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).to.equal(codes.length);
    });
  });

  describe('color wrapping', () => {
    it('should wrap text with color and reset', () => {
      const text = 'Hello World';
      const colored = `${red}${text}${reset}`;
      expect(colored).to.equal('\x1b[31mHello World\x1b[0m');
    });

    it('should handle empty string', () => {
      const text = '';
      const colored = `${green}${text}${reset}`;
      expect(colored).to.equal('\x1b[32m\x1b[0m');
    });

    it('should handle special characters', () => {
      const text = 'Hello\nWorld\t!';
      const colored = `${blue}${text}${reset}`;
      expect(colored).to.equal('\x1b[34mHello\nWorld\t!\x1b[0m');
    });

    it('should handle unicode characters', () => {
      const text = 'Hello 世界';
      const colored = `${yellow}${text}${reset}`;
      expect(colored).to.equal('\x1b[33mHello 世界\x1b[0m');
    });

    it('should handle emoji', () => {
      const text = 'Hello ✨';
      const colored = `${magenta}${text}${reset}`;
      expect(colored).to.equal('\x1b[35mHello ✨\x1b[0m');
    });
  });

  describe('combined styles', () => {
    it('should combine multiple styles', () => {
      const text = 'Important';
      const styled = `${bold}${red}${text}${reset}`;
      expect(styled).to.equal('\x1b[1m\x1b[31mImportant\x1b[0m');
    });

    it('should combine background and foreground', () => {
      const text = 'Highlight';
      const styled = `${bgYellow}${blue}${text}${reset}`;
      expect(styled).to.equal('\x1b[43m\x1b[34mHighlight\x1b[0m');
    });

    it('should combine background, foreground, and style', () => {
      const text = 'Alert';
      const styled = `${bold}${bgRed}${white}${text}${reset}`;
      expect(styled).to.equal('\x1b[1m\x1b[41m\x1b[37mAlert\x1b[0m');
    });
  });

  describe('ANSI code format', () => {
    it('should use valid ANSI escape sequence format', () => {
      const ansiPattern = /^\x1b\[\d+m$/;
      expect(red).to.match(ansiPattern);
      expect(green).to.match(ansiPattern);
      expect(blue).to.match(ansiPattern);
      expect(bold).to.match(ansiPattern);
      expect(bgRed).to.match(ansiPattern);
    });

    it('should have consistent ESC prefix', () => {
      const allCodes = [
        red, green, yellow, blue, magenta, cyan, white, gray,
        bgRed, bgGreen, bgYellow, bgBlue,
        bold, dim, italic, underline, reset
      ];

      allCodes.forEach(code => {
        expect(code.startsWith('\x1b[')).to.be.true;
        expect(code.endsWith('m')).to.be.true;
      });
    });
  });

  describe('context colors', () => {
    it('should provide low usage color (green)', () => {
      expect(contextColors.low).to.equal(green);
    });

    it('should provide medium usage color (yellow)', () => {
      expect(contextColors.medium).to.equal(yellow);
    });

    it('should provide high usage color (red)', () => {
      expect(contextColors.high).to.equal(red);
    });

    it('should have all three colors different', () => {
      expect(contextColors.low).to.not.equal(contextColors.medium);
      expect(contextColors.medium).to.not.equal(contextColors.high);
      expect(contextColors.low).to.not.equal(contextColors.high);
    });
  });

  describe('colorize function', () => {
    it('should wrap text with color and reset', () => {
      const result = colorize('Hello', red);
      expect(result).to.equal('\x1b[31mHello\x1b[0m');
    });

    it('should handle empty string', () => {
      const result = colorize('', green);
      expect(result).to.equal('\x1b[32m\x1b[0m');
    });

    it('should handle special characters', () => {
      const result = colorize('Hello\nWorld', blue);
      expect(result).to.equal('\x1b[34mHello\nWorld\x1b[0m');
    });

    it('should handle unicode', () => {
      const result = colorize('Привет', yellow);
      expect(result).to.equal('\x1b[33mПривет\x1b[0m');
    });

    it('should handle emoji', () => {
      const result = colorize('✨', magenta);
      expect(result).to.equal('\x1b[35m✨\x1b[0m');
    });

    it('should work with context colors', () => {
      const result = colorize('Low', contextColors.low);
      expect(result).to.equal('\x1b[32mLow\x1b[0m');
    });
  });
});
