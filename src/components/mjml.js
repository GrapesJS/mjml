// Specs: https://documentation.mjml.io/#mjml
import { isComponentType, componentsToQuery } from './utils.js';
import { type as typeHead } from './Head';
import { type as typeBody } from './Body';

export const type = 'mjml';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  dc.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        droppable: componentsToQuery([typeHead, typeBody]),
        draggable: false,
        stylable: false,
        copyable: false,
        removable: false,
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
