// Specs https://mjml.io/documentation/#mj-body

export default (editor, { dc, defaultModel, defaultView }) => {
  const type = 'mj-body';

  dc.addType(type, {

    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        draggable: false,
      },
    },{
      isComponent(el) {
        if (el.tagName == type.toUpperCase()) {
          return { type };
        }
      },
    }),
    view: defaultView,
  });

}
