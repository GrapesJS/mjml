// Specs: https://mjml.io/documentation/#mjml-text

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-text';

  dc.addType(type, {
    extend: 'text',
    extendFnView: ['onActive'],

    isComponent(el) {
      if (el.tagName === type.toUpperCase()) {
        return {
          type,
          content: el.innerHTML,
          components: [],
        };
      }
    },

    model: {
      ...coreMjmlModel,
      defaults: {
        name: editor.I18n.t('grapesjs-mjml.components.names.text'),
        draggable: '[data-gjs-type=mj-column], [data-gjs-type=mj-hero]',
        highlightable: false,
        stylable: [
          'height', 'font-style', 'font-size', 'font-weight', 'font-family', 'color',
          'line-height', 'letter-spacing', 'text-decoration', 'align', 'text-transform',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'container-background-color'
        ],
        'style-default': {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '25px',
          'padding-left': '25px',
          'font-size': '13px',
          'line-height': '22px',
          'align': 'left',
        },
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%',
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
        return 'td > div';
      },

      /**
       * Prevent content repeating
       */
      renderChildren() {
        coreMjmlView.renderChildren.call(this);
      },

      /**
       * Need to make text selectable.
       */
      onActive() {
        this.getChildrenContainer().style.pointerEvents = 'all';
      },
    },
  });
};
