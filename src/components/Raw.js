// Specs: https://mjml.io/documentation/#mjml-wrapper
import { isComponentType } from './utils.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-raw';

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: editor.I18n.t('grapesjs-mjml.components.names.raw'),
        draggable: '[data-gjs-type=mj-body], [data-gjs-type=mj-head]',
        stylable: false,
        'style-default': {},
        'style': {},
        'attributes': {}
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'section',
      attributes: {
        style: 'pointer-events: all;',
        'data-type': 'mj-raw',
      },

      getMjmlTemplate() {
        let parentView = this.model.parent().view;
        let parentTag = this.model.parent().attributes.tagName;

        if (parentView.getInnerMjmlTemplate && parentTag === 'mj-body') {
          let mjmlBody = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml>${mjmlBody.start}`,
            end: `${mjmlBody.end}</mjml>`,
          };
        } else if (parentView.getInnerMjmlTemplate && parentTag === 'mj-head') {
          let mjmlHead = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml>${mjmlHead.start}`,
            end: `${mjmlHead.end}</mjml>`,
          };
        } else {
          return {
            start: `<mjml><mj-body>`,
            end: `</mj-body></mjml>`,
          };
        }
      },

      getTemplateFromEl(sandboxEl) {
        return sandboxEl.innerHTML;
      },

      getChildrenSelector() {
        return '*';
      },


      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', this.render);
      },
    },
  });
};
