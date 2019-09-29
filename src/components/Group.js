// Specs: https://mjml.io/documentation/#mjml-group
import { isComponentType } from './index.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-group';

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: 'Group',
        draggable: '[data-gjs-type=mj-section]',
        droppable: '[data-gjs-type=mj-column]',
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body>`,
          end: `</mj-body></mjml>`,
        };
      },
    }
  });
};
