import grapesjs, { Editor } from 'grapesjs';
import grapesJSMJML from '../../src';
import { customMjml, preset, registerEditorComponents } from '../fixtures/customComponents';

describe('Custom MJML previews', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = grapesjs.init({
      headless: true,
      storageManager: false,
      plugins: [(ed) => grapesJSMJML(ed, {
        mjmlPresets: [preset],
        customComponents: [registerEditorComponents],
      })],
    });
  });

  afterEach(() => {
    editor.destroy();
    document.body.innerHTML = '';
  });

  test('uses editor presets when rendering and updating a custom component', () => {
    editor.addComponents(customMjml);
    expect(editor.runCommand('mjml-code')).toBe(customMjml);
    const component = editor.getWrapper()!.findType('mj-callout')[0];
    const View = editor.Components.getType('mj-callout')!.view;
    const view = new View({
      model: component,
      config: { ...editor.Components.getConfig(), em: editor.getModel() },
    }) as InstanceType<typeof View> & { getTemplateFromMjml(): string };
    // Run the same compilation/extraction used by the canvas view.
    expect(view.getTemplateFromMjml()).toMatchSnapshot('initial preview');
    component.addAttributes({ color: '#654321' });
    expect(view.getTemplateFromMjml()).toMatchSnapshot('updated preview');
    expect(editor.runCommand('mjml-code')).toBe(customMjml.replace('#123456', '#654321'));
    const { html, errors } = editor.runCommand('mjml-code-to-html', { validationLevel: 'strict' });
    expect(errors).toEqual([]);
    expect(html).toMatchSnapshot('updated export');
  });
});
