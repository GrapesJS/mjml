// Specs: https://documentation.mjml.io/#mj-head
import { isComponentType, componentsToQuery } from './utils.js';

export const type = 'mj-head';

export default (editor, { dc }) => {
  dc.addType(type, {
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
