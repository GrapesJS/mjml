// Specs: https://documentation.mjml.io/#mjml-wrapper
import type grapesjs from 'grapesjs';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeBody } from './Body';
import { type as typeSection } from './Section';

export const type = 'mj-wrapper';

export default (editor: grapesjs.Editor, { coreMjmlModel, coreMjmlView }: any) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'wrapper'),
        draggable: componentsToQuery(typeBody),
        droppable: componentsToQuery(typeSection),
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body>`,
          end: `</mj-body></mjml>`,
        };
      },

      getChildrenSelector() {
        return 'table tr td';
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', () => {
          this.getChildrenContainer().innerHTML = this.model.get('content');
          this.renderChildren();
        });
      },
    }
  });
};
