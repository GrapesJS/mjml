import { Editor } from 'grapesjs';
import grapesJSMJML from '../../src';
import { createTestEditor } from '../utils';

describe('Wrapper', () => {
  let editor: Editor;

  beforeEach((done) => {
    document.body.innerHTML = '<div id="gjs"></div>';
    editor = createTestEditor({
      container: '#gjs',
      plugins: [grapesJSMJML],
    });
    editor.onReady(() => {
      jest.useFakeTimers();
      done();
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    editor.destroy();
    jest.useRealTimers();
  });

  test('keeps children rendered when attributes change after a child is removed', () => {
    editor.setComponents(`<mjml><mj-body><mj-wrapper>
      <mj-section><mj-column><mj-text>First</mj-text></mj-column></mj-section>
      <mj-section><mj-column><mj-text>Second</mj-text></mj-column></mj-section>
    </mj-wrapper></mj-body></mjml>`);
    const wrapper = editor.getWrapper()!.findType('mj-wrapper')[0];
    const [first, second] = wrapper.components().models;
    const getSectionEls = () => wrapper.getEl()!.querySelectorAll('[data-gjs-type="mj-section"]');
    expect(getSectionEls()).toHaveLength(2);

    first.remove();
    expect(getSectionEls()).toHaveLength(1);

    wrapper.addAttributes({ 'background-color': '#ff0000' });
    jest.runOnlyPendingTimers();
    const sectionEls = getSectionEls();
    expect(sectionEls).toHaveLength(1);
    expect(sectionEls[0]).toBe(second.getEl());
  });

  test('keeps children rendered when attributes change after a child is added', () => {
    editor.setComponents(`<mjml><mj-body><mj-wrapper>
      <mj-section><mj-column><mj-text>First</mj-text></mj-column></mj-section>
    </mj-wrapper></mj-body></mjml>`);
    const wrapper = editor.getWrapper()!.findType('mj-wrapper')[0];
    wrapper.append('<mj-section><mj-column><mj-text>Second</mj-text></mj-column></mj-section>');
    const getSectionEls = () => wrapper.getEl()!.querySelectorAll('[data-gjs-type="mj-section"]');
    expect(getSectionEls()).toHaveLength(2);

    wrapper.addAttributes({ 'background-color': '#ff0000' });
    jest.runOnlyPendingTimers();
    const sectionEls = getSectionEls();
    expect(sectionEls).toHaveLength(2);
    expect(Array.from(sectionEls)).toEqual(wrapper.components().map((cmp) => cmp.getEl()));
  });
});
