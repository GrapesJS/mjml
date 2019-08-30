import mjml2html from 'mjml';
import { isComponentType } from '.';

export default (editor, { dc, coreMjmlModel, coreMjmlView, sandboxEl }) => {
  const type = 'mj-carousel';

  dc.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: 'Carousel',
        draggable: '[data-gjs-type=mj-column]',
        droppable: '[data-gjs-type=mj-carousel-image]',
        'style-default': {
          // TODO
        },
        stylable: [
          // TODO
        ],
      },
    },

    view: {
      ...coreMjmlView,

      tagName: 'tr',

      attributes: {
        style: 'pointer-events: all; display: table; width: 100%',
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', this.render);
      },

      getTemplateFromMjml() {
        let mjmlTmpl = this.getMjmlTemplate();
        let innerMjml = this.getInnerMjmlTemplate();
        const htmlOutput = mjml2html(`${mjmlTmpl.start}
          ${innerMjml.start}${innerMjml.end}${mjmlTmpl.end}`);
        let html = htmlOutput.html;

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

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body><mj-column>`,
          end: `</mj-column></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl) {
        return sandboxEl.firstChild.querySelector('div.mj-carousel');
      },

      getChildrenSelector() {
        return 'div.mj-carousel-content';
      },

      rerender() {
        coreMjmlView.rerender.call(this);
        this.model.components().models.forEach((item) => {
          if (item.attributes.type != "mj-carousel-image") {
            return;
          }
          item.view.rerender();
        });
      },
    },
  });
};