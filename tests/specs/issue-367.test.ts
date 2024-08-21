import grapesjs, { Editor } from 'grapesjs';
import grapesJSMJML from '../../src';

const rawMjml = `
    <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text
                >Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when an unknown
                printer took a galley of type and scrambled it to make a type
                specimen book. It has survived not only five centuries, but also
                the leap into electronic typesetting, remaining essentially
                unchanged. It was popularised in the 1960s with the release of
                Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum.
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
`;

// https://github.com/GrapesJS/mjml/issues/367
describe('Line Height', () => {
  let editor: Editor;

  beforeEach((done) => {
    const e = grapesjs.init({
      container: '#gjs',
      plugins: [grapesJSMJML],
    });
    editor = e;

    editor.getModel().loadOnStart();
    editor.on('change:readyLoad', () => done());
  });

  afterEach(() => {
    editor.destroy();
  });

  test('Editor exists', () => {
    expect(editor).toBeTruthy();
  });

  test('should expect default line height as 22px and export correctly in html', () => {
    editor.addComponents(rawMjml);

    const mjmlComponent = editor.getComponents().at(0);
    const mjmlBody = mjmlComponent.components().at(0);
    const mjmlSection = mjmlBody.components().at(0);
    const mjmlColumn = mjmlSection.components().at(0);
    const mjmlText = mjmlColumn.components().at(0);

    const lineHeight = mjmlText.getAttributes()['line-height'];
    expect(lineHeight).toBe(undefined);

    const { errors, html } = editor.Commands.run('mjml-code-to-html');

    expect(errors).toHaveLength(0);
    expect(html).toMatchSnapshot();
  });
});
