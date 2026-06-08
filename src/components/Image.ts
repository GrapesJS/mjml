// Specs: https://documentation.mjml.io/#mj-image
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType, reconcileChildren } from './utils';
import { type as typeSection } from './Section';
import { type as typeColumn } from './Column';
import { type as typeHero } from './Hero';

export const type = 'mj-image';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    extend: 'image',
    model: {
      ...coreMjmlModel,
      defaults: {
        resizable: false,
        highlightable: false,
        name: getName(editor, 'image'),
        draggable: componentsToQuery([typeSection, typeColumn, typeHero]),
        stylable: [
          'width',
          'height',
          'padding',
          'padding-top',
          'padding-left',
          'padding-right',
          'padding-bottom',
          'border-radius',
          'border-top-left-radius',
          'border-top-right-radius',
          'border-bottom-left-radius',
          'border-bottom-right-radius',
          'border',
          'border-width',
          'border-style',
          'border-color',
          'container-background-color',
          'align',
        ],
        'style-default': {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '25px',
          'padding-left': '25px',
          align: 'center',
        },
        traits: ['href', 'rel', 'alt', 'title'],
        void: false,
      },

      getStylesToAttributes() {
        const style = coreMjmlModel.getStylesToAttributes.call(this);

        // Fix #339
        if (style.width === 'auto') {
          delete style.width;
        }

        return style;
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%; user-select: none;',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body width="auto"><mj-column>`,
          end: `</mj-column></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl: any) {
        return sandboxEl.querySelector('tr').innerHTML;
      },

      // Mirrors `coreMjmlView.render` (see src/components/index.ts) exactly,
      // except the rendered subtree is reconciled into the existing DOM instead
      // of being replaced via `this.el.innerHTML`. This keeps the rendered <img>
      // node's identity across attribute/style edits, so the browser does not
      // reload and repaint the image (no flicker).
      // KEEP IN SYNC with the base render: if `coreMjmlView.render` gains or
      // reorders steps, mirror the change here, otherwise the two will drift.
      render(p: any, c: any, opts: any, appendChildren: boolean) {
        this.renderAttributes();
        const nextEl = this.el.cloneNode() as HTMLElement;
        nextEl.innerHTML = this.getTemplateFromMjml();

        if (this.el.hasChildNodes()) {
          reconcileChildren(this.el, nextEl);
        } else {
          this.el.innerHTML = nextEl.innerHTML;
        }

        (this as any).renderChildren(appendChildren);
        this.childNodes = this.getChildrenContainer().childNodes;
        this.renderStyle();
        this.postRender();

        return this;
      },

      getChildrenSelector() {
        return 'img';
      },
    },
  });
};
