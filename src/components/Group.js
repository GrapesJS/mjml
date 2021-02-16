// Specs: https://mjml.io/documentation/#mjml-group
import { isComponentType } from './utils.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-group';

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: editor.I18n.t('grapesjs-mjml.components.names.group'),
        draggable: '[data-gjs-type=mj-section]',
        droppable: '[data-gjs-type=mj-column]',
        stylable: [
          'width', 'vertical-align', 'background-color', 'direction',
        ],
        'style-default': {
          'vertical-align': 'top'
        }
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

      getChildrenSelector() {
        return 'div';
      },
    }
  });
};
