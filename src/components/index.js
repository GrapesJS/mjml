import { mjml2html } from 'mjml';
import loadMjml from './mjml';
import loadHead from './Head';
import loadBody from './Body';
import loadContainer from './Container';
import loadSection from './Section';
import loadColumn from './Column';
import loadText from './Text';
import loadButton from './Button';
import loadImage from './Image';
import loadSocial from './Social';

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
  const dc = domc;
  const ComponentsView = domc.ComponentsView;
  const sandboxEl = document.createElement('div');




  // MJML Core model
  let coreMjmlModel = {
    init() {
      let attrs = { ...this.get('attributes') };
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
      const style = { ...this.get('attributes'), ...this.get('style') };
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
  const compOpts = {
      dc, coreMjmlModel, coreMjmlView, opt, sandboxEl, defaultModel, defaultView,
      textModel, textView, linkModel, linkView, imageModel, imageView
  };

  loadMjml(editor, compOpts);
  loadHead(editor, compOpts);
  loadBody(editor, compOpts);
  loadContainer(editor, compOpts);
  loadSection(editor, compOpts);
  loadColumn(editor, compOpts);
  loadText(editor, compOpts);
  loadButton(editor, compOpts);
  loadImage(editor, compOpts);
  loadSocial(editor, compOpts);




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
