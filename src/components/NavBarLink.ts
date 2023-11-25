// Specs: https://documentation.mjml.io/#mj-navbar-link
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeNavBar } from './NavBar';

export const type = 'mj-navbar-link';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    extend: 'link',
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'navLink'),
        draggable: componentsToQuery(typeNavBar),
        highlightable: false,
        stylable: [
          'font-style', 'font-size', 'font-weight', 'font-family', 'color',
          'text-decoration', 'text-transform',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
        ],
        'style-default': {
          'font-size': '13px',
          'padding-top': '25px',
          'padding-bottom': '25px',
          'padding-left': '10px',
          'padding-right': '10px',
          'text-transform': 'uppercase',
        },
        traits: ['href'],
      },
    },


    view: {
      ...coreMjmlView,
      tagName: 'a',
      attributes: {
        style: 'float: none; display: inline-table;',
      },

      getMjmlTemplate() {
        let parentView = this.model.parent()?.view;
        // @ts-ignore
        if (parentView?.getInnerMjmlTemplate) {
          let mjmlNavBar = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml><mj-body><mj-column>${mjmlNavBar.start}`,
            end: `${mjmlNavBar.end}</mj-column></mj-body></mjml>`,
          };
        } else {
          return {
            start: `<mjml><mj-body><mj-column><mj-navbar>`,
            end: `</mj-navbar></mj-column></mj-body></mjml>`,
          };
        }
      },

      /**
       * #305 prevent content repeating
       */
      rerender() {
        this.render();
      },

      getTemplateFromEl(sandboxEl: any) {
        return sandboxEl.querySelector('div').innerHTML;
      },

      getChildrenSelector() {
        return 'a,p';
      },
    },
  });
};
