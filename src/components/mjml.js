// Specs: https://documentation.mjml.io/#mjml
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
        stylable: false,
        traits: [
          {
            name: 'owa',
            placeholder: 'eg. desktop',
          },
          {
            name: 'lang',
            placeholder: 'eg. en',
          },
          {
            name: 'dir',
            placeholder: 'eg. rtl',
          },
        ],
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
