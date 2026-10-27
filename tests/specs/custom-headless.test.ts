/** @jest-environment node */

import grapesjs, { Editor } from 'grapesjs';
import grapesJSMJML, { mjml2html, registerComponent, registerDependencies } from '../../src';
import { customMjml, customProject, MjCallout, MjCustomTitle, preset, registerEditorComponents } from '../fixtures/customComponents';

describe('Custom MJML components without a DOM', () => {
  const editors: Editor[] = [];

  function createEditor(presets = [preset]) {
    const editor = grapesjs.init({
      headless: true,
      storageManager: false,
      plugins: [(ed) => grapesJSMJML(ed, {
        mjmlPresets: presets,
        customComponents: [registerEditorComponents],
      })],
    });
    editors.push(editor);
    return editor;
  }

  afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()));

  test('registers body and head classes in the compiler used by default exports', () => {
    class MjRegisteredCallout extends MjCallout {
      static componentName = 'mj-registered-callout';
      static dependencies = { 'mj-column': ['mj-registered-callout'], 'mj-registered-callout': [] };
    }
    class MjRegisteredTitle extends MjCustomTitle {
      static componentName = 'mj-registered-title';
      static dependencies = { 'mj-head': ['mj-registered-title'], 'mj-registered-title': [] };
    }
    registerComponent(MjRegisteredCallout, { registerDependencies: true });
    registerComponent(MjRegisteredTitle);
    registerDependencies(MjRegisteredTitle.dependencies);

    const editor = createEditor([]);
    editor.addComponents(customProject(true));
    const expectedMjml = '<mjml><mj-head><mj-registered-title>Custom title</mj-registered-title></mj-head>' +
      '<mj-body><mj-section><mj-column><mj-registered-callout color="#123456">' +
      '<strong>Custom content</strong></mj-registered-callout></mj-column></mj-section></mj-body></mjml>';
    expect(editor.runCommand('mjml-code')).toBe(expectedMjml);
    editor.loadProjectData(editor.getProjectData());
    expect(editor.runCommand('mjml-code')).toBe(expectedMjml);

    const { html, errors } = editor.runCommand('mjml-code-to-html', { validationLevel: 'strict' });
    expect(errors).toEqual([]);
    expect(html).toMatchSnapshot();
    expect(mjml2html(expectedMjml, { validationLevel: 'strict' }).html).toBe(html);
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });

  test('keeps presets local to each editor and merges command presets', () => {
    const first = createEditor();
    const second = createEditor([]);
    first.addComponents(customProject());
    second.addComponents(customProject());
    expect(first.runCommand('mjml-code')).toBe(customMjml);
    expect(second.runCommand('mjml-code')).toBe(customMjml);

    const result = first.runCommand('mjml-code-to-html', { validationLevel: 'strict' });
    expect(result.errors).toEqual([]);
    expect(result.html).toMatchSnapshot('editor presets');
    expect(() => second.runCommand('mjml-code-to-html', { validationLevel: 'strict' })).toThrow('ValidationError');
    expect(() => mjml2html(customMjml, { validationLevel: 'strict' })).toThrow('ValidationError');

    class MjAlternateCallout extends MjCallout {
      render() {
        return this.renderMJML(`<mj-text padding="0">Alternative: ${this.getContent()}</mj-text>`);
      }
    }
    const override = { components: [MjAlternateCallout], dependencies: {} };
    const alternative = first.runCommand('mjml-code-to-html', { presets: [override], validationLevel: 'strict' });
    expect(alternative.errors).toEqual([]);
    expect(alternative.html).toMatchSnapshot('command preset override');
    expect(first.runCommand('mjml-code-to-html', { validationLevel: 'strict' })).toEqual(result);
    expect(() => second.runCommand('mjml-code-to-html', { validationLevel: 'strict' })).toThrow('ValidationError');
  });

  test('validates custom attributes and parent relationships', () => {
    const invalidParent = '<mjml><mj-body><mj-section><mj-callout>Invalid</mj-callout></mj-section></mj-body></mjml>';
    expect(() => mjml2html(invalidParent, { presets: [preset], validationLevel: 'strict' })).toThrow('mj-callout cannot be used inside mj-section');
    const invalidAttribute = customMjml.replace('color="#123456"', 'unknown="value"');
    expect(() => mjml2html(invalidAttribute, { presets: [preset], validationLevel: 'strict' })).toThrow('Attribute unknown is illegal');
  });
});
