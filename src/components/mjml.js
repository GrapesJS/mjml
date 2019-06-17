// Specs: https://mjml.io/documentation/#mjml

export default (editor, {dc, defaultModel, defaultView}) => {
    const type = 'mjml';

    dc.addType(type, {

        model: defaultModel.extend({
            defaults: {
                ...defaultModel.prototype.defaults,
                droppable: '[data-gjs-type=mj-head], [data-gjs-type=mj-body]',
                draggable: false,
            },
        }, {
            isComponent(el) {
                if (el.tagName == type.toUpperCase()) {
                    return {type};
                }
            },
        }),

        view: defaultView,
    });

}
