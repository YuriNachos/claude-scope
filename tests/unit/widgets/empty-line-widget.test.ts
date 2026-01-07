/**
 * Unit tests for EmptyLineWidget
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { EmptyLineWidget } from '../../../src/widgets/empty-line-widget.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';

describe('EmptyLineWidget', () => {
  it('should have correct id and metadata', () => {
    const widget = new EmptyLineWidget();
    expect(widget.id).to.equal('empty-line');
    expect(widget.metadata.name).to.equal('Empty Line');
    expect(widget.metadata.description).to.equal('Empty line separator');
    expect(widget.metadata.line).to.equal(3);
  });

  it('should render braille pattern blank as empty line', async () => {
    const widget = new EmptyLineWidget();
    await widget.update(createMockStdinData());
    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('\u2800'); // Braille Pattern Blank
  });

  it('should be enabled by default', async () => {
    const widget = new EmptyLineWidget();
    await widget.initialize({ config: {} });

    expect(widget.isEnabled()).to.be.true;
  });

  it('should respect enabled config', async () => {
    const widget = new EmptyLineWidget();
    await widget.initialize({ config: { enabled: false } });

    expect(widget.isEnabled()).to.be.false;
  });

  it('should return null when disabled', async () => {
    const widget = new EmptyLineWidget();
    await widget.initialize({ config: { enabled: false } });
    await widget.update(createMockStdinData());

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });
});
