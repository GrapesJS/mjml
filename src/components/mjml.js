export default (editor, { dc, defaultModel, defaultView }) => {
  const type = 'mjml';

  dc.addType(type, {

    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        droppable: '[data-type=mj-head], [data-type=mj-body]',
        draggable: false,
      },
    },{
      isComponent(el) {
        if (el.tagName == 'MJML') {
          return { type };
        }
      },
    }),

    view: defaultView,
  });

}
