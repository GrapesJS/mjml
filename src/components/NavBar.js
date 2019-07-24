export default (editor, {
  dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView
}) => {
  const type = 'mj-navbar';

  dc.addType(type, {
    model: defaultModel.extend({
      ...coreMjmlModel,

      defaults: {
        ...defaultModel.prototype.defaults,
        'custom-name': 'NavBar',
        draggable: '[data-gjs-type=mj-column]',
        droppable: '[data-gjs-type=mj-navbar-link]',
        'style-default': {
          // TODO
        },
        stylable: [
          // TODO
        ],
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

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', this.render);
      },

      getChildrenSelector() {
        return 'div';
      },
    }),
  });
}