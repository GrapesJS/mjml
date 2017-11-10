import { mjml2html } from 'mjml'

export default (editor, opt = {}) => {
  let domc = editor.DomComponents;
  let defaultType = domc.getType('default');
  let textType = domc.getType('text');
  let imageType = domc.getType('image');
  let linkType = domc.getType('link');
  let defaultModel = defaultType.model;
  let defaultView = defaultType.view;
  let textModel = textType.model;
  let textView = textType.view;
  let imageModel = imageType.model;
  let imageView = imageType.view;
  let linkModel = linkType.model;
  let linkView = linkType.view;
  const ComponentsView = domc.ComponentsView;
  const sandboxEl = document.createElement('div');




  // MJML Core model
  let coreMjmlModel = {
    init() {
      let attrs = Object.assign({}, this.get('attributes'));
      let style = this.get('style');
      this.defaultStyle = style;

      for (let prop in style) {
        if (!(prop in attrs)) {
          attrs[prop] = style[prop];
        }
      }

      this.set('attributes', attrs);
      this.set('style', attrs);
      this.listenTo(this, 'change:style', this.handleStyleChange);
    },

    handleStyleChange() {
      let style = Object.assign({}, this.get('attributes'), this.get('style'));
      this.set('attributes', style);
    },

    getMjmlAttributes() {
      let attr = this.get('attributes') || {};
      delete attr.style;
      let src = this.get('src');
      if(src)
        attr.src = src;
      return attr;
    },

    /**
     * This will avoid rendering default attributes
     * @return {Object}
     */
    getAttrToHTML() {
      let attr = Object.assign({}, this.get('attributes') || {});
      let style = Object.assign({}, this.defaultStyle || {});
      delete attr.style;

      for (let prop in attr) {
        if (attr[prop] == style[prop]) {
          delete attr[prop];
        }
      }

      return attr;
    },

    /**
     * Rhave to change few things for hte MJML's xml (no id, style, class)
     */
    toHTML(opts) {
      let code = '';
      let model = this;
      let tag = model.get('tagName'),
      sTag = model.get('void');

      // Build the string of attributes
      let strAttr = '';
      let attr = this.getAttrToHTML();
      for (let prop in attr) {
        let val = attr[prop];
        strAttr += typeof val !== undefined && val !== '' ?
          ' ' + prop + '="' + val + '"' : '';
      }

      code += `<${tag}${strAttr}${sTag ? '/' : ''}>` + model.get('content');

      model.get('components').each((model) => {
        code += model.toHTML();
      });

      if(!sTag)
        code += `</${tag}>`;

      return code;
    },

  };





  // MJML Core view
  let coreMjmlView = {
    init() {
      this.stopListening(this.model, 'change:style');
      this.listenTo(this.model, 'change:attributes change:src', this.rerender);
    },

    rerender() {
      this.render(null, null, {}, 1);
    },

    getMjmlTemplate() {
      return {
        start: `<mjml><mj-body>`,
        end: `</mj-body></mjml>`,
      };
    },

    getInnerMjmlTemplate() {
      const model = this.model;
      let tagName = model.get('tagName');
      let attr = model.getMjmlAttributes();
      let strAttr = '';

      for(let prop in attr) {
        let val = attr[prop];
        strAttr += typeof val !== undefined && val !== '' ?
          ' ' + prop + '="' + val + '"' : '';
      }

      return {
        start: `<${tagName} ${strAttr}>`,
        end: `</${tagName}>`,
      };
    },

    getTemplateFromEl(sandboxEl) {
      return sandboxEl.firstChild.innerHTML;
    },

    getTemplateFromMjml() {
      let mjmlTmpl = this.getMjmlTemplate();
      let innerMjml = this.getInnerMjmlTemplate();
      const htmlOutput = mjml2html(`${mjmlTmpl.start}
        ${innerMjml.start}${innerMjml.end}${mjmlTmpl.end}`);
      let html = htmlOutput.html;
      html = html.replace(/<body(.*)>/, '<body>');
      let start = html.indexOf('<body>') + 6;
      let end = html.indexOf('</body>');
      html = html.substring(start, end).trim();
      sandboxEl.innerHTML = html;
      return this.getTemplateFromEl(sandboxEl);
    },

    /**
     * Render children components
     * @private
     */
    renderChildren: function(appendChildren) {
      var container = this.getChildrenContainer();

      // This trick will help perfs by caching children
      if (!appendChildren) {
        this.componentsView = new ComponentsView({
          collection: this.model.get('components'),
          config: this.config,
          defaultTypes: this.opts.defaultTypes,
          componentTypes: this.opts.componentTypes,
        });
        this.childNodes = this.componentsView.render(container).el.childNodes;
      } else {
        this.componentsView.parent = container;
      }

      var childNodes = Array.prototype.slice.call(this.childNodes);

      for (var i = 0, len = childNodes.length ; i < len; i++) {
        container.appendChild(childNodes.shift());
      }

      if (container !== this.el) {
        var disableNode = function(el) {
          var children = Array.prototype.slice.call(el.children);
          children.forEach(function (el) {
            el.style['pointer-events'] = 'none';
            if (container !== el) {
              disableNode(el);
            }
          });
        };
        disableNode(this.el);
      }
    },

    renderStyle() {
      this.el.style = this.attributes.style;
    },

    renderContent() {
      let content = this.model.get('content');

      if (content) {
        this.getChildrenContainer().innerHTML = content;
      }
    },

    render(p, c, opts, appendChildren) {
      this.renderAttributes();
      this.el.innerHTML = this.getTemplateFromMjml();
      this.renderContent();
      this.renderChildren(appendChildren);
      this.childNodes = this.getChildrenContainer().childNodes;
      this.renderStyle();
      return this;
    }
  };





  // MJML Internal view (for elements inside mj-columns)
  let coreMjmlIntView = Object.assign({}, coreMjmlView);





  // MJML
  domc.addType('mjml', {
    model: defaultModel.extend({
      defaults: Object.assign({}, defaultModel.prototype.defaults, {
        droppable: '[data-type=mj-head], [data-type=mj-body]',
        draggable: false,
      }),
    },{
      isComponent(el) {
        if (el.tagName == 'MJML') {
          return {type: 'mjml'};
        }
      },
    }),
    view: defaultView,
  });





  // Body
  domc.addType('mj-body', {
    model: defaultModel.extend({
      defaults: Object.assign({}, defaultModel.prototype.defaults, {
        draggable: false,
      }),
    },{
      isComponent(el) {
        if (el.tagName == 'MJ-BODY') {
          return {type: 'mj-body'};
        }
      },
    }),
    view: defaultView,
  });





  // Container
  domc.addType('mj-container', {
    model: defaultModel.extend(Object.assign({}, coreMjmlModel, {
      defaults: Object.assign({}, defaultModel.prototype.defaults, {
        'custom-name': 'Container',
        draggable: false,
        copyable: false,
        removable: false,
        droppable: '[data-type=mj-section], [data-type=mj-wrapper]',
        stylable: [
          // Currently the UX sucks too much with the heavy rendering
          // approach, service workers might help
          'width',
          'background-color'
        ],
        style: {
          width: '600px',
          height: '100%'
        },
      }),
    }),{
      isComponent(el) {
        if (el.tagName == 'MJ-CONTAINER') {
          return {type: 'mj-container'};
        }
      },
    }),
    view: defaultView.extend(Object.assign({}, coreMjmlView, {
      tagName: 'div',

      attributes: {
        style: 'width: 100%',
        'data-type': 'mj-container',
      },

      getChildrenSelector() {
        return 'div';
      },

      getInnerMjmlTemplate() {
        let orig = coreMjmlView.getInnerMjmlTemplate.call(this);
        return {
          start: `${orig.start}<mj-section></mj-section>`,
          end: `${orig.end}`,
        };
      },

      renderStyle() {
        this.el.style = this.el.getAttribute('style') + this.attributes.style;
      },

      renderContent() {
        this.getChildrenContainer().innerHTML = this.model.get('content');
      },

    })),
  });





/*
  // Wrapper
  domc.addType('mj-wrapper', {
    model: defaultModel.extend({
      defaults: Object.assign({}, defaultModel.prototype.defaults, {
        draggable: '[data-type=mj-container]',
        //border, border-radius, background-color, background-url, background-repeat, background-size, vertical-align
        //text-align, padding
      }),
    },{
      isComponent(el) {
        if (el.tagName == 'mj-wrapper') {
          return {type: 'mj-wrapper'};
        }
      },
    }),
    view: defaultView,
  });
*/





  // Section
  domc.addType('mj-section', {
    model: defaultModel.extend(Object.assign({}, coreMjmlModel, {
      defaults: Object.assign({}, defaultModel.prototype.defaults, {
        'custom-name': 'Section',
        draggable: '[data-type=mj-container]',
        droppable: '[data-type=mj-column]',
        style: {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'vertical-align': 'top',
          'text-align': 'center',
        },
        stylable: [
          'vertical-align', 'text-align',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'background-color', 'background-url', 'background-repeat', 'background-size',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color'
        ],
      }),
    }), {
      isComponent(el) {
        if (el.tagName == 'MJ-SECTION') {
          return {type: 'mj-section'};
        }
      },
    }),
    // Section view
    view: defaultView.extend(Object.assign({}, coreMjmlView, {
      tagName: 'div',

      attributes: {
        style: 'pointer-events: all;',
        'data-type': 'mj-section',
      },

      getChildrenSelector() {
        return 'tbody > tr > td';
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', this.render);
      },
    })),
  });




  let clmPadd = opt.columnsPadding;
  // Column
  domc.addType('mj-column', {
    model: defaultModel.extend(Object.assign({}, coreMjmlModel, {
      defaults: Object.assign({}, defaultModel.prototype.defaults, {
        'custom-name': 'Column',
        draggable: '[data-type=mj-section]',
        stylable: [
          'background-color', 'vertical-align', 'width',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color',
        ],
      }),
    }), {
      isComponent(el) {
        if (el.tagName == 'MJ-COLUMN') {
          return {type: 'mj-column'};
        }
      },
    }),
    view: defaultView.extend(Object.assign({}, coreMjmlView, {
      tagName: 'div',

      attributes: {
        'data-type': 'mj-column',
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
        this.el.style = this.el.getAttribute('style') + this.attributes.style;
        return this;
      },

      getMjmlTemplate() {
        // Need it for responsive columns
        let cols = this.model.collection.length - 1;
        cols = cols ? cols : 0;
        let addColmn = Array(cols).fill('<mj-column></mj-column>').join('');

        return {
          start: `<mjml><mj-body><mj-container>`,
          end: `${addColmn}</mj-container></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl) {
        return sandboxEl.firstChild.querySelector('div');
      },

      getChildrenSelector() {
        return 'tbody';
      },
    })),
  });





  // Text
  domc.addType('mj-text', {
    model: textModel.extend(Object.assign({}, coreMjmlModel, {
      defaults: Object.assign({}, textModel.prototype.defaults, {
        'custom-name': 'Text',
        draggable: '[data-type=mj-column]',
        highlightable: false,
        stylable: [
          'height', 'font-style', 'font-size', 'font-weight', 'font-family', 'color',
          'line-height', 'letter-spacing', 'text-decoration', 'align', 'text-transform',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'container-background-color'
        ],
        style: {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '25px',
          'padding-left': '25px',
          'font-size': '13px',
          'line-height': '22px',
          'align': 'left',
        },
      }),
    }), {
      isComponent(el) {
        if (el.tagName == 'MJ-TEXT') {
          return {
            type: 'mj-text',
            content: el.innerHTML,
            components: [],
          };
        }
      },
    }),
    view: textView.extend(Object.assign({}, coreMjmlView, {
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
        return 'div';
      },

      /**
       * Prevent content repeating
       */
      renderChildren() {
        coreMjmlView.renderChildren.call(this);
      },

      /**
       * Need to make text selectable.
       */
      enableEditing() {
        textView.prototype.enableEditing.apply(this, arguments);
        this.getChildrenContainer().style.pointerEvents = 'all';
      },

      disableEditing() {
        textView.prototype.disableEditing.apply(this, arguments);
        this.getChildrenContainer().style.pointerEvents = 'none';
      },
    })),
  });




  // Button
  domc.addType('mj-button', {
    model: linkModel.extend(Object.assign({}, coreMjmlModel, {
      defaults: Object.assign({}, linkModel.prototype.defaults, {
        'custom-name': 'Button',
        draggable: '[data-type=mj-column]',
        highlightable: false,
        stylable: ['width', 'height',
          'background-color', 'container-background-color',
          'font-style', 'font-size', 'font-weight', 'font-family', 'color',
          'text-decoration', 'align',
          'vertical-align', 'text-transform',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color',],
        style: {
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
      }),

    }),{
      isComponent(el) {
        if (el.tagName == 'MJ-BUTTON') {
          return {type: 'mj-button'};
        }
      },
    }),

    view: linkView.extend(Object.assign({}, coreMjmlView, {
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
    })),
  });





  // Image
  domc.addType('mj-image', {
    model: imageModel.extend(Object.assign({}, coreMjmlModel, {
      defaults: Object.assign({}, imageModel.prototype.defaults, {
        'custom-name': 'Image',
        resizable: false,
        highlightable: false,
        draggable: '[data-type=mj-column]',
        stylable: [
          'width', 'height',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color',
          'container-background-color', 'align',
        ],
        style: {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '25px',
          'padding-left': '25px',
          'align': 'center',
        },
        traits: ['href', 'rel', 'alt', 'title'],
        void: true,
      }),
    }), {
      isComponent(el) {
        if (el.tagName == 'MJ-IMAGE') {
          return {type: 'mj-image'};
        }
      },
    }),

    view: imageView.extend(Object.assign({}, coreMjmlView, {
      tagName: 'tr',

      attributes: {
        style: 'pointer-events: all; display: table; width: 100%; user-select: none;',
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
        return 'img';
      },
    })),
  });





  // Social
  domc.addType('mj-social', {
    model: defaultModel.extend(Object.assign({}, coreMjmlModel, {
      defaults: Object.assign({}, defaultModel.prototype.defaults, {
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
        style: {
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
            value: '[[SHORT_PERMALINK]]',
          },{
            name: 'twitter-content',
            value: 'Tweet',
          },{
            name: 'twitter-href',
            value: '[[SHORT_PERMALINK]]',
          },{
            name: 'google-content',
            value: '+1',
          },{
            name: 'google-href',
            value: '[[SHORT_PERMALINK]]',
          },{
            name: 'instagram-content',
            value: 'Share',
          },{
            name: 'instagram-href',
            value: '[[SHORT_PERMALINK]]',
          },{
            name: 'linkedin-content',
            value: 'Share',
          },{
            name: 'linkedin-href',
            value: '[[SHORT_PERMALINK]]',
          },{
            name: 'pinterest-content',
            value: 'Pin it',
          },{
            name: 'pinterest-href',
            value: '[[SHORT_PERMALINK]]',
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
      }),
    }),{
      isComponent(el) {
        if (el.tagName == 'MJ-SOCIAL') {
          return {type: 'mj-social'};
        }
      },
    }),

    view: defaultView.extend(Object.assign({}, coreMjmlView, {
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
    }))

  });





  // Divider
  domc.addType('mj-divider', {
    model: defaultModel.extend(Object.assign({}, coreMjmlModel, {
      defaults: Object.assign({}, defaultModel.prototype.defaults, {
        'custom-name': 'Divider',
        draggable: '[data-type=mj-column]',
        droppable: false,
        style: {
          'width': '100%',
          'border-width': '4px',
          'border-style': 'solid',
          'border-color': '#000000',
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '25px',
          'padding-left': '25px',
        },
        stylable: [
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'width', 'container-background-color',
          'border-detached', 'border-width', 'border-style', 'border-color'
        ],
      }),
    }), {
      isComponent(el) {
        if (el.tagName == 'MJ-DIVIDER') {
          return {type: 'mj-divider'};
        }
      },
    }),
    view: defaultView.extend(Object.assign({}, coreMjmlView, {
      tagName: 'tr',

      attributes: {
        style: 'pointer-events: all; display: table; width: 100%; user-select: none;',
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
        return 'p';
      },
    })),

  });

}
