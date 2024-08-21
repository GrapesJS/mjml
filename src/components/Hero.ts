// Specs: https://documentation.mjml.io/#mj-hero
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeBody } from './Body';
import { type as typeText } from './Text';
import { type as typeButton } from './Button';
import { type as typeImage } from './Image';
import { type as typeDivider } from './Divider';
import { type as typeNavbar } from './NavBar';
import { type as typeSocial } from './Social';
import { type as typeSpacer } from './Spacer';

export const type = 'mj-hero';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'hero'),
        draggable: componentsToQuery(typeBody),
        droppable: componentsToQuery([typeText, typeButton, typeImage, typeDivider, typeNavbar, typeSocial, typeSpacer]),
        stylable: [
          'background-color', 'background-height', 'background-position', 'background-url',
          'background-width', 'css-class', 'height', 'mode', 'padding', 'padding-top',
          'padding-left', 'padding-right', 'padding-bottom', 'vertical-align', 'width'
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
        return 'table tr td';
      },

    }
  });
};
