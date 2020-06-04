// Specs: https://mjml.io/documentation/#mjml
import { isComponentType } from './utils.js';

export default (editor, { dc }) => {
  const type = 'mjml';

  dc.addType(type, {
    isComponent: isComponentType(type),
    model: {
      defaults: {
        droppable: '[data-gjs-type=mj-head], [data-gjs-type=mj-body]',
        draggable: false,
      },
    }
  });

};
