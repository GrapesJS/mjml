// Specs: https://mjml.io/documentation/#mjml-social

export default (editor, {
  dc, opt, defaultModel, defaultView, coreMjmlModel, coreMjmlView
}) => {
  const type = 'mj-social';

  dc.addType(type, {


    model: defaultModel.extend({ ...coreMjmlModel,

      defaults: { ...defaultModel.prototype.defaults,
        'custom-name': 'Social',
        draggable: '[data-type=mj-column]',
        droppable: false,
        stylable: [
          'text-decoration', 'align', 'font-family', 'font-size', 'line-height',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'container-background-color',
          'color',
          'facebook-icon-color', 'twitter-icon-color', 'google-icon-color',
          'instagram-icon-color', 'linkedin-icon-color', 'pinterest-icon-color',
        ],
        'style-default': {
          'align': 'center',
          'icon-size': '20px',
          'font-size': '13px',
          'line-height': '22px',
          'facebook-icon-color': '#3b5998',
          'twitter-icon-color': '#55acee',
          'google-icon-color': '#dc4e41',
          'instagram-icon-color': '#3f729b',
          'linkedin-icon-color': '#0077b5',
          'pinterest-icon-color': '#bd081c',
          'display': 'facebook twitter google'
        },
        traits: [
          'display', // facebook twitter google
          {
            name: 'facebook-content',
            value: 'Share',
          },{
            name: 'facebook-href',
          },{
            name: 'twitter-content',
            value: 'Tweet',
          },{
            name: 'twitter-href',
          },{
            name: 'google-content',
            value: '+1',
          },{
            name: 'google-href',
          },{
            name: 'instagram-content',
            value: 'Share',
          },{
            name: 'instagram-href',
          },{
            name: 'linkedin-content',
            value: 'Share',
          },{
            name: 'linkedin-href',
          },{
            name: 'pinterest-content',
            value: 'Pin it',
          },{
            name: 'pinterest-href',
          },{
            type: 'select',
            label: 'Mode',
            name: 'mode',
            options: [
              {value: 'horizontal', name: 'Horizontal'},
              {value: 'vertical', name: 'Vertical'},
            ]
          }
        ],
        void: true,
      },
    },{

      isComponent(el) {
        if (el.tagName == type.toUpperCase()) {
          return { type };
        }
      },
    }),


    view: defaultView.extend({ ...coreMjmlView,

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

      render() {
        this.renderAttributes();
        this.el.innerHTML = this.getTemplateFromMjml();
        let content = this.model.get('content').trim();

        if (content) {
          this.getChildrenContainer().innerHTML = content;
        }

        this.renderChildren();
        this.el.style = this.attributes.style;
        return this;
      },

      getChildrenSelector() {
        return 'img';
      }
    }),
  });
}
