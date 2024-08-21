// Specs: https://documentation.mjml.io/#mj-section
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeBody } from './Body';
import { type as typeWrapper } from './Wrapper';
import { type as typeColumn } from './Column';
import { type as typeGroup } from './Group';

export const type = 'mj-section';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'section'),
        draggable: componentsToQuery([typeBody, typeWrapper]),
        droppable: componentsToQuery([typeColumn, typeGroup]),
        'style-default': {
          'padding-left': '0px',
          'padding-right': '0px',
          'padding-top': '20px',
          'padding-bottom': '20px',
          'text-align': 'center',
        },
        stylable: [
          'text-align',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'background-color', 'background-url', 'background-repeat', 'background-size',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color'
        ],
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
        style: 'pointer-events: all;',
      },

      getMjmlTemplate() {
        const parent = this.model.parent();
        const parentView = parent?.view;
        const parentTag = parent?.attributes.tagName;
        // @ts-ignore
        const getInnerMjmlTemplate = parentView?.getInnerMjmlTemplate;

        if (getInnerMjmlTemplate && parentTag === typeBody) {
          let mjmlBody = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml><mj-body>${mjmlBody.start}`,
            end: `${mjmlBody.end}</mj-body></mjml>`,
          };
        } else {
          return {
            start: `<mjml><mj-body>`,
            end: `</mj-body></mjml>`,
          };
        }
      },

      getChildrenSelector() {
        if(this.model.getAttributes()['full-width']){
          return 'table > tbody > tr > td > div table > tbody > tr > td';
        }
        else
          return 'table > tbody > tr > td';
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', this.render);
      },
    },
  });
};
