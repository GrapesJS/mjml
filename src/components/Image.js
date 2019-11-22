// Specs: https://mjml.io/documentation/#mjml-image
import { isComponentType } from './index.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-image';

  dc.addType(type, {
    isComponent: isComponentType(type),
    extend: 'image',

    model: {
      ...coreMjmlModel,
      defaults: {
        name: 'Image',
        resizable: false,
        highlightable: false,
        draggable: '[data-gjs-type=mj-column],[data-gjs-type=mj-section]',
        stylable: [
          'width', 'height',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color',
          'container-background-color', 'align',
        ],
        'style-default': {
          'padding-top': '0px',
          'padding-bottom': '0px',
          'padding-right': '0px',
          'padding-left': '0px',
          'align': 'center',
        },
        traits: ['href', 'rel', 'alt', 'title'],
        void: false,
      },
      toHTML() {
        let code = '';
        let model = this;
        let tag = model.get('tagName');
        let sTag = model.get('void');

        // Build the string of attributes
        let strAttr = '';
        let attr = this.getAttrToHTML();
        for (let prop in attr) {
          let val = attr[prop];
          strAttr += typeof val !== 'undefined' && val !== '' ? ' ' + prop + '="' + val + '"' : '';
        }

        code += `<${tag}${strAttr}${sTag ? '/' : ''}>` + model.get('content');

        if (!sTag) code += `</${tag}>`;

        // Add the components after the closing tag.
        //
        // This will also fix an issue caused by changing void property value
        // where an imported template has an mj-image that is not enclosed by a closing tag,
        // the editor adds the mj-image closing tag right before its parent's closing tag.
        // Ultimately making all its sibling as its children.
        model.get('components').each(model => {
          code += model.toHTML();
        });

        return code;
      }
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%; user-select: none;',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body><mj-column>`,
          end: `</mj-column></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl) {
        return sandboxEl.querySelector('tr').innerHTML;
      },

      getChildrenSelector() {
        return 'img';
      },
    },
  });
};
