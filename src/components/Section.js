// Specs: https://mjml.io/documentation/#mjml-section
import { isComponentType } from './utils.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-section';

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: editor.I18n.t('grapesjs-mjml.components.names.section'),
        draggable: '[data-gjs-type=mj-body], [data-gjs-type=mj-wrapper]',
        droppable: '[data-gjs-type=mj-column]',
        'style-default': {
          'padding-left': '0px',
          'padding-right': '0px',
          'padding-top': '10px',
          'padding-bottom': '10px',
          'text-align': 'center',
        },
        stylable: [
          'text-align',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'background-color', 'background-url', 'background-repeat', 'background-size',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color'
        ],
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: {
        style: 'pointer-events: all;',
        'data-type': 'mj-section',
      },

      getMjmlTemplate() {
        let parentView = this.model.parent().view;
        let parentTag = this.model.parent().attributes.tagName;
        if (parentView.getInnerMjmlTemplate && parentTag === 'mj-body') {
          let mjmlBody = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml><mj-body>${mjmlBody.start}`,
            end: `${mjmlBody.end}</mj-body></mjml>`,
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
