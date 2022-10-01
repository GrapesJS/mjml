// Specs: https://documentation.mjml.io/#mj-column
import type grapesjs from 'grapesjs';
import { componentsToQuery, getName, isComponentType, mjmlConvert } from './utils';
import { type as typeSection } from './Section';

export const type = 'mj-column';

export default (editor: grapesjs.Editor, { opt, coreMjmlModel, coreMjmlView, sandboxEl }: any) => {
  const clmPadd = opt.columnsPadding;

  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'column'),
        draggable: componentsToQuery(typeSection),
        stylable: [
          'background-color', 'vertical-align', 'width',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color',
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
        style: clmPadd ? `padding: ${clmPadd};` : '',
      },

      getTemplateFromMjml() {
        const mjmlTmpl = this.getMjmlTemplate();
        const innerMjml = this.getInnerMjmlTemplate();
        const htmlOutput = mjmlConvert(`${mjmlTmpl.start}
          ${innerMjml.start}${innerMjml.end}${mjmlTmpl.end}`, opt.fonts);
        const html = htmlOutput.html;

        // I need styles for responsive columns
        const styles: string[] = [];
        sandboxEl.innerHTML = html;
        const styleArr: HTMLStyleElement[] = Array.from(sandboxEl.querySelectorAll('style'));
        styleArr.forEach((item) => {
          styles.push(item.innerHTML);
        });


        const content = html.replace(/<body(.*)>/, '<body>');
        const start = content.indexOf('<body>') + 6;
        const end = content.indexOf('</body>');
        sandboxEl.innerHTML = content.substring(start, end).trim();
        const componentEl = this.getTemplateFromEl(sandboxEl);

        // Copy all rendered attributes (TODO need for all)
        const attributes: Record<string, any> = {};
        const elAttrs = componentEl.attributes;

        for (let elAttr, i = 0, len = elAttrs.length; i < len; i++) {
          elAttr = elAttrs[i];
          attributes[elAttr.name] = elAttr.value;
        }

        return {
          attributes,
          content: componentEl.innerHTML,
          style: styles.join(' ')
        };
      },

      render() {
        this.renderAttributes();
        const mjmlResult = this.getTemplateFromMjml();
        this.el.innerHTML = mjmlResult.content;
        this.$el.attr(mjmlResult.attributes);
        editor.addComponents(`<style>${mjmlResult.style}</style>`);
        this.getChildrenContainer().innerHTML = this.model.get('content');
        this.renderChildren();
        this.renderStyle();

        // In case mjmlResult.attributes removes necessary stuff
        this.updateStatus();

        return this;
      },

      renderStyle() {
        const model_style = this.model.get('style') || {};
        const style = Object.keys(this.model.get('style')).map(attr=>`${attr}:${model_style[attr]};`);
        this.el.setAttribute('style', `${this.attributes.style} ${style.join(' ')} ${this.el.getAttribute('style')}`);
        this.checkVisibility();
      },

      getMjmlTemplate() {
        // Need it for responsive columns
        let cols = this.model.collection.length - 1;
        cols = cols ? cols : 0;
        let addColmn = Array(cols).fill('<mj-column></mj-column>').join('');

        return {
          start: `<mjml><mj-body><mj-section>`,
          end: `${addColmn}</mj-section></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl: any) {
        return sandboxEl.firstChild.querySelector('div > table > tbody > tr > td > div');
      },

      getChildrenSelector() {
        return 'table';
      },
    },
  });
};
