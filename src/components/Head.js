// Specs: https://mjml.io/documentation/#mj-head

export default (editor, {dc, defaultModel, defaultView}) => {
    const type = 'mj-head';
    const droppable = [
        'mj-preview',
        'mj-attributes',
        'mj-style',
        'mj-font',
        'mj-title',
    ].map(tag => `[data-gjs-type=${tag}]`).join(', ');

    dc.addType(type, {

        model: defaultModel.extend({
            defaults: {
                ...defaultModel.prototype.defaults,
                droppable,
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
