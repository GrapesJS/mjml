// Specs: https://mjml.io/documentation/#mj-head
import { isComponentType } from './utils.js';

export default (editor, { dc }) => {
  const type = 'mj-head';
  const droppable = [
    'mj-preview',
    'mj-attributes',
    'mj-style',
    'mj-font',
    'mj-title',
  ].map(tag => `[data-gjs-type=${tag}]`).join(', ');

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      defaults: {
        droppable,
        draggable: false,
      },
    },
  });

};
