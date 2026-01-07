import { describe, it } from 'node:test';
import { expect } from 'chai';
import type { IContextColors, ILinesColors, ITheme } from '../../../../src/ui/theme/types.js';

describe('IContextColors', () => {
  it('should accept valid color configuration', () => {
    const colors: IContextColors = {
      low: '\x1b[32m',
      medium: '\x1b[33m',
      high: '\x1b[31m'
    };
    expect(colors.low).to.be.a('string');
    expect(colors.medium).to.be.a('string');
    expect(colors.high).to.be.a('string');
  });

  it('should accept gray colors for all states', () => {
    const colors: IContextColors = {
      low: '\x1b[90m',
      medium: '\x1b[90m',
      high: '\x1b[90m'
    };
    expect(colors.low).to.equal('\x1b[90m');
    expect(colors.medium).to.equal('\x1b[90m');
    expect(colors.high).to.equal('\x1b[90m');
  });
});

describe('ILinesColors', () => {
  it('should accept valid color configuration', () => {
    const colors: ILinesColors = {
      added: '\x1b[32m',
      removed: '\x1b[31m'
    };
    expect(colors.added).to.be.a('string');
    expect(colors.removed).to.be.a('string');
  });

  it('should accept gray colors for added/removed', () => {
    const colors: ILinesColors = {
      added: '\x1b[90m',
      removed: '\x1b[90m'
    };
    expect(colors.added).to.equal('\x1b[90m');
    expect(colors.removed).to.equal('\x1b[90m');
  });
});

describe('ITheme', () => {
  it('should accept theme with context colors', () => {
    const theme: ITheme = {
      context: {
        low: '\x1b[90m',
        medium: '\x1b[90m',
        high: '\x1b[90m'
      }
    };
    expect(theme.context).to.exist;
    expect(theme.context?.low).to.equal('\x1b[90m');
  });

  it('should accept theme with lines colors', () => {
    const theme: ITheme = {
      lines: {
        added: '\x1b[90m',
        removed: '\x1b[90m'
      }
    };
    expect(theme.lines).to.exist;
    expect(theme.lines?.added).to.equal('\x1b[90m');
  });

  it('should accept empty theme', () => {
    const theme: ITheme = {};
    expect(theme).to.be.empty;
  });
});
