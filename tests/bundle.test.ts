/** @jest-environment node */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createContext, runInContext } from 'node:vm';
import grapesjs from 'grapesjs';
import ts from 'typescript';
import { customMjml, customProject, registerEditorComponents } from './fixtures/customComponents';

test('published declarations expose the compiler and registration APIs', () => {
  const declaration = resolve(__dirname, '../dist/index.d.ts');
  const program = ts.createProgram([declaration], { skipLibCheck: true, types: [] });
  const checker = program.getTypeChecker();
  const symbol = checker.getSymbolAtLocation(program.getSourceFile(declaration)!)!;
  const exports = checker.getExportsOfModule(symbol).map((item) => item.name);
  expect(exports).toEqual(expect.arrayContaining([
    'default', 'mjml2html', 'BodyComponent', 'HeadComponent', 'registerComponent', 'registerDependencies',
  ]));
});

// Run after `npm run build` to cover the published, minified UMD artifact.
describe.each(['CommonJS', 'browser global'])('Published bundle: %s', (environment) => {
  test('shares registration APIs with the default plugin without Node or DOM globals', () => {
    let api: typeof import('../src');
    if (environment === 'CommonJS') {
      api = require('../dist');
    } else {
      const context = createContext({ console, setTimeout, clearTimeout });
      runInContext(readFileSync(resolve(__dirname, '../dist/index.js'), 'utf8'), context, { timeout: 10000 });
      api = context['grapesjs-mjml'];
      expect(context.window).toBeUndefined();
      expect(context.document).toBeUndefined();
      expect(context.process).toBeUndefined();
      expect(context.require).toBeUndefined();
    }

    class MjCallout extends api.BodyComponent {
      static componentName = 'mj-callout';
      static endingTag = true;
      static allowedAttributes = { color: 'color' };
      static dependencies = { 'mj-column': ['mj-callout'], 'mj-callout': [] };
      render() {
        return this.renderMJML(`<mj-text padding="0" color="${this.getAttribute('color')}">${this.getContent()}</mj-text>`);
      }
    }
    class MjCustomTitle extends api.HeadComponent {
      static componentName = 'mj-custom-title';
      static endingTag = true;
      handler() { this.context.add('title', this.getContent()); }
    }
    api.registerComponent(MjCallout, { registerDependencies: true });
    api.registerComponent(MjCustomTitle);
    api.registerDependencies({ 'mj-head': ['mj-custom-title'], 'mj-custom-title': [] });

    const editor = grapesjs.init({
      headless: true,
      storageManager: false,
      plugins: [(ed) => api.default(ed, { customComponents: [registerEditorComponents] })],
    });
    try {
      editor.addComponents(customProject());
      expect(editor.runCommand('mjml-code')).toBe(customMjml);
      const { html, errors } = editor.runCommand('mjml-code-to-html', { validationLevel: 'strict' });
      expect(errors).toEqual([]);
      expect(html).toMatchSnapshot();
      expect(typeof window).toBe('undefined');
      expect(typeof document).toBe('undefined');
    } finally {
      editor.destroy();
    }
  });
});
