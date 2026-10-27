/** @jest-environment node */

import { mjml2html } from '../../src';

test('preserves CSS inlining, CSS minification and URL minification in the browser compiler', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    const minifyOptions = { minifyCSS: true, minifyURLs: 'https://example.com/' };
    const { html, errors } = mjml2html(
      '<mjml><mj-head><mj-style inline="inline">.message { color: red; }</mj-style></mj-head>' +
      '<mj-body><mj-section><mj-column><mj-text font-family="Arial" css-class="message">' +
      '<a href="https://example.com/page">Content</a></mj-text></mj-column></mj-section></mj-body></mjml>',
      { minify: true, minifyOptions, validationLevel: 'strict' },
    );
    expect(errors).toEqual([]);
    expect(html).toMatchSnapshot();
  } finally {
    warn.mockRestore();
  }
});
