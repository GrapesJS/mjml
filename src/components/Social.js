// Specs: https://mjml.io/documentation/#mjml-social
import { isComponentType } from './index.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-social';

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: 'Social',
        draggable: '[data-gjs-type=mj-column], [data-gjs-type=mj-hero]',
        droppable: '[data-gjs-type=mj-social-element]',
        stylable: [
          'icon-size', 'text-decoration', 'align', 'font-family', 'font-size', 'line-height',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'container-background-color',
          'color',
        ],
        'style-default': {
          'align': 'center',
          'icon-size': '20px',
          'font-size': '13px',
          'line-height': '22px',
        },
        traits: [
          {
            type: 'select',
            label: 'Mode',
            name: 'mode',
            options: [
              { value: 'horizontal', name: 'Horizontal' },
              { value: 'vertical', name: 'Vertical' },
            ]
          }
        ],
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body><mj-column>`,
          end: `</mj-column></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl) {
        return sandboxEl.querySelector('tr').innerHTML;
      },

      getChildrenSelector() {
        return 'td';
      },

      rerender() {
        coreMjmlView.rerender.call(this);
        this.model.components().models.forEach((item) => {
          if (item.attributes.type != "mj-social-element") {
            return;
          }
          item.view.rerender();
        });
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', this.render);
      },
    }
  });
};
