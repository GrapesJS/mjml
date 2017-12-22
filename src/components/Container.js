// Specs: https://mjml.io/documentation/#mjml-container

export default (editor, {
  dc, defaultModel, defaultView, coreMjmlModel, coreMjmlView
}) => {
  const type = 'mj-container';
  const droppable = [
    'mj-section',
    'mj-wrapper',
  ].map(tag => `[data-type=${tag}]`).join(', ');

  dc.addType(type, {


    model: defaultModel.extend({
      ...coreMjmlModel,

      defaults: {
        ...defaultModel.prototype.defaults,
        droppable,
        'custom-name': 'Container',
        draggable: false,
        copyable: false,
        removable: false,
        'style-default': { width: '600px' },
        stylable: [
          // Currently the UX sucks too much with the heavy rendering approach
          'width',
          'background-color'
        ],
      },
    },{
      isComponent(el) {
        if (el.tagName == 'MJ-CONTAINER') {
          return { type };
        }
      },
    }),


    view: defaultView.extend({
      ...coreMjmlView,

      tagName: 'div',

      attributes: {
        style: 'width: 100%; min-height: 100%',
        'data-type': 'mj-container',
      },

      getChildrenSelector() {
        return 'div';
      },

      getInnerMjmlTemplate() {
        let orig = coreMjmlView.getInnerMjmlTemplate.call(this);
        return {
          start: `${orig.start}<mj-section></mj-section>`,
          end: `${orig.end}`,
        };
      },

      renderStyle() {
        this.el.style = this.el.getAttribute('style') + this.attributes.style;
      },

      renderContent() {
        this.getChildrenContainer().innerHTML = this.model.get('content');
      },

    }),
  });
}
