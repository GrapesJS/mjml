// Specs: https://documentation.mjml.io/#mjml
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { isComponentType, componentsToQuery } from './utils';
import { type as typeHead } from './Head';
import { type as typeBody } from './Body';

export const type = 'mjml';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        droppable: componentsToQuery([typeHead, typeBody]),
        draggable: false,
        stylable: false,
        copyable: false,
        removable: false,
        highlightable: false,
        traits: [
          {
            name: 'owa',
            placeholder: 'eg. desktop',
          },
          {
            name: 'lang',
            placeholder: 'eg. en',
          },
          {
            name: 'dir',
            placeholder: 'eg. rtl',
          },
        ],
      },
    },
    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: { style: 'min-height: 100vh' },
      rerender() {
        this.render();
      },
      getTemplateFromMjml() {
        return '';
      }
    },
  });

};
