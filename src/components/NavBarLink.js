import { isComponentType } from './utils.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-navbar-link';

  dc.addType(type, {
    isComponent: isComponentType(type),
    extend: 'link',
    extendFnView: ['onActive', 'disableEditing'],
    model: {
      ...coreMjmlModel,

      defaults: {
        name: editor.I18n.t('grapesjs-mjml.components.names.navLink'),
        draggable: '[data-gjs-type=mj-navbar]',
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
        style: 'pointer-events: all; float: none; display: inline-table;',
      },

      getMjmlTemplate() {
        let parentView = this.model.parent().view;
        if (parentView.getInnerMjmlTemplate) {
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

      getTemplateFromEl(sandboxEl) {
        return sandboxEl.querySelector('div').innerHTML;
      },

      getChildrenSelector() {
        return 'a,p';
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

      disableEditing() {
        this.getChildrenContainer().style.pointerEvents = 'none';
      },
    },
  });
};
