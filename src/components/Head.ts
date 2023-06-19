// Specs: https://documentation.mjml.io/#mj-head
import type { Editor } from 'grapesjs';
import { isComponentType, componentsToQuery } from './utils';

export const type = 'mj-head';

export default (editor: Editor) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      defaults: {
        draggable: false,
        droppable: componentsToQuery([
          'mj-preview',
          'mj-attributes',
          'mj-style',
          'mj-font',
          'mj-title',
          'mj-raw'
        ]),
      },
    },
  });
};
