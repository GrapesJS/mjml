// Specs: https://documentation.mjml.io/#mj-raw
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeBody } from './Body';
import { type as typeHead } from './Head';

export const type = 'mj-raw';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'raw'),
        draggable: componentsToQuery([typeBody, typeHead]),
        stylable: false,
        'style-default': {},
        'style': {},
        'attributes': {}
      },
    },
    view: {
      ...coreMjmlView,
      tagName: 'section',
      attributes: {
        style: 'pointer-events: all;',
      },

      getMjmlTemplate() {
        const parent = this.model.parent();
        const parentView = parent?.view;
        const parentTag = parent?.attributes.tagName;
        // @ts-ignore
        const getInnerMjmlTemplate = parentView?.getInnerMjmlTemplate;

        if (getInnerMjmlTemplate && parentTag === 'mj-body') {
          let mjmlBody = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml>${mjmlBody.start}`,
            end: `${mjmlBody.end}</mjml>`,
          };
        } else if (getInnerMjmlTemplate && parentTag === 'mj-head') {
          let mjmlHead = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml>${mjmlHead.start}`,
            end: `${mjmlHead.end}</mjml>`,
          };
        } else {
          return {
            start: `<mjml><mj-body>`,
            end: `</mj-body></mjml>`,
          };
        }
      },

      getTemplateFromEl(sandboxEl: any) {
        return sandboxEl.innerHTML;
      },

      getChildrenSelector() {
        return '*';
      },


      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', this.render);
      },
    },
  });
};
