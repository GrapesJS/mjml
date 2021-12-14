import { isComponentType, mjmlConvert } from './utils.js';

export default (editor, { dc, opt, coreMjmlModel, coreMjmlView, sandboxEl }) => {
  const type = 'mj-navbar';

  dc.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: editor.I18n.t('grapesjs-mjml.components.names.navBar'),
        draggable: '[data-gjs-type=mj-column],[data-gjs-type=mj-hero]',
        droppable: '[data-gjs-type=mj-navbar-link]',
        'style-default': {
          // TODO
        },
        stylable: [
          // TODO
        ],
        traits: [
          {
            type: 'select',
            label: 'Hamburger',
            name: 'hamburger',
            options: [
              { value: 'hamburger', name: 'ON' },
              { value: '', name: 'OFF' },
            ]
          }
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
        this.listenTo(this.model.get('components'), 'add remove', this.rerender);
      },

      getTemplateFromMjml() {
        let mjmlTmpl = this.getMjmlTemplate();
        let innerMjml = this.getInnerMjmlTemplate();
        const htmlOutput = mjmlConvert(`${mjmlTmpl.start}
          ${innerMjml.start}${innerMjml.end}${mjmlTmpl.end}`, opt.fonts);
        let html = htmlOutput.html;

        // I need styles for hamburger
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

      render(p, c, opts, appendChildren) {
        this.renderAttributes();
        const mjmlResult = this.getTemplateFromMjml();
        this.el.innerHTML = mjmlResult.content;
        this.$el.attr(mjmlResult.attributes);
        editor.addComponents(`<style>${mjmlResult.style}</style>`);
        this.getChildrenContainer().innerHTML = this.model.get('content');
        this.renderChildren(appendChildren);
        this.childNodes = this.getChildrenContainer().childNodes;
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
        return sandboxEl.firstChild.querySelector('tr');
      },

      getChildrenSelector() {
        return 'div.mj-inline-links';
      },

      // fix bug: https://github.com/artf/grapesjs-mjml/issues/242
      
      // rerender() {
      //   coreMjmlView.rerender.call(this);
      //   this.model.components().models.forEach((item) => {
      //     if (item.attributes.type != "mj-navbar-link") {
      //       return;
      //     }
      //     item.view.rerender();
      //   });
      // },

      renderChildren: function (appendChildren) {
        var container = this.getChildrenContainer();
        container.innerHTML = ''
  
        if (!appendChildren) {
          this.componentsView = new dc.ComponentsView({
            collection: this.model.get('components'),
            config: this.config,
            defaultTypes: this.opts.defaultTypes,
            componentTypes: this.opts.componentTypes,
          });
          this.childNodes = this.componentsView.render(container).el.childNodes;
        } else {
          this.componentsView.parentEl = container;
        }

        var childNodes = Array.prototype.slice.call(this.childNodes);
        for (var i = 0, len = childNodes.length; i < len; i++) {
          container.appendChild(childNodes.shift());
        }
  
        if (container !== this.el) {
          var disableNode = function (el) {
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

    },
  });
};
