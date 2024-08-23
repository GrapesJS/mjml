// Specs: https://documentation.mjml.io/#mj-column
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType, mjmlConvert } from './utils';
import { type as typeSection } from './Section';

export const type = 'mj-column';

export default (editor: Editor, { opt, coreMjmlModel, coreMjmlView, sandboxEl }: ComponentPluginOptions) => {
  const clmPadd = opt.columnsPadding;

  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'column'),
        draggable: componentsToQuery(typeSection),
        stylable: [
          'background-color',
          'vertical-align',
          'width',
          'border-radius',
          'border-top-left-radius',
          'border-top-right-radius',
          'border-bottom-left-radius',
          'border-bottom-right-radius',
          'border',
          'border-width',
          'border-style',
          'border-color',
          'padding',
          'padding-top',
          'padding-left',
          'padding-right',
          'padding-bottom',
        ],
        'style-default': {
          'vertical-align': 'top',
        },
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
        const htmlOutput = mjmlConvert(
          opt.mjmlParser,
          `${mjmlTmpl.start}
          ${innerMjml.start}${innerMjml.end}${mjmlTmpl.end}`,
          opt.fonts,
        );
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
          style: styles.join(' '),
        };
      },

      render() {
        this.renderAttributes();
        const mjmlResult = this.getTemplateFromMjml();
        this.el.innerHTML = mjmlResult.content;
        this.$el.attr(mjmlResult.attributes);
        editor.addComponents(`<style>${mjmlResult.style}</style>`);
        this.getChildrenContainer().innerHTML = this.model.get('content')!;
        this.renderChildren();
        this.renderStyle();

        // In case mjmlResult.attributes removes necessary stuff
        this.updateStatus();
        this.postRender();

        return this;
      },

      renderStyle() {
        const { model, attributes, el } = this;
        const modelStyle = model.get('style') || {};
        const stylable = model.get('stylable') as string[];
        const styles = Object.keys(modelStyle)
          .filter((prop) => stylable.indexOf(prop) > -1)
          .map((prop) => `${prop}:${modelStyle[prop]};`);
        const styleResult = `${attributes.style} ${styles.join(' ')} ${el.getAttribute('style')}`;
        el.setAttribute('style', styleResult);
        // #290 Fix double borders
        el.firstElementChild?.setAttribute('style', '');
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
