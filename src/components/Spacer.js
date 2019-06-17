// Specs: https://mjml.io/documentation/#mjml-social

export default (editor, {
    dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView
}) => {
    const type = 'mj-spacer-element';

    dc.addType(type, {
        model: defaultModel.extend({
            ...coreMjmlModel,

            defaults: {
                ...defaultModel.prototype.defaults,
                'custom-name': 'SpacerElement',
                draggable: '[data-gjs-type=mj-spacer]',
                stylable: [

                ],
                'style-default': {

                },
                traits: [
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
                style: 'pointer-events: all; display: table; width: 100%;',
            },

            getMjmlTemplate() {
                return {
                    start: `<mj-spacer>`,
                    end: `</mj-spacer>`,
                };
            },

            getTemplateFromEl(sandboxEl) {
                return sandboxEl.querySelector('tr > td > table').innerHTML;
            },

            getChildrenSelector() {
                return '';
            }
        }),
    });
}
