import { isComponentType } from '.';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-carousel-image';

  dc.addType(type, {
    isComponent: isComponentType(type),
    extend: 'image',
    model: {
      ...coreMjmlModel,

      defaults: {
        name: 'Carousel Image',
        draggable: '[data-gjs-type=mj-carousel]',
        highlightable: false,
        resizable: false,
        stylable: [
          'width', 'height',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color',
          'container-background-color', 'align',
        ],
        'style-default': {
          //TODO
        },
        traits: ['href', 'rel', 'alt', 'title'],
      },
    },


    view: {
      ...coreMjmlView,

      tagName: 'a',

      attributes: {
        style: 'pointer-events: all; float: none; display: inline-table;',
      },

      getMjmlTemplate() {
        // Need it for responsive columns
        //let images = this.model.collection.length - 1;
        //images = images ? images : 0;
        //let addCarouselImages = Array(images).fill('<mj-carousel-images></mj-carousel-images>').join('');
        let parentView = this.model.parent().view;
        if (parentView.getInnerMjmlTemplate) {
          let mjmlCarousel = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml><mj-body><mj-column>${mjmlCarousel.start}`,
            end: `${mjmlCarousel.end}</mj-column></mj-body></mjml>`,
          };
        } else {
          return {
            start: `<mjml><mj-body><mj-column><mj-carousel>`,
            end: `</mj-carousel></mj-column></mj-body></mjml>`,
          };
        }
      },

      getTemplateFromEl(sandboxEl) {
        return sandboxEl.querySelector('a.mj-carousel-thumbnail').outerHTML;
      },

      getChildrenSelector() {
        return 'img';
      },
    },
  });
};