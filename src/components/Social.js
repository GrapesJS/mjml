// Specs: https://mjml.io/documentation/#mjml-social

export default (editor, {
    dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView
}) => {
    const type = 'mj-social';

    dc.addType(type, {
        model: defaultModel.extend({
            ...coreMjmlModel,

            defaults: {
                ...defaultModel.prototype.defaults,
                'custom-name': 'Social',
                draggable: '[data-gjs-type=mj-column]',
                droppable: '[data-gjs-type=mj-social-element]',
                stylable: [
                    'text-decoration', 'align', 'font-family', 'font-size', 'line-height',
                    'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
                    'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
                    'container-background-color',
                    'color',
                ],
                'style-default': {
                    'align': 'center',
                    'icon-size': '20px',
                    'font-size': '13px',
                    'line-height': '22px',
                },
                traits: [
                    {
                        type: 'select',
                        label: 'Mode',
                        name: 'mode',
                        options: [
                            {value: 'horizontal', name: 'Horizontal'},
                            {value: 'vertical', name: 'Vertical'},
                        ]
                    }
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

            getChildrenSelector() {
                return 'td';
            },
        }),
    });
}
