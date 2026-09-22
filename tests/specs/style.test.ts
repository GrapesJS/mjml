import { Editor } from 'grapesjs';
import { RequiredPluginOptions } from '../../src';
import setupStyleManager from '../../src/style';

interface PropertyDefinition {
  property: string;
  properties: PropertyDefinition[];
}

interface SectorDefinition {
  name: string;
  properties: PropertyDefinition[];
}

describe('Style Manager', () => {
  test('defines border radius corners in CSS shorthand order', () => {
    const add = jest.fn();
    const editor = {
      onReady: (callback: () => void) => callback(),
      StyleManager: {
        getSectors: () => ({ reset: jest.fn(), add }),
      },
    } as unknown as Editor;

    setupStyleManager(editor, { resetStyleManager: true } as RequiredPluginOptions);

    const sectors = add.mock.calls[0][0] as SectorDefinition[];
    const decorations = sectors.find((sector) => sector.name === 'Decorations');
    const borderRadius = decorations?.properties.find((property) => property.property === 'border-radius');
    const corners = borderRadius?.properties.map((property) => property.property);

    expect(corners).toEqual([
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
    ]);
  });
});
