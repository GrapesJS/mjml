// Specs: https://mjml.io/documentation/#mjml-divider

export default (editor, {
    dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView
}) => {
    const type = 'mj-divider';

    dc.addType(type, {


        model: defaultModel.extend({
            ...coreMjmlModel,

            defaults: {
                ...defaultModel.prototype.defaults,
                'custom-name': 'Divider',
                draggable: '[data-gjs-type=mj-column]',
                droppable: false,
                'style-default': {
                    'width': '100%',
                    'border-width': '4px',
                    'border-style': 'solid',
                    'border-color': '#000000',
                    'padding-top': '10px',
                    'padding-bottom': '10px',
                    'padding-right': '25px',
                    'padding-left': '25px',
                },
                stylable: [
                    'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
                    'width', 'container-background-color',
                    'border-detached', 'border-width', 'border-style', 'border-color'
                ],
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
                style: 'pointer-events: all; display: table; width: 100%; user-select: none;',
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

            getChildrenSelector() {
                return 'p';
            },
        }),
    });
}
