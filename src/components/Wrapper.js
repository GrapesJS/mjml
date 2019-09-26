// Specs: https://mjml.io/documentation/#mjml-section
import { isComponentType } from './index.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-wrapper';

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: 'Wrapper',
        draggable: '[data-gjs-type=mj-body]',
        droppable: '[data-gjs-type=mj-section]',
        'style-default': {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'vertical-align': 'top',
          'text-align': 'center',
        },
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: {
        style: 'pointer-events: all;padding: 10px 0;',
        'data-type': 'mj-wrapper',
      },

      getMjmlTemplate() {
        let parentView = this.model.parent().view;
        if (parentView.getInnerMjmlTemplate) {
          let mjmlBody = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml>${mjmlBody.start}`,
            end: `${mjmlBody.end}</mjml>`,
          };
        } else {
          return {
            start: `<mjml><mj-body>`,
            end: `</mj-body></mjml>`,
          };
        }
      },

      getChildrenSelector() {
        return 'table > tbody > tr > td';
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', this.render);
      },
    },
  });
};
