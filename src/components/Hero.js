// Specs: https://mjml.io/documentation/#mjml-hero
import { isComponentType } from './index.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-hero';

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: 'Hero',
        draggable: '[data-gjs-type=mj-body]',
        droppable: '[data-gjs-type=mj-text], [data-gjs-type=mj-button], ' +
                   '[data-gjs-type=mj-image], [data-gjs-type=mj-divider], ' +
                   '[data-gjs-type=mj-navbar], [data-gjs-type=mj-social], ' +
                   '[data-gjs-type=mj-spacer]',
      },
      stylable: [
        'background-color', 'background-height', 'background-position', 'background-url',
        'background-width', 'css-class', 'height', 'mode', 'padding', 'padding-top',
        'padding-left', 'padding-right', 'padding-bottom', 'vertical-align', 'width'
      ],
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

      getChildrenSelector() {
        return 'table tr td';
      },

    }
  });
};
