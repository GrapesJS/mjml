// Specs https://mjml.io/documentation/#mj-body
import { isComponentType } from './utils.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-body';
  const droppable = [
    'mj-section', 'mj-wrapper', 'mj-hero', 'mj-raw',
  ].map(tag => `[data-gjs-type=${tag}]`).join(', ');

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: editor.I18n.t('grapesjs-mjml.components.names.body'),
        droppable,
        draggable: false,
        copyable: false,
        removable: false,
        'style-default': { width: '600px' },
        stylable: [
          // Currently the UX sucks too much with the heavy rendering approach
          'width',
          'background-color'
        ],
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: {
        style: 'width: 100%; min-height: 100%',
        'data-type': 'mj-body',
      },

      getChildrenSelector() {
        return 'div';
      },

      getInnerMjmlTemplate() {
        let orig = coreMjmlView.getInnerMjmlTemplate.call(this);
        return {
          start: `${orig.start}<mj-section></mj-section>`,
          end: `${orig.end}`,
        };
      },

      renderStyle() {
        this.el.setAttribute('style', `${this.el.getAttribute('style') + this.attributes.style}`);
      },

      renderContent() {
        this.getChildrenContainer().innerHTML = this.model.get('content');
      },

      rerender() {
        coreMjmlView.rerender.call(this);
        this.model.components().models.forEach((item) => {
          if (item.attributes.type != "mj-section" && item.attributes.type != "mj-raw") {
            return;
          }
          item.view.rerender();
        });
      },
    },
  });

};
