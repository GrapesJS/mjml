// Specs: https://mjml.io/documentation/#mjml-wrapper
import { isComponentType } from './utils';

export const type = 'mj-wrapper';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: editor.I18n.t('grapesjs-mjml.components.names.wrapper'),
        draggable: '[data-gjs-type=mj-body]',
        droppable: '[data-gjs-type=mj-section]',
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
        return 'table tr td';
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', function() {
          this.getChildrenContainer().innerHTML = this.model.get('content');
          this.renderChildren();
        });
      },
    }
  });
};
