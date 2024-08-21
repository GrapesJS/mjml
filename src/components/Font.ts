// Specs: https://documentation.mjml.io/#mj-font
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, isComponentType, mjmlConvert } from './utils';
import { type as typeHead } from './Head';

export const type = 'mj-font';

export default (editor: Editor, { opt, coreMjmlModel, coreMjmlView, sandboxEl }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        draggable: componentsToQuery(typeHead),
        void: false,
      },
    },
    view: {
      ...coreMjmlView,
      tagName: 'style',

      getMjmlTemplate() {
        const name = this.model.get('attributes')?.name;
        /*
         * mjml will omit `<mj-font> definitions which are not actually used.
         * Therefore we need to have an mj-text that uses our font
         */
        return {
          start: `<mjml><mj-head>`,
          end: `</mj-head><mj-body><mj-text font-family="${name}"></mj-text></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl: any) {
        return sandboxEl.querySelectorAll('style')[1].innerHTML;
      },

      renderStyle() {},

      renderChildren() {},

      getTemplateFromMjml() {
        const mjmlTmpl = this.getMjmlTemplate();
        const innerMjml = this.getInnerMjmlTemplate();
        const htmlOutput = mjmlConvert(
          opt.mjmlParser,
          `${mjmlTmpl.start}
          ${innerMjml.start}${innerMjml.end}${mjmlTmpl.end}`,
          opt.fonts,
        );
        let html = htmlOutput.html;
        const start = html.indexOf('<head>') + 6;
        const end = html.indexOf('</head>');
        html = html.substring(start, end).trim();
        sandboxEl.innerHTML = html;
        return this.getTemplateFromEl(sandboxEl);
      },
    },
  });
};
