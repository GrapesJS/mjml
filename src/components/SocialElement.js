// Specs: https://mjml.io/documentation/#mjml-social

export default (editor, {
    dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView
}) => {
    const type = 'mj-social-element';

    dc.addType(type, {
        model: defaultModel.extend({
            ...coreMjmlModel,

            defaults: {
                ...defaultModel.prototype.defaults,
                'custom-name': 'SocialElement',
                draggable: '[data-gjs-type=mj-social]',
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
                    {name: 'name'},
                    {name: 'src'},
                    {name: 'href'},
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

            tagName: 'table',

            attributes: {
                style: 'pointer-events: all; float: none; display: inline-table;',
            },

            getMjmlTemplate() {
                return {
                    start: `<mjml><mj-body><mj-column><mj-social>`,
                    end: `</mj-social></mj-column></mj-body></mjml`,
                };
            },

            getTemplateFromEl(sandboxEl) {
                return sandboxEl.querySelector('tr > td > table').innerHTML;
            },

            getChildrenSelector() {
                return 'img';
            }
        }),
    });
}
