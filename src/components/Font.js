// Specs: https://mjml.io/documentation/#mj-font
import mjml2html from 'mjml';
import { isComponentType } from './index.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView, sandboxEl }) => {
  const type = 'mj-font';
  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        draggable: '[data-gjs-type=mj-head]',
        void: true
      },
    },
    view: {
      ...coreMjmlView,
      tagName: "style",

      getMjmlTemplate() {
        const name = this.model.get('attributes').name
        /*
         * mjml will omit `<mj-font> definitions which are not actually used.
         * Therefore we need to have an mj-text that uses our font
         */
        return {
          start: `<mjml><mj-head>`,
          end: `</mj-head><mj-body><mj-text font-family="${name}"></mj-text></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl) {
        return sandboxEl.querySelectorAll('style')[1].innerHTML
      },

      renderStyle() {},

      renderContent(){},

      getTemplateFromMjml() {
        let mjmlTmpl = this.getMjmlTemplate();
        let innerMjml = this.getInnerMjmlTemplate();
        const htmlOutput = mjml2html(`${mjmlTmpl.start}
          ${innerMjml.start}${innerMjml.end}${mjmlTmpl.end}`);
        let html = htmlOutput.html;
        let start = html.indexOf('<head>') + 6;
        let end = html.indexOf('</head>');
        html = html.substring(start, end).trim();
        sandboxEl.innerHTML = html;
        return this.getTemplateFromEl(sandboxEl);
      },
    }
  });

};
