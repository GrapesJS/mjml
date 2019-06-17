// Specs: https://mjml.io/documentation/#mjml-button

export default (editor, {
    dc, opt, linkModel, linkView, coreMjmlModel, coreMjmlView
}) => {
    const type = 'mj-button';

    dc.addType(type, {


        model: linkModel.extend({
            ...coreMjmlModel,

            defaults: {
                ...linkModel.prototype.defaults,
                'custom-name': 'Button',
                draggable: '[data-gjs-type=mj-column]',
                highlightable: false,
                stylable: ['width', 'height',
                    'background-color', 'container-background-color',
                    'font-style', 'font-size', 'font-weight', 'font-family', 'color',
                    'text-decoration', 'align',
                    'vertical-align', 'text-transform',
                    'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
                    'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
                    'border', 'border-width', 'border-style', 'border-color',],
                'style-default': {
                    'background-color': '#414141',
                    'border-radius': '3px',
                    'font-size': '13px',
                    'font-weight': '400',
                    'color': '#ffffff',
                    'vertical-align': 'middle',
                    'padding-bottom': '10px',
                    'padding-right': '25px',
                    'padding-left': '25px',
                    'align': 'center',
                },
                traits: ['href'],
                // 'container-background-color', 'inner-padding'
            },
        }, {

            isComponent(el) {
                if (el.tagName == type.toUpperCase()) {
                    return {type};
                }
            },
        }),


        view: linkView.extend({
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
                return 'a,p';
            },

            /**
             * Prevent content repeating
             */
            renderChildren() {
                coreMjmlView.renderChildren.call(this);
            },
        }),
    });
}
