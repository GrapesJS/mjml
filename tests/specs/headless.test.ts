/** @jest-environment node */

import grapesjs, { Editor } from 'grapesjs';
import grapesJSMJML from '../../src';

describe('Headless MJML', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = grapesjs.init({
      headless: true,
      storageManager: false,
      plugins: [grapesJSMJML],
    });
  });

  afterEach(() => {
    editor?.destroy();
  });

  test('adds object components and exports MJML and HTML without a DOM', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');

    editor.addComponents({
      type: 'mjml',
      components: [{
        type: 'mj-body',
        components: [{
          type: 'mj-section',
          components: [{
            type: 'mj-column',
            components: [{
              type: 'mj-text',
              attributes: { color: '#123456' },
              content: 'Headless MJML',
            }, {
              type: 'mj-button',
              attributes: { href: 'https://example.com' },
              content: 'Read more',
            }, {
              type: 'mj-image',
              src: 'https://example.com/image.png',
            }],
          }],
        }],
      }],
    });

    const mjml = editor.runCommand('mjml-code');
    expect(mjml).toBe(
      '<mjml><mj-body><mj-section><mj-column>' +
      '<mj-text color="#123456">Headless MJML</mj-text>' +
      '<mj-button href="https://example.com">Read more</mj-button>' +
      '<mj-image src="https://example.com/image.png"></mj-image>' +
      '</mj-column></mj-section></mj-body></mjml>'
    );

    const { html, errors } = editor.runCommand('mjml-code-to-html');
    expect(errors).toEqual([]);
    expect(html).toMatchSnapshot('initial HTML');

    const image = editor.getWrapper()!.findType('mj-image')[0];
    image.set('src', 'https://example.com/updated.png');
    expect(editor.runCommand('mjml-code')).toBe(
      '<mjml><mj-body><mj-section><mj-column>' +
      '<mj-text color="#123456">Headless MJML</mj-text>' +
      '<mj-button href="https://example.com">Read more</mj-button>' +
      '<mj-image src="https://example.com/updated.png"></mj-image>' +
      '</mj-column></mj-section></mj-body></mjml>'
    );
    const { html: updatedHtml, errors: updatedErrors } = editor.runCommand('mjml-code-to-html');
    expect(updatedErrors).toEqual([]);
    expect(updatedHtml).toMatchSnapshot('HTML after image update');
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });

  test('exports head components, object HTML children and model changes after reloading project data', () => {
    editor.addComponents({
      type: 'mjml',
      components: [{
        type: 'mj-head',
        components: [{
          type: 'mj-font',
          attributes: { name: 'Barlow', href: 'https://example.com/font.css' },
        }, {
          type: 'mj-style',
          content: '.headline { font-weight: bold; }',
        }],
      }, {
        type: 'mj-body',
        components: [{
          type: 'mj-wrapper',
          components: [{
            type: 'mj-section',
            components: [{
              type: 'mj-group',
              components: [{
                type: 'mj-column',
                components: [{
                  type: 'mj-text',
                  attributes: { 'font-family': 'Barlow', 'css-class': 'headline' },
                  components: [{
                    tagName: 'strong',
                    content: 'Object HTML content',
                  }],
                }],
              }],
            }],
          }],
        }, {
          type: 'mj-raw',
          content: '<div>Raw HTML content</div>',
        }],
      }],
    });

    const text = editor.getWrapper()!.findType('mj-text')[0];
    text.addStyle({ color: '#654321' });
    text.addAttributes({ 'font-size': '20px' });

    const expectedMjml = '<mjml><mj-head>' +
      '<mj-font name="Barlow" href="https://example.com/font.css"></mj-font>' +
      '<mj-style>.headline { font-weight: bold; }</mj-style>' +
      '</mj-head><mj-body><mj-wrapper><mj-section><mj-group><mj-column>' +
      '<mj-text font-family="Barlow" css-class="headline" font-size="20px" color="#654321">' +
      '<strong>Object HTML content</strong></mj-text>' +
      '</mj-column></mj-group></mj-section></mj-wrapper>' +
      '<mj-raw><div>Raw HTML content</div></mj-raw>' +
      '</mj-body></mjml>';

    expect(editor.runCommand('mjml-code')).toBe(expectedMjml);
    editor.loadProjectData(editor.getProjectData());
    expect(editor.runCommand('mjml-code')).toBe(expectedMjml);

    const { html, errors } = editor.runCommand('mjml-code-to-html');
    expect(errors).toEqual([]);
    expect(html).toMatchSnapshot('HTML after project reload');
  });
});
