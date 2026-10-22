import type mjml from 'mjml-core';

/**
 * MJML Parser.
 * 
 * @see {@link https://github.com/mjmlio/mjml/tree/master/packages/mjml-core}
 */
export type MjmlParser = typeof mjml;

/**
 * MJML Parser instance.
 */
let parser: MjmlParser;

const mjml2html: MjmlParser = (input, options) => {
  if (!parser) {
    const scope = globalThis as { window?: unknown };
    const hasWindow = 'window' in scope;

    // MJML v4's UMD wrapper references window even when loading as CommonJS.
    // Only its loader needs this global; compilation itself works without a DOM.
    if (!hasWindow) scope.window = {};

    try {
      parser = require('mjml-browser');
    } finally {
      if (!hasWindow) delete scope.window;
    }
  }

  return parser(input, options);
};

export default mjml2html;
