// Specs: https://mjml.io/documentation/#mjml-spacer

export default (editor, {
    dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView
}) => {
    const type = 'mj-spacer';

    dc.addType(type, {

        model: defaultModel.extend({
            ...coreMjmlModel,

            defaults: {
                ...defaultModel.prototype.defaults,
                'custom-name': 'Spacer',
                draggable: '[data-gjs-type=mj-column]',
                droppable: false,
                'style-default': {height: '20px'},
                stylable: ['height', 'container-background-color'],
                void: true,
            },
        }, {

            isComponent(el) {
                if (el.tagName == type.toUpperCase()) {
                    return {type};
                }
            },
        }),


        view: defaultView.extend({
            ...coreMjmlView,

            tagName: 'tr',

            attributes: {
                style: 'pointer-events: all; display: table; width: 100%;',
            },

            getMjmlTemplate() {
                return {
                    start: `<mjml><mj-body><mj-column>`,
                    end: `</mj-column></mj-body></mjml`,
                };
            },

            getTemplateFromEl(sandboxEl) {
                return sandboxEl.querySelector('tr').innerHTML;
            },

            getChildrenSelector() {
                return 'td';
            }
        }),
    });
}