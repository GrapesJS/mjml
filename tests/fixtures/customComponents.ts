import type { Editor } from 'grapesjs';
import { BodyComponent, HeadComponent, MjmlDependencies, MjmlPreset } from '../../src';

export class MjCallout extends BodyComponent {
  static componentName = 'mj-callout';
  static endingTag = true;
  static allowedAttributes = { color: 'color' };
  static defaultAttributes = { color: '#123456' };
  static dependencies: MjmlDependencies = { 'mj-column': ['mj-callout'], 'mj-callout': [] };

  render() {
    return this.renderMJML(
      `<mj-text padding="0" color="${this.getAttribute('color')}">${this.getContent()}</mj-text>`
    );
  }
}

export class MjCustomTitle extends HeadComponent {
  static componentName = 'mj-custom-title';
  static endingTag = true;
  static dependencies: MjmlDependencies = { 'mj-head': ['mj-custom-title'], 'mj-custom-title': [] };

  handler() {
    this.context.add('title', this.getContent());
  }
}

export const preset: MjmlPreset = {
  components: [MjCallout, MjCustomTitle],
  dependencies: { ...MjCallout.dependencies, ...MjCustomTitle.dependencies },
};

export function registerEditorComponents(editor: Editor) {
  ['mj-callout', 'mj-registered-callout'].forEach((type) => {
    editor.Components.addType(type, {
      extend: 'mj-text',
      isComponent: (el) => el.tagName?.toLowerCase() === type,
      model: { defaults: { tagName: type, 'style-default': {} } },
    });
  });
  ['mj-custom-title', 'mj-registered-title'].forEach((type) => {
    editor.Components.addType(type, {
      extend: 'mj-font',
      isComponent: (el) => el.tagName?.toLowerCase() === type,
      model: { defaults: { tagName: type } },
    });
  });
}

export const customMjml = '<mjml><mj-head><mj-custom-title>Custom title</mj-custom-title></mj-head>' +
  '<mj-body><mj-section><mj-column><mj-callout color="#123456">' +
  '<strong>Custom content</strong></mj-callout></mj-column></mj-section></mj-body></mjml>';

export function customProject(registered = false) {
  return {
    type: 'mjml',
    components: [{
      type: 'mj-head',
      components: [{ type: registered ? 'mj-registered-title' : 'mj-custom-title', content: 'Custom title' }],
    }, {
      type: 'mj-body',
      components: [{
        type: 'mj-section',
        components: [{
          type: 'mj-column',
          components: [{
            type: registered ? 'mj-registered-callout' : 'mj-callout',
            attributes: { color: '#123456' },
            components: [{ tagName: 'strong', content: 'Custom content' }],
          }],
        }],
      }],
    }],
  };
}
