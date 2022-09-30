// Specs: https://documentation.mjml.io/#mj-section
import type grapesjs from 'grapesjs';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeBody } from './Body';
import { type as typeWrapper } from './Wrapper';
import { type as typeColumn } from './Column';
import { type as typeGroup } from './Group';

export const type = 'mj-section';

export default (editor: grapesjs.Editor, { coreMjmlModel, coreMjmlView }: any) => {
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
          'padding-top': '10px',
          'padding-bottom': '10px',
          'text-align': 'center',
        },
        stylable: [
          'text-align',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'background-color', 'background-url', 'background-repeat', 'background-size',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color'
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
        return 'table > tbody > tr > td';
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', this.render);
      },
    },
  });
};
