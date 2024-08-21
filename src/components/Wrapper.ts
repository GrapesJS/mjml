// Specs: https://documentation.mjml.io/#mjml-wrapper
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeBody } from './Body';
import { type as typeSection } from './Section';

export const type = 'mj-wrapper';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'wrapper'),
        draggable: componentsToQuery(typeBody),
        droppable: componentsToQuery(typeSection),
        traits:[
          'id',
          'title',
          {
            type: 'checkbox',
            label: 'Full width',
            name: 'full-width',
            valueTrue: 'full-width',
            valueFalse: '',
         }
        ],
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
        if(this.model.getAttributes()['full-width']){
          return 'table > tbody > tr > td > div table > tbody > tr > td';
        }else
          return 'table > tbody > tr > td';
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', () => {
          this.getChildrenContainer().innerHTML = this.model.get('content')!;
          this.renderChildren();
        });
      },
    }
  });
};
