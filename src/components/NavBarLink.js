export default (editor, {
  dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView
}) => {
  const type = 'mj-navbar-link';

  dc.addType(type, {
    extend: 'link',
    model: defaultModel.extend({
      ...coreMjmlModel,

      defaults: {
        ...defaultModel.prototype.defaults,
        'custom-name': 'NavBarLink',
        highlightable: false,
        draggable: '[data-gjs-type=mj-navbar]',
        'style-default': {
          // TODO
        },
        stylable: [
          // TODO
        ],
        traits: ['href'],
      },
    }, {

        isComponent(el) {
          if (el.tagName === type.toUpperCase()) {
            return { type };
          }
        },
      }),


    view: defaultView.extend({
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

    }),
  });
}