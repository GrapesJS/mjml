import { isComponentType } from './index.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-carousel';

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        draggable: '[data-gjs-type=mj-column]',
        stylable: [
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'tb-border-radius', 'tb-border-top-left-radius', 'tb-border-top-right-radius', 'tb-border-bottom-left-radius', 'tb-border-bottom-right-radius',
          'tb-border', 'tb-border-style', 'tb-border-color', 'tb-border-width', 'tb-hover-border-color', 'tb-selected-border-color',
          'tb-width', 'icon-width',
        ],
        traits: [{ // make it so that you have to enter text for how many images you want
          label: 'Thumbnail',
          name: 'thumbnails',
          options: [
            { value: 'visible', name: 'Visible' },
            { value: 'hidden', name: 'Hidden' },
          ],
          type: 'select',
        }],
      },
    },

    view: {
      ...coreMjmlView,

      tagName: 'div',
      attributes: {
        style: 'pointer-events: all;',
      },

      render(p, c, opts, appendChildren) {
        this.renderAttributes();
        const sandbox = document.createElement('div');
        let mjmlResult = this.getTemplateFromMjmlWithStyle();
        sandbox.innerHTML = mjmlResult.content;
        const carouselEl = sandbox.querySelector('.mj-carousel');
        carouselEl.querySelectorAll('a').forEach((link) => {
          // make all links unclickable
          link.removeAttribute('href');
          // fixes a weird bug with the preview thumbnails not matching how it's actually rendered
          // let width = link.style.width;
          // if (width && width.includes('%')) {
          //   let newWidth = '';
          //   let widthNum = parseInt(width);
          //   let widthUnit = '%';
          //   newWidth = `${widthNum + 1}${widthUnit}`;
          //   link.style.width = newWidth;
          // }
        });

        // tries to fix a WEIRD WEIRD bug with preview thumbnail not rendering correctly on the editor
        // carouselEl.querySelector('.mj-carousel-content').style.width = '99%';

        this.el.innerHTML = carouselEl.outerHTML;
        editor.addComponents(`<style>${mjmlResult.style}</style>`);
        // debugger;
        this.renderStyle();
        return this;
      },

      getTemplateFromEl(sandboxEl) {
        return sandboxEl.firstChild.querySelector('.mj-carousel').parentElement;
      },

      getChildrenSelector() {
        return '.mj-carousel-images';
      },

      renderStyle() {
        this.el.style = this.el.getAttribute('style') + this.attributes.style;
      },

      getInnerMjmlTemplate() {
        let innerMjmlTemplate = coreMjmlView.getInnerMjmlTemplate.call(this);
        // TODO replace this with dynamic mjml images
        innerMjmlTemplate.start = `${innerMjmlTemplate.start}
          <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/11/ecommerce-guide.jpg"></mj-carousel-image>
          <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/09/3@1x.png"></mj-carousel-image>
          <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/09/1@1x.png"></mj-carousel-image>`;
        // innerMjmlTemplate.start = `${innerMjmlTemplate.start}${this.model.getCarouselImagesMjml()}`;
        return innerMjmlTemplate;
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body><mj-section><mj-column>`,
          end: `</mj-column></mj-section></mj-body></mjml>`,
        };
      },
    },
  });
};
