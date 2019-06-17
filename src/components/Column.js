// Specs: https://mjml.io/documentation/#mjml-column

import mjml2html from 'mjml4-in-browser';

export default (editor, {
    dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView, sandboxEl
}) => {
    const type = 'mj-column';
    const clmPadd = opt.columnsPadding;

    dc.addType(type, {
        model: defaultModel.extend({
            ...coreMjmlModel,

            defaults: {
                ...defaultModel.prototype.defaults,
                'custom-name': 'Column',
                draggable: '[data-gjs-type=mj-section]',
                stylable: [
                    'background-color', 'vertical-align', 'width',
                    'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
                    'border', 'border-width', 'border-style', 'border-color',
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

            tagName: 'div',

            attributes: {
                style: 'pointer-events: all;' +
                    (clmPadd ? `padding: ${clmPadd};` : ''),
            },

            getTemplateFromMjml() {
                let mjmlTmpl = this.getMjmlTemplate();
                let innerMjml = this.getInnerMjmlTemplate();
                const htmlOutput = mjml2html(`${mjmlTmpl.start}
          ${innerMjml.start}${innerMjml.end}${mjmlTmpl.end}`);
                let html = htmlOutput.html;

                // I need styles for responsive columns
                let styles = [];
                sandboxEl.innerHTML = html;
                var styleArr = Array.from(sandboxEl.querySelectorAll('style'));
                styleArr.forEach((item) => {
                    styles.push(item.innerHTML);
                });


                let content = html.replace(/<body(.*)>/, '<body>');
                let start = content.indexOf('<body>') + 6;
                let end = content.indexOf('</body>');
                sandboxEl.innerHTML = content.substring(start, end).trim();
                let componentEl = this.getTemplateFromEl(sandboxEl);

                // Copy all rendered attributes (TODO need for all)
                let attributes = {};
                const elAttrs = componentEl.attributes;

                for (let elAttr, i = 0, len = elAttrs.length; i < len; i++) {
                    elAttr = elAttrs[i];
                    attributes[elAttr.name] = elAttr.value;
                }

                return {
                    attributes,
                    content: componentEl.innerHTML,
                    style: styles.join(' ')
                };
            },

            render() {
                this.renderAttributes();
                const mjmlResult = this.getTemplateFromMjml();
                this.el.innerHTML = mjmlResult.content;
                this.$el.attr(mjmlResult.attributes);
                editor.addComponents(`<style>${mjmlResult.style}</style>`);
                this.getChildrenContainer().innerHTML = this.model.get('content');
                this.renderChildren();
                this.renderStyle();
                return this;
            },

            renderStyle() {
                this.el.style = this.el.getAttribute('style') + this.attributes.style;
            },

            getMjmlTemplate() {
                // Need it for responsive columns
                let cols = this.model.collection.length - 1;
                cols = cols ? cols : 0;
                let addColmn = Array(cols).fill('<mj-column></mj-column>').join('');

                return {
                    start: `<mjml><mj-body><mj-section>`,
                    end: `${addColmn}</mj-section/></mj-body></mjml>`,
                };
            },

            getTemplateFromEl(sandboxEl) {
                return sandboxEl.firstChild.querySelector('div > table > tbody > tr > td > div');
            },

            getChildrenSelector() {
                return 'table'
            },
        }),
    });
}
