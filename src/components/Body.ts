// Specs https://documentation.mjml.io/#mj-body
import type grapesjs from 'grapesjs';
import { isComponentType, componentsToQuery, getName } from './utils.js';

export const type = 'mj-body';

export default (editor: grapesjs.Editor, { coreMjmlModel, coreMjmlView }: any) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'body'),
        droppable: componentsToQuery(['mj-section', 'mj-wrapper', 'mj-hero', 'mj-raw']),
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
          end: `${orig.end}`,
        };
      },

      renderStyle() {
        this.el.setAttribute('style', `${this.el.getAttribute('style') + this.attributes.style}`);
      },

      rerender() {
        coreMjmlView.rerender.call(this);
        this.model.components().models.forEach((item: any) => {
          if (item.attributes.type != "mj-section" && item.attributes.type != "mj-raw") {
            return;
          }
          item.view.rerender();
        });
      },
    },
  });

};
