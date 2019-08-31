// Specs: https://mjml.io/documentation/#mj-style
import { isComponentType } from './index.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-style';
  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        draggable: '[data-gjs-type=mj-head]',
      },
    },
    view: {
      ...coreMjmlView,
      tagName: "style",

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-head>`,
          end: `</mj-head></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl) {
        return sandboxEl.querySelector('style').innerHTML;
      },
    }
  });

};
