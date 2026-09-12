import grapesjs, { Editor } from 'grapesjs';
import grapesJSMJML from '../../src';

describe('Divider alignment', () => {
  let editor: Editor;

  beforeEach((done) => {
    document.body.innerHTML = '<div id="gjs"></div>';
    editor = grapesjs.init({
      container: '#gjs',
      plugins: [grapesJSMJML],
      storageManager: false,
    });
    editor.onReady(() => {
      jest.useFakeTimers();
      done();
    });
  });

  afterEach(() => {
    // Flush debounced selection/render work before destroying the editor.
    jest.runOnlyPendingTimers();
    editor.destroy();
    jest.useRealTimers();
  });

  function addDivider(attributes = '') {
    editor.addComponents(`<mjml><mj-body><mj-section><mj-column>
      <mj-divider width="50%" ${attributes}></mj-divider>
    </mj-column></mj-section></mj-body></mjml>`);
    const divider = editor.getWrapper()!.findType('mj-divider')[0];
    editor.select(divider);
    jest.runOnlyPendingTimers();
    const sector = editor.StyleManager.getSectors().find((s) => s.getName() === 'Typography');
    return { divider, alignment: sector!.getProperty('align')! };
  }

  test('exposes the existing alignment control for dividers', () => {
    const { alignment } = addDivider();
    expect(alignment.isVisible()).toBe(true);
  });

  test('uses the MJML center default without adding it to exported markup', () => {
    const { divider, alignment } = addDivider();
    expect(alignment.getValue()).toBe('center');
    expect(divider.getStyle().align).toBe('center');
    expect(divider.toHTML()).not.toContain('align=');
  });

  test.each(['left', 'center', 'right'])('applies %s alignment through Style Manager', (align) => {
    const { divider, alignment } = addDivider();
    alignment.upValue(align);
    expect(divider.getAttributes().align).toBe(align);
    const mjml = divider.toHTML();
    expect(mjml).toContain('width="50%"');
    if (align !== 'center') expect(mjml).toContain(`align="${align}"`);
    const { errors, html } = editor.Commands.run('mjml-code-to-html');
    expect(errors).toHaveLength(0);
    const document = new DOMParser().parseFromString(html, 'text/html');
    const line = document.querySelector('p')!;
    expect(line.parentElement!.getAttribute('align')).toBe(align);
  });

  test.each(['left', 'right'])('preserves explicitly imported %s alignment', (align) => {
    const { divider, alignment } = addDivider(`align="${align}"`);
    expect(alignment.getValue()).toBe(align);
    expect(divider.toHTML()).toContain(`align="${align}"`);
  });
});
