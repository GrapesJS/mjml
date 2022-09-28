// Specs https://documentation.mjml.io/#mj-body
import { isComponentType, componentsToQuery, getName } from './utils.js';

export const type = 'mj-body';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  dc.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'body'),
        droppable: componentsToQuery(['mj-section', 'mj-wrapper', 'mj-hero', 'mj-raw']),
        draggable: false,
        copyable: false,
        removable: false,
        'style-default': { 'width': '600px' },
        stylable: [
          // Currently the UX sucks too much with the heavy rendering approach
          'width',
          'background-color'
        ],
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
        // this.model.components().models.forEach((item) => {
        //   if (item.attributes.type != "mj-section" && item.attributes.type != "mj-raw") {
        //     return;
        //   }
        //   item.view.rerender();
        // });
      },
    },
  });

};
