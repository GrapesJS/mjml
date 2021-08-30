// Specs: https://mjml.io/documentation/#mjml-image
import { isComponentType } from './utils.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-image';

  dc.addType(type, {
    isComponent: isComponentType(type),
    extend: 'image',

    model: {
      ...coreMjmlModel,
      defaults: {
        name: editor.I18n.t('grapesjs-mjml.components.names.image'),
        resizable: false,
        highlightable: false,
        draggable: '[data-gjs-type=mj-column],[data-gjs-type=mj-section], [data-gjs-type=mj-hero]',
        stylable: [
          'width', 'height',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color',
          'container-background-color', 'align',
        ],
        'style-default': {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '25px',
          'padding-left': '25px',
          'align': 'center',
        },
        traits: ['href', 'rel', 'alt', 'title'],
        void: true,
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%; user-select: none;',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body width="auto"><mj-column>`,
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
