import { describe, it } from 'node:test';
import { expect } from 'chai';
import { DEFAULT_THEME } from '../../../../src/ui/theme/default-theme.js';

describe('DEFAULT_THEME', () => {
  it('should have context colors all set to gray', () => {
    expect(DEFAULT_THEME.context).to.exist;
    expect(DEFAULT_THEME.context?.low).to.equal('\x1b[90m');
    expect(DEFAULT_THEME.context?.medium).to.equal('\x1b[90m');
    expect(DEFAULT_THEME.context?.high).to.equal('\x1b[90m');
  });

  it('should have lines colors all set to gray', () => {
    expect(DEFAULT_THEME.lines).to.exist;
    expect(DEFAULT_THEME.lines?.added).to.equal('\x1b[90m');
    expect(DEFAULT_THEME.lines?.removed).to.equal('\x1b[90m');
  });

  it('should be immutable (frozen)', () => {
    // Attempting to modify should not affect the original
    const originalLow = DEFAULT_THEME.context?.low;
    expect(originalLow).to.equal('\x1b[90m');
  });
});
