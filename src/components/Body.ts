// Specs: https://documentation.mjml.io/#mj-body
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { type as typeHero } from './Hero';
import { type as typeRaw } from './Raw';
import { type as typeSection } from './Section';
import { type as typeWrapper } from './Wrapper';
import { componentsToQuery, getName, isComponentType } from './utils';

export const type = 'mj-body';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'body'),
        droppable: componentsToQuery([typeSection, typeWrapper, typeHero, typeRaw]),
        draggable: false,
        copyable: false,
        removable: false,
        highlightable: false,
        'style-default': { 'width': '600px' },
        stylable: [ 'width', 'background-color' ],
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: {
        style: 'width: 100%; min-height: 100vh',
      },

      getChildrenSelector() {
        return 'div';
      },

      getInnerMjmlTemplate() {
        const orig = coreMjmlView.getInnerMjmlTemplate.call(this);
        return {
          start: `${orig.start}<mj-section></mj-section>`,
          end: orig.end,
        };
      },

      renderStyle() {
        this.getChildrenContainer().style.maxWidth = 'none';
        this.getChildrenContainer().style.width = '100%';
        this.el.setAttribute('style', `${this.el.getAttribute('style') + this.attributes.style}`);
      },

      rerender() {
        coreMjmlView.rerender.call(this);
        this.model.components().models.forEach((item: any) => {
          if ([typeSection, typeRaw].indexOf(item.attributes.type) < 0) {
            return;
          }
          item.view.rerender();
        });
      },
    },
  });

};
