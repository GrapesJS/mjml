// Specs: https://mjml.io/documentation/#mjml-spacer

export default (editor, {
  dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView
}) => {
  const type = 'mj-spacer';

  dc.addType(type, {


    model: defaultModel.extend({ ...coreMjmlModel,

      defaults: { ...defaultModel.prototype.defaults,
        'custom-name': 'Spacer',
        draggable: '[data-type=mj-column]',
        droppable: false,
        'style-default': { height: '20px' },
        stylable: ['height'],
        void: true,
      },
    },{

      isComponent(el) {
        if (el.tagName == type.toUpperCase()) {
          return { type };
        }
      },
    }),


    view: defaultView.extend({ ...coreMjmlView,

      tagName: 'tr',

      attributes: {
        style: 'pointer-events: all; display: table; width: 100%;',
      },
    }),
  });
}
