import { isComponentType } from ".";

export default (editor, {
  dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView
}) => {
  const type = 'mj-navbar-link';

  dc.addType(type, {
    isComponent: isComponentType(type),
    extend: 'link',
    model: {
      ...coreMjmlModel,

      defaults: {
        'custom-name': 'NavBarLink',
        draggable: '[data-gjs-type=mj-navbar]',
        highlightable: false,
        'style-default': {
          // TODO
        },
        stylable: [
          // TODO
        ],
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
        return {
          start: `<mjml><mj-body><mj-column><mj-navbar>`,
          end: `</mj-navbar></mj-column></mj-body></mjml`,
        };
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
    },
  });
}