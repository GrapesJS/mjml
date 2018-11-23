// Specs https://mjml.io/documentation/#mj-body

export default (editor, { dc, defaultModel, defaultView, coreMjmlView }) => {
  const type = 'mj-body';
  const droppable = [
    'mj-section',
    'mj-wrapper',
  ].map(tag => `[data-type=${tag}]`).join(', ');

  dc.addType(type, {

    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        droppable,
        draggable: false,
      },
    },{
      isComponent(el) {
        if (el.tagName == type.toUpperCase()) {
          return { type };
        }
      },
    }),
    view: defaultView.extend({
      attributes: {
        style: 'width: 100%; min-height: 100%',
        'data-type': 'mj-body',
      },
    }),
  });

}
