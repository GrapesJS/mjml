// Specs: https://documentation.mjml.io/#mj-group
import type grapesjs from 'grapesjs';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeSection } from './Section';
import { type as typeColumn } from './Column';

export const type = 'mj-group';

export default (editor: grapesjs.Editor, { coreMjmlModel, coreMjmlView }: any) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'group'),
        draggable: componentsToQuery(typeSection),
        droppable: componentsToQuery(typeColumn),
        stylable: [
          'width', 'vertical-align', 'background-color', 'direction',
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
        style: 'display: table; width: 100%',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body>`,
          end: `</mj-body></mjml>`,
        };
      },

      getChildrenSelector() {
        return 'div';
      },
    }
  });
};
