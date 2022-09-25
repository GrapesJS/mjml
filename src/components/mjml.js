// Specs: https://mjml.io/documentation/#mjml
import { isComponentType } from './utils.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mjml';

  dc.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        droppable: '[data-gjs-type=mj-head], [data-gjs-type=mj-body]',
        draggable: false,
      },
    },
    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: { style: 'min-height: 100vh' },
      getTemplateFromMjml() {
        return '';
      }
    },
  });

};
